import { model, Schema } from 'mongoose';
import { TClinic } from './ourclinic.interface';
const ourClinicSchema = new Schema<TClinic>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    img: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const OurClinic = model<TClinic>('OurClinic', ourClinicSchema);
