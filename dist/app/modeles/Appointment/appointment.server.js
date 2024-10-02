"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config/config"));
const appError_1 = __importDefault(require("../../errors/appError"));
const doctors_model_1 = require("../Doctors/doctors.model");
const userRegistration_model_1 = require("../UsersRegistration/userRegistration.model");
const appointment_model_1 = require("./appointment.model");
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(config_1.default.stripe_secrect); // Use your secret key from environment variables
const createAppointmentPayemntIntent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const doctor = yield doctors_model_1.Doctor.findById({ _id: id });
    if (!doctor) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Doctor not found.');
    }
    const payment_intent = yield stripe.paymentIntents.create({
        amount: doctor.amount * 100,
        currency: 'usd',
        description: 'Appoint for chating',
        payment_method_types: ['card'],
    });
    return payment_intent.client_secret;
});
const createAppointmentIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const doctor = yield doctors_model_1.Doctor.findById({ _id: payload === null || payload === void 0 ? void 0 : payload.doctorId });
    if (!doctor) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Doctor not found.');
    }
    const userInfo = yield userRegistration_model_1.User.findById({ _id: payload === null || payload === void 0 ? void 0 : payload.userId });
    if (!userInfo) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'User not found.');
    }
    // Create a new appointment
    const newAppointment = yield appointment_model_1.Appointment.create(payload);
    // Update doctor's appointments by pushing the new appointment ID
    yield doctors_model_1.Doctor.findByIdAndUpdate(payload === null || payload === void 0 ? void 0 : payload.doctorId, { $push: { appointments: newAppointment._id } }, { new: true, runValidators: true });
    // Update user's appointments by pushing the new appointment ID
    yield userRegistration_model_1.User.findByIdAndUpdate(payload === null || payload === void 0 ? void 0 : payload.userId, { $push: { appointments: newAppointment._id } }, { new: true, runValidators: true });
    return newAppointment;
});
exports.AppointmentServices = {
    createAppointmentPayemntIntent,
    createAppointmentIntoDB,
};
