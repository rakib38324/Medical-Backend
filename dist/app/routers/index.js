"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_router_1 = require("../modeles/Auth/auth.router");
const userRegistration_router_1 = require("../modeles/UsersRegistration/userRegistration.router");
const doctors_router_1 = require("../modeles/Doctors/doctors.router");
const testimonial_router_1 = require("../modeles/Testimonial/testimonial.router");
const ourClinic_router_1 = require("../modeles/ourclinic/ourClinic.router");
const appointment_router_1 = require("../modeles/Appointment/appointment.router");
const chat_router_1 = require("../modeles/chatting/chat.router");
const router = (0, express_1.Router)();
const moduleRouters = [
    {
        path: '/register',
        route: userRegistration_router_1.userRouter,
    },
    {
        path: '/auth',
        route: auth_router_1.loginRouters,
    },
    {
        path: '/doctors',
        route: doctors_router_1.doctorsRouter,
    },
    {
        path: '/testimonial',
        route: testimonial_router_1.testimonialRouter,
    },
    {
        path: '/ourclinic',
        route: ourClinic_router_1.ourClinicRouter,
    },
    {
        path: '/appointment',
        route: appointment_router_1.AppointmentRouter,
    },
    {
        path: '/chat',
        route: chat_router_1.chatrouter,
    },
];
moduleRouters.forEach((route) => router.use(route.path, route.route));
exports.default = router;
