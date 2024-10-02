"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testimonialRouter = void 0;
const express_1 = __importDefault(require("express"));
const textimonial_controller_1 = require("./textimonial.controller");
const router = express_1.default.Router();
// for taks parpous i made only fetc testimonial and nedded all functions like create, update,delete etc.
router.get('/', textimonial_controller_1.TestimonialControllers.getAllTestimonial);
exports.testimonialRouter = router;
