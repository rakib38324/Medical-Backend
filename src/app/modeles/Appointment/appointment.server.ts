import httpStatus from 'http-status';
import config from '../../config/config';
import AppError from '../../errors/appError';
import { Doctor } from '../Doctors/doctors.model';
import { User } from '../UsersRegistration/userRegistration.model';
import { Appointment } from './appointment.model';
import Stripe from 'stripe';
import { TypeAppointment } from './appointment.interface';

const stripe = new Stripe(config.stripe_secrect!); // Use your secret key from environment variables

const createAppointmentPayemntIntent = async (id: string) => {
  const doctor = await Doctor.findById({ _id: id });

  if (!doctor) {
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
  const doctor = await Doctor.findById({ _id: payload?.doctorId });

  if (!doctor) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Doctor not found.');
  }
  const userInfo = await User.findById({ _id: payload?.userId });

  if (!userInfo) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found.');
  }

  // Create a new appointment
  const newAppointment = await Appointment.create(payload);

  // Update doctor's appointments by pushing the new appointment ID
  await Doctor.findByIdAndUpdate(
    payload?.doctorId,
    { $push: { appointments: newAppointment._id } },
    { new: true, runValidators: true },
  );

  // Update user's appointments by pushing the new appointment ID
  await User.findByIdAndUpdate(
    payload?.userId,
    { $push: { appointments: newAppointment._id } },
    { new: true, runValidators: true },
  );

  return newAppointment;
};

export const AppointmentServices = {
  createAppointmentPayemntIntent,
  createAppointmentIntoDB,
};
