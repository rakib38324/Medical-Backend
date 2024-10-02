import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { Doctor } from './doctors.model';

const getAllDcotorFromDB = async () => {
  const doctor = await Doctor.find().populate('appointments');
  return doctor;
};

const getSingleDcotorFromDB = async (_id: string) => {
  const doctor = await Doctor.findById(_id);
  if (!doctor) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Doctor not found.');
  }
  return doctor;
};

export const doctorServices = {
  getAllDcotorFromDB,
  getSingleDcotorFromDB,
};
