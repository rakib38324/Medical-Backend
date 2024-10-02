import express from 'express';
import { TestimonialControllers } from './textimonial.controller';
const router = express.Router();

// for taks parpous i made only fetc testimonial and nedded all functions like create, update,delete etc.

router.get('/', TestimonialControllers.getAllTestimonial);

export const testimonialRouter = router;
