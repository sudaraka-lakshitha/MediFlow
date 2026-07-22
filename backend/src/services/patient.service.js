import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';

const include = {
  user: { select: { id:true, fullName:true, email:true, phone:true, active:true, createdAt:true } },
  registeredBy: { select: { id:true, fullName:true, role:true } },
};

const temporaryPassword = () => `Tmp${crypto.randomBytes(5).toString('hex')}!`;

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
    const where = search ? { OR: [
      { user: { fullName: { contains: search } } },
      { user: { email: { contains: search } } },
      { user: { phone: { contains: search } } },
      { patientNumber: { contains: search } },
    ] } : {};
    const [rows, total] = await Promise.all([
      prisma.patientProfile.findMany({ where, include, orderBy: { createdAt: 'desc' }, take }),
      prisma.patientProfile.count({ where }),
    ]);
    return { rows, total, hasMore: total > rows.length };
  },
  async create(data, staff) {
    if (data.phone) {
      const existing = await prisma.user.findFirst({ where: { phone: data.phone, role: 'PATIENT' }, select: { fullName: true, patientProfile: { select: { id: true, patientNumber: true } } } });
      if (existing) throw new AppError(409, `A patient with this phone number already exists: ${existing.fullName} (${existing.patientProfile?.patientNumber || 'no patient number'}). Search for them instead of creating a duplicate.`);
    }
    return prisma.$transaction(async (tx) => {
      const generatedPassword = data.password || temporaryPassword();
      const user = await tx.user.create({ data: { email:data.email.toLowerCase(), fullName:data.fullName, phone:data.phone||null, passwordHash:await bcrypt.hash(generatedPassword,12), mustChangePassword:true, role:'PATIENT' } });
      const patient = await tx.patientProfile.create({ data: { userId:user.id, patientNumber:`PAT-${crypto.randomUUID().slice(0,8).toUpperCase()}`, dateOfBirth:data.dateOfBirth, address:data.address, allergies:data.allergies, chronicConditions:data.chronicConditions||null, registrationSource:staff.role, registeredById:staff.id }, include });
      return { ...patient, temporaryPassword: generatedPassword };
    });
  },
  update(id,data) {
    return prisma.$transaction(async (tx) => {
      const profile=await tx.patientProfile.findUniqueOrThrow({where:{id}});
      await tx.user.update({where:{id:profile.userId},data:{email:data.email.toLowerCase(),fullName:data.fullName,phone:data.phone||null}});
      return tx.patientProfile.update({where:{id},data:{dateOfBirth:data.dateOfBirth,address:data.address,allergies:data.allergies,chronicConditions:data.chronicConditions||null},include});
    });
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
  async healthRecord(id) {
    const profile = await prisma.patientProfile.findUniqueOrThrow({
      where: { id },
      include: {
        user: { select: { id:true, fullName:true, email:true, phone:true, active:true, createdAt:true } },
        registeredBy: { select: { id:true, fullName:true, role:true } },
        prescriptions: {
          orderBy: { prescriptionDate: 'desc' },
          take: 60,
          include: {
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
};
