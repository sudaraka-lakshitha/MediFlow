import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma.js';
import { DEFAULT_TRANSACTION_OPTIONS } from '../utils/serializable.js';
import { AppError } from '../utils/AppError.js';
import { normalizePatientPhone, syncPatientPhoneIdentity } from '../utils/patientPhoneIdentity.js';
import { patientDirections } from '../utils/patientDirections.js';
import { historySearch } from '../utils/historySearch.js';

const include = {
  user: { select: { id:true, fullName:true, email:true, phone:true, active:true, createdAt:true, updatedAt:true } },
  registeredBy: { select: { id:true, fullName:true, role:true } },
};

const temporaryPassword = () => `Tmp${crypto.randomBytes(5).toString('hex')}!`;
const walkInEmail = () => `walkin-${crypto.randomUUID()}@patients.mediflow.invalid`;
const hasOnlineAccess = (patient) => !patient.user.email.endsWith('@patients.mediflow.invalid');
const withAccessMode = (patient) => ({ ...patient, onlineAccess: hasOnlineAccess(patient) });

export const patientService = {
  noticesForUser: (userId) => prisma.patientNotice.findMany({ where: { patientId: userId }, include: { createdBy: { select: { fullName: true, role: true } } }, orderBy: { createdAt: 'desc' }, take: 50 }),
  async createNotice(profileId, data, createdById) {
    const patient = await prisma.patientProfile.findUnique({ where: { id: profileId }, select: { userId: true } });
    if (!patient) throw new AppError(404, 'Patient not found.');
    return prisma.patientNotice.create({ data: { patientId: patient.userId, createdById, title: data.title, message: data.message }, include: { createdBy: { select: { fullName: true, role: true } } } });
  },
  async list(query = {}) {
    const search = query.search?.trim();
    const take = Math.min(Number(query.limit) || 100, 200);
    const where = query.userId ? { userId: Number(query.userId) } : search ? { OR: [
      { user: { fullName: { contains: search } } },
      { user: { email: { contains: search } } },
      { user: { phone: { contains: search } } },
      { patientNumber: { contains: search } },
    ] } : {};
    const [rows, total] = await Promise.all([
      prisma.patientProfile.findMany({ where, include, orderBy: { createdAt: 'desc' }, take }),
      prisma.patientProfile.count({ where }),
    ]);
    return { rows: rows.map(withAccessMode), total, hasMore: total > rows.length };
  },
  async create(data, staff) {
    if (data.phone) {
      const existing = await prisma.user.findFirst({ where: { role: 'PATIENT', OR: [{ phone: data.phone }, { patientPhoneIdentity: { is: { phone: normalizePatientPhone(data.phone) } } }] }, select: { fullName: true, patientProfile: { select: { id: true, patientNumber: true } } } });
      if (existing) throw new AppError(409, `A patient with this phone number already exists: ${existing.fullName} (${existing.patientProfile?.patientNumber || 'no patient number'}). Search for them instead of creating a duplicate.`);
    }
    const onlineAccess = data.onlineAccess !== false;
    const generatedPassword = onlineAccess ? (data.password || temporaryPassword()) : temporaryPassword();
    const email = onlineAccess ? data.email.toLowerCase() : walkInEmail();
    const passwordHash = await bcrypt.hash(generatedPassword, 12);
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({ data: { email, fullName:data.fullName, phone:data.phone||null, passwordHash, active:onlineAccess, mustChangePassword:onlineAccess, role:'PATIENT' } });
      const patient = await tx.patientProfile.create({ data: { userId:user.id, patientNumber:`PAT-${crypto.randomUUID().slice(0,8).toUpperCase()}`, dateOfBirth:data.dateOfBirth, address:data.address, allergies:data.allergies, chronicConditions:data.chronicConditions||null, registrationSource:staff.role, registeredById:staff.id }, include });
      await syncPatientPhoneIdentity(tx, user.id, data.phone);
      return { ...patient, onlineAccess, temporaryPassword: onlineAccess ? generatedPassword : undefined };
    }, DEFAULT_TRANSACTION_OPTIONS);
  },
  update(id,data) {
    return prisma.$transaction(async (tx) => {
      const profile=await tx.patientProfile.findUniqueOrThrow({where:{id}});
      const userData = {email:data.email?data.email.toLowerCase():undefined,fullName:data.fullName,phone:data.phone === undefined ? undefined : data.phone || null};
      if (data.expectedUpdatedAt) {
        const expected = new Date(data.expectedUpdatedAt);
        const claimed = await tx.user.updateMany({ where: { id: profile.userId, updatedAt: expected }, data: { ...userData, updatedAt: new Date(Math.max(Date.now(), expected.getTime() + 1)) } });
        if (claimed.count !== 1) throw new AppError(409, 'This patient record changed. Refresh and review the latest details before saving.');
      } else await tx.user.update({where:{id:profile.userId},data:userData});
      if (data.phone !== undefined) await syncPatientPhoneIdentity(tx, profile.userId, data.phone);
      return tx.patientProfile.update({where:{id},data:{dateOfBirth:data.dateOfBirth,address:data.address,allergies:data.allergies,chronicConditions:data.chronicConditions === undefined ? undefined : data.chronicConditions || null},include});
    }, DEFAULT_TRANSACTION_OPTIONS);
  },
  async resetPassword(id,password) {
    const profile=await prisma.patientProfile.findUniqueOrThrow({where:{id}});
    const generatedPassword = password || temporaryPassword();
    await prisma.user.update({
      where:{id:profile.userId},
      data:{
        passwordHash:await bcrypt.hash(generatedPassword,12),
        mustChangePassword:true,
        passwordChangedAt:new Date(),
        tokenVersion:{increment:1},
      },
    });
    return {id,email:(await prisma.user.findUnique({where:{id:profile.userId}})).email,temporaryPassword:generatedPassword};
  },
  async remove(id) {
    const profile=await prisma.patientProfile.findUniqueOrThrow({where:{id}});
    await prisma.user.update({where:{id:profile.userId},data:{active:false,tokenVersion:{increment:1}}});
    return {id,userId:profile.userId};
  },
  async setActive(id, active) {
    const profile = await prisma.patientProfile.findUniqueOrThrow({ where: { id } });
    await prisma.user.update({ where: { id: profile.userId }, data: { active, tokenVersion: { increment: 1 } } });
    return prisma.patientProfile.findUnique({ where: { id }, include });
  },
  async healthRecord(id, { page = 1, pageSize = 300, search } = {}) {
    const profile = await prisma.patientProfile.findUniqueOrThrow({
      where: { id },
      include: {
        user: { select: { id:true, fullName:true, email:true, phone:true, active:true, createdAt:true } },
        registeredBy: { select: { id:true, fullName:true, role:true } },
        prescriptions: {
          where: historySearch(search, ['prescriptionNumber', 'prescriberName', 'recipientName']),
          orderBy: [{ prescriptionDate: 'desc' }, { id: 'desc' }],
          skip: (page - 1) * pageSize, take: pageSize,
          include: {
            paymentRequest: { select: { status: true } },
            items: {
              include: {
                product: { select: { genericName:true, strength:true, dosageForm:true, unit:true } },
              },
            },
            dispensings: { select: { dispensedAt:true }, orderBy: { dispensedAt:'desc' }, take:1 },
          },
        },
      },
    });
    return profile;
  },
  async healthRecordForUser(userId, pagination) {
    const profile = await prisma.patientProfile.findUnique({ where: { userId }, select: { id: true } });
    if (!profile) throw new AppError(404, 'Patient profile not found.');
    const record = await this.healthRecord(profile.id, pagination);
    return { ...record, prescriptions: record.prescriptions.map(prescription => ({
      id: prescription.id, prescriptionNumber: prescription.prescriptionNumber, prescriptionDate: prescription.prescriptionDate,
      status: prescription.status, prescriberTitle: prescription.prescriberTitle, prescriberName: prescription.prescriberName,
      items: patientDirections(prescription), dispensings: prescription.dispensings,
    })) };
  },
};
