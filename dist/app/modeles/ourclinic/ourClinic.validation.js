"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ourOurClinicValidations = void 0;
/* eslint-disable no-useless-escape */
const zod_1 = require("zod");
const createourClinicValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: 'Clinic name is required' }),
        email: zod_1.z.string().email({ message: 'Invalid email address' }),
        phone: zod_1.z.string().min(1, { message: 'Phone number is required' }), // You can add more phone validation logic if needed
        location: zod_1.z.string().min(1, { message: 'Location is required' }),
        img: zod_1.z.string().url({ message: 'Image URL is invalid' }),
    }),
});
exports.ourOurClinicValidations = {
    createourClinicValidationSchema,
};
