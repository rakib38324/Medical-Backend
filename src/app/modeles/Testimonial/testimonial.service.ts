import { Testimonial } from './testimonial.model';

const getAllTestimonialFromDB = async () => {
  const response = await Testimonial.find();
  return response;
};

export const testimonialServices = {
  getAllTestimonialFromDB,
};
