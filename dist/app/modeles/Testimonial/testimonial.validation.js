"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestimonialValidations = void 0;
/* eslint-disable no-useless-escape */
const zod_1 = require("zod");
const createTestimonialValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: 'Name is required' }),
        designation: zod_1.z.string().min(1, { message: 'Designation is required' }),
        comment: zod_1.z.string().min(1, { message: 'Comment is required' }),
        start: zod_1.z
            .number()
            .min(1, { message: 'Start must be a positive number' })
            .max(5, { message: 'Start cannot be more than 5' }),
        img: zod_1.z.string().url({ message: 'Image must be a valid URL' }),
    }),
});
exports.TestimonialValidations = {
    createTestimonialValidationSchema,
};
