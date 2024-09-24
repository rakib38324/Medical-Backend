import httpStatus from 'http-status';
import catchAsync from '../../utiles/catchAsync';
import commonRes from '../../utiles/commonResponse';
import { testimonialServices } from './testimonial.service';

const getAllTestimonial = catchAsync(async (req, res) => {
  const result = await testimonialServices.getAllTestimonialFromDB();
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Testimonial information retrieved successfully',
    data: result,
  });
});

export const TestimonialControllers = {
  getAllTestimonial,
};
