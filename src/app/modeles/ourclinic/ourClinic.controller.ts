import httpStatus from 'http-status';
import catchAsync from '../../utiles/catchAsync';
import commonRes from '../../utiles/commonResponse';
import { OurClinicServices } from './ourClinic.service';

const getAllOurClinic = catchAsync(async (req, res) => {
  const result = await OurClinicServices.getAllOurClinicFromDB();
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Our Clinic information retrieved successfully',
    data: result,
  });
});

export const ourclinicControllers = {
  getAllOurClinic,
};
