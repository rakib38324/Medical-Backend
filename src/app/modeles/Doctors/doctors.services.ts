import { Doctor } from './doctors.model';

const getAllDcotorFromDB = async () => {
  const doctor = await Doctor.find();
  return doctor;
};

export const doctorServices = {
  getAllDcotorFromDB,
};
