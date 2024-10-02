import express from 'express';
import { appointmentControllers } from './appointment.controller';
import ValidateRequest from '../../middlewares/validateRequest';
import { AppointmentValidations } from './appointment.validation';
const router = express.Router();

router.post(
  '/create_payment_intent/:id',
  appointmentControllers.getPaymentInent,
);
router.post(
  '/create_appointment',
  ValidateRequest(AppointmentValidations.createAppointmentValidationSchema),
  appointmentControllers.createAppointment,
);

export const AppointmentRouter = router;
