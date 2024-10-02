/* eslint-disable no-useless-escape */
import { z } from 'zod';
// Define the Zod validation schema for an ObjectId
const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');

const createAppointmentValidationSchema = z.object({
  body: z.object({
    doctorId: objectIdSchema, // Assuming it's optional; you can remove .optional() if it's required
    userId: objectIdSchema,
    paymentId: z.string(),
  }),
});

export const AppointmentValidations = {
  createAppointmentValidationSchema,
};
