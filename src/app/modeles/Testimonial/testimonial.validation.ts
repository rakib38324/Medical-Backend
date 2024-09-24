/* eslint-disable no-useless-escape */
import { z } from 'zod';

const createTestimonialValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    designation: z.string().min(1, { message: 'Designation is required' }),
    comment: z.string().min(1, { message: 'Comment is required' }),
    start: z
      .number()
      .min(1, { message: 'Start must be a positive number' })
      .max(5, { message: 'Start cannot be more than 5' }),
    img: z.string().url({ message: 'Image must be a valid URL' }),
  }),
});

export const TestimonialValidations = {
  createTestimonialValidationSchema,
};
