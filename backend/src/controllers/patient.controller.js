import { patientService } from '../services/patient.service.js';
import { recordAudit } from '../services/audit.service.js';

export const patientController={
  myNotices:async(req,res)=>res.json({data:await patientService.noticesForUser(req.user.id)}),
  myHealthRecord:async(req,res)=>res.json({data:await patientService.healthRecordForUser(req.user.id)}),
  createNotice:async(req,res)=>{const notice=await patientService.createNotice(Number(req.params.id),req.body,req.user.id);await recordAudit({userId:req.user.id,action:'PATIENT_NOTICE_SENT',entityType:'PATIENT',entityId:Number(req.params.id),details:{title:req.body.title},ipAddress:req.ip});res.status(201).json({data:notice,message:'Notice sent to patient.'})},
  list:async(req,res)=>{const {rows,total,hasMore}=await patientService.list(req.query);res.json({data:rows,total,hasMore})},
  create:async(req,res)=>{const patient=await patientService.create(req.body,req.user);await recordAudit({userId:req.user.id,action:'PATIENT_CREATED',entityType:'PATIENT',entityId:patient.id,details:{registrationSource:req.user.role},ipAddress:req.ip});res.status(201).json({data:patient})},
  update:async(req,res)=>{const patient=await patientService.update(Number(req.params.id),req.body);await recordAudit({userId:req.user.id,action:'PATIENT_UPDATED',entityType:'PATIENT',entityId:patient.id,ipAddress:req.ip});res.json({data:patient})},
  resetPassword:async(req,res)=>{const patient=await patientService.resetPassword(Number(req.params.id),req.body.password);await recordAudit({userId:req.user.id,action:'PATIENT_PASSWORD_RESET',entityType:'PATIENT',entityId:patient.id,ipAddress:req.ip});res.json({data:patient,message:'Patient password reset successfully.'})},
  remove:async(req,res)=>{const patient=await patientService.remove(Number(req.params.id));await recordAudit({userId:req.user.id,action:'PATIENT_DEACTIVATED',entityType:'PATIENT',entityId:patient.id,ipAddress:req.ip});res.json({data:patient,message:'Patient account deactivated.'})},
  setActive:async(req,res)=>{const patient=await patientService.setActive(Number(req.params.id),req.body.active);await recordAudit({userId:req.user.id,action:'PATIENT_STATUS_CHANGED',entityType:'PATIENT',entityId:patient.id,details:{active:patient.user.active},ipAddress:req.ip});res.json({data:patient})},
  healthRecord:async(req,res)=>res.json({data:await patientService.healthRecord(Number(req.params.id))}),
};
