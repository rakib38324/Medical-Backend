"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Testimonial = void 0;
const mongoose_1 = require("mongoose");
const doctorSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    designation: { type: String, required: true },
    comment: { type: String, required: true },
    start: { type: Number, required: true },
    img: { type: String, required: true },
}, {
    timestamps: true,
});
exports.Testimonial = (0, mongoose_1.model)('Testimonial', doctorSchema);
