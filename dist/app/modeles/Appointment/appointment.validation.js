"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentValidations = void 0;
/* eslint-disable no-useless-escape */
const zod_1 = require("zod");
// Define the Zod validation schema for an ObjectId
const objectIdSchema = zod_1.z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');
const createAppointmentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        doctorId: objectIdSchema, // Assuming it's optional; you can remove .optional() if it's required
        userId: objectIdSchema,
        paymentId: zod_1.z.string(),
    }),
});
exports.AppointmentValidations = {
    createAppointmentValidationSchema,
};
