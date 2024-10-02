import httpStatus from 'http-status';
import catchAsync from '../../utiles/catchAsync';
import commonRes from '../../utiles/commonResponse';
import { AppointmentServices } from './appointment.server';

const getPaymentInent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AppointmentServices.createAppointmentPayemntIntent(id);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment Intent create successfully',
    data: result,
  });
});

const createAppointment = catchAsync(async (req, res) => {
  const result = await AppointmentServices.createAppointmentIntoDB(req.body);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Appointment Create Successfully',
    data: result,
  });
});

export const appointmentControllers = {
  getPaymentInent,
  createAppointment,
};
