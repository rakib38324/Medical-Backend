import httpStatus from 'http-status';
import config from '../../config/config';
import AppError from '../../errors/appError';
import { Doctor } from '../Doctors/doctors.model';
import { User } from '../UsersRegistration/userRegistration.model';
import { Appointment } from './appointment.model';
import Stripe from 'stripe';
import { TypeAppointment } from './appointment.interface';
import { sendEmail } from '../../utiles/sendEmail';

const stripe = new Stripe(config.stripe_secrect!); // Use your secret key from environment variables

const createAppointmentPayemntIntent = async (id: string) => {
  const doctor = await Doctor.findById({ _id: id });
  const userdoctor = await User.findOne({ doctorId: id });

  if (!doctor || !userdoctor) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Doctor not found.');
  }

  const payment_intent = await stripe.paymentIntents.create({
    amount: doctor.amount * 100,
    currency: 'usd',
    description: 'Appoint for chating',
    payment_method_types: ['card'],
  });

  return payment_intent.client_secret;
};

const createAppointmentIntoDB = async (payload: TypeAppointment) => {
  const userdoctor = await User.findOne({ doctorId: payload?.doctorId });
  const doctor = await Doctor.findById({ _id: payload?.doctorId });

  if (!doctor || !userdoctor) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Doctor not found.');
  }
  const userInfo = await User.findById({ _id: payload?.userId });

  if (!userInfo) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found.');
  }

  const updatePayload = {
    doctorId: userdoctor?._id,
    userId: payload.userId,
    paymentId: payload.paymentId,
  };

  // Create a new appointment
  const newAppointment = await Appointment.create(updatePayload);

  // Update doctor's appointments by pushing the new appointment ID
  await Doctor.findByIdAndUpdate(
    payload?.doctorId,
    { $push: { appointments: newAppointment._id } },
    { new: true, runValidators: true },
  );

  // Update userdoctor doctor's appointments by pushing the new appointment ID
  await User.findByIdAndUpdate(
    { _id: userdoctor?._id },
    { $push: { appointments: newAppointment._id } },
    { new: true, runValidators: true },
  );

  // Update user's appointments by pushing the new appointment ID
  await User.findByIdAndUpdate(
    payload?.userId,
    { $push: { appointments: newAppointment._id } },
    { new: true, runValidators: true },
  );

  const userSubject = `Your Appointment Confirmed with Dr. ${doctor?.name}`;
  const doctorSubject = `New Appointment Notification: ${userInfo?.name} with Dr. ${doctor?.name}`;

  const userHtml = `
  <div style="font-family: Arial, sans-serif; line-height: 1.5;">
    <p>Dear ${userInfo?.name},</p>
    <p>This email confirms your appointment with Dr. ${doctor.name} on the Medical platform.</p>
    <p>You can now chat with Dr. ${doctor.name} to discuss your health concerns.</p>
    <p><a href="${config.frontend_ui_link}" style="color: #007bff; text-decoration: none;">Click here to start your chat with Dr. ${doctor.name}.</a></p>
    <p>We hope this appointment is convenient for you. If you need to reschedule, please contact us at your earliest convenience.</p>
    <p>Sincerely,</p>
    <p>The Medical Team</p>
  </div>
`;

  const doctorHtml = `
  <div style="font-family: Arial, sans-serif; line-height: 1.5;">
    <p>Dear Dr. ${doctor.name},</p>
    <p>This email is to inform you of a new appointment with your patient, ${userInfo?.name}, on the Medical platform.</p>
    <p>The appointment is scheduled for the upcoming session. Please be prepared to discuss the patient's health concerns.</p>
    <p>You can access your chat with ${userInfo?.name} through the platform.</p>
    <p><a href="${config.frontend_ui_link}" style="color: #007bff; text-decoration: none;">Click here to start your chat with your patients</a></p>
    <p>Thank you for your dedication to patient care.</p>
    <p>Sincerely,</p>
    <p>The Medical Team</p>
  </div>
`;

  sendEmail(doctorSubject, userdoctor.email, doctorHtml);
  sendEmail(userSubject, userInfo.email, userHtml);

  return newAppointment;
};

export const AppointmentServices = {
  createAppointmentPayemntIntent,
  createAppointmentIntoDB,
};
