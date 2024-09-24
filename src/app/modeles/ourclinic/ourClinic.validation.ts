/* eslint-disable no-useless-escape */
import { z } from 'zod';

const createourClinicValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Clinic name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    phone: z.string().min(1, { message: 'Phone number is required' }), // You can add more phone validation logic if needed
    location: z.string().min(1, { message: 'Location is required' }),
    img: z.string().url({ message: 'Image URL is invalid' }),
  }),
});

export const ourOurClinicValidations = {
  createourClinicValidationSchema,
};
