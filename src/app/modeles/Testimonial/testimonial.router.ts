import express from 'express';
import Auth from '../../middlewares/Auth';
import { TestimonialControllers } from './textimonial.controller';
const router = express.Router();

// for taks parpous i made only fetc testimonial and nedded all functions like create, update,delete etc.

router.get('/', Auth(), TestimonialControllers.getAllTestimonial);

export const testimonialRouter = router;
