import { Router } from 'express';
import { loginRouters } from '../modeles/Auth/auth.router';
import { userRouter } from '../modeles/UsersRegistration/userRegistration.router';
import { doctorsRouter } from '../modeles/Doctors/doctors.router';
import { testimonialRouter } from '../modeles/Testimonial/testimonial.router';
import { ourClinicRouter } from '../modeles/ourclinic/ourClinic.router';
import { AppointmentRouter } from '../modeles/Appointment/appointment.router';

const router = Router();

const moduleRouters = [
  {
    path: '/register',
    route: userRouter,
  },
  {
    path: '/auth',
    route: loginRouters,
  },
  {
    path: '/doctors',
    route: doctorsRouter,
  },
  {
    path: '/testimonial',
    route: testimonialRouter,
  },
  {
    path: '/ourclinic',
    route: ourClinicRouter,
  },
  {
    path: '/appointment',
    route: AppointmentRouter,
  },
];

moduleRouters.forEach((route) => router.use(route.path, route.route));
export default router;
