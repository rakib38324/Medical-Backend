import { OurClinic } from './ourClinic.model';

const getAllOurClinicFromDB = async () => {
  const response = await OurClinic.find();
  return response;
};

export const OurClinicServices = {
  getAllOurClinicFromDB,
};
