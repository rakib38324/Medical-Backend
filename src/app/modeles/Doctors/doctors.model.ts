import { model, Schema } from 'mongoose';
import { TDoctor } from './doctors.interface';

const doctorSchema = new Schema<TDoctor>(
  {
    name: { type: String, required: true },
    specialist: { type: String, required: true },
    like: { type: String, required: true },
    experience: { type: Number, required: true },
    img: { type: String, required: true },
    amount: { type: Number, required: true },
    appointments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Appointment',
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Doctor = model<TDoctor>('Doctor', doctorSchema);
