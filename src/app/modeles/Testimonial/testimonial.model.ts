import { model, Schema } from 'mongoose';
import { TTestimonial } from './testimonial.interface';
const doctorSchema = new Schema<TTestimonial>(
  {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    comment: { type: String, required: true },
    start: { type: Number, required: true },
    img: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const Testimonial = model<TTestimonial>('Testimonial', doctorSchema);
