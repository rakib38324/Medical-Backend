/* eslint-disable no-useless-escape */
import { z } from 'zod';

const createDoctorValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    specialist: z.string().min(1, { message: 'Specialist is required' }),
    like: z.string().regex(/^\d{1,3}%$/, {
      message: 'Like must be a percentage (e.g., 88%)',
    }),
    experience: z
      .number()
      .min(0, { message: 'Experience must be a non-negative number' }),
    img: z.string().url({ message: 'Image must be a valid URL' }),
  }),
});

export const DoctorValidations = {
  createDoctorValidationSchema,
};
