"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OurClinic = void 0;
const mongoose_1 = require("mongoose");
const ourClinicSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    img: { type: String, required: true },
}, {
    timestamps: true,
});
exports.OurClinic = (0, mongoose_1.model)('OurClinic', ourClinicSchema);
