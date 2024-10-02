"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorValidations = void 0;
/* eslint-disable no-useless-escape */
const zod_1 = require("zod");
const createDoctorValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: 'Name is required' }),
        specialist: zod_1.z.string().min(1, { message: 'Specialist is required' }),
        like: zod_1.z.string().regex(/^\d{1,3}%$/, {
            message: 'Like must be a percentage (e.g., 88%)',
        }),
        experience: zod_1.z
            .number()
            .min(0, { message: 'Experience must be a non-negative number' }),
        img: zod_1.z.string().url({ message: 'Image must be a valid URL' }),
    }),
});
exports.DoctorValidations = {
    createDoctorValidationSchema,
};
