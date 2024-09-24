import httpStatus from 'http-status';
import catchAsync from '../../utiles/catchAsync';
import commonRes from '../../utiles/commonResponse';
import { doctorServices } from './doctors.services';

const getAllDoctors = catchAsync(async (req, res) => {
  const result = await doctorServices.getAllDcotorFromDB();
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctors information retrieved successfully',
    data: result,
  });
});

export const doctorsControllers = {
  getAllDoctors,
};
