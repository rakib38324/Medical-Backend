import { model, Schema } from 'mongoose';
import { TypeAppointment } from './appointment.interface';

const AppointmentSchema = new Schema<TypeAppointment>(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    paymentId: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const Appointment = model<TypeAppointment>(
  'Appointment',
  AppointmentSchema,
);
