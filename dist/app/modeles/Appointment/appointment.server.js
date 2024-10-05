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
const sendEmail_1 = require("../../utiles/sendEmail");
const stripe = new stripe_1.default(config_1.default.stripe_secrect); // Use your secret key from environment variables
const createAppointmentPayemntIntent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const doctor = yield doctors_model_1.Doctor.findById({ _id: id });
    const userdoctor = yield userRegistration_model_1.User.findOne({ doctorId: id });
    if (!doctor || !userdoctor) {
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
    const userdoctor = yield userRegistration_model_1.User.findOne({ doctorId: payload === null || payload === void 0 ? void 0 : payload.doctorId });
    const doctor = yield doctors_model_1.Doctor.findById({ _id: payload === null || payload === void 0 ? void 0 : payload.doctorId });
    if (!doctor || !userdoctor) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Doctor not found.');
    }
    const userInfo = yield userRegistration_model_1.User.findById({ _id: payload === null || payload === void 0 ? void 0 : payload.userId });
    if (!userInfo) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'User not found.');
    }
    const updatePayload = {
        doctorId: userdoctor === null || userdoctor === void 0 ? void 0 : userdoctor._id,
        userId: payload.userId,
        paymentId: payload.paymentId,
    };
    // Create a new appointment
    const newAppointment = yield appointment_model_1.Appointment.create(updatePayload);
    // Update doctor's appointments by pushing the new appointment ID
    yield doctors_model_1.Doctor.findByIdAndUpdate(payload === null || payload === void 0 ? void 0 : payload.doctorId, { $push: { appointments: newAppointment._id } }, { new: true, runValidators: true });
    // Update userdoctor doctor's appointments by pushing the new appointment ID
    yield userRegistration_model_1.User.findByIdAndUpdate({ _id: userdoctor === null || userdoctor === void 0 ? void 0 : userdoctor._id }, { $push: { appointments: newAppointment._id } }, { new: true, runValidators: true });
    // Update user's appointments by pushing the new appointment ID
    yield userRegistration_model_1.User.findByIdAndUpdate(payload === null || payload === void 0 ? void 0 : payload.userId, { $push: { appointments: newAppointment._id } }, { new: true, runValidators: true });
    const userSubject = `Your Appointment Confirmed with Dr. ${doctor === null || doctor === void 0 ? void 0 : doctor.name}`;
    const doctorSubject = `New Appointment Notification: ${userInfo === null || userInfo === void 0 ? void 0 : userInfo.name} with Dr. ${doctor === null || doctor === void 0 ? void 0 : doctor.name}`;
    const userHtml = `
  <div style="font-family: Arial, sans-serif; line-height: 1.5;">
    <p>Dear ${userInfo === null || userInfo === void 0 ? void 0 : userInfo.name},</p>
    <p>This email confirms your appointment with Dr. ${doctor.name} on the Medical platform.</p>
    <p>You can now chat with Dr. ${doctor.name} to discuss your health concerns.</p>
    <p><a href="${config_1.default.frontend_ui_link}" style="color: #007bff; text-decoration: none;">Click here to start your chat with Dr. ${doctor.name}.</a></p>
    <p>We hope this appointment is convenient for you. If you need to reschedule, please contact us at your earliest convenience.</p>
    <p>Sincerely,</p>
    <p>The Medical Team</p>
  </div>
`;
    const doctorHtml = `
  <div style="font-family: Arial, sans-serif; line-height: 1.5;">
    <p>Dear Dr. ${doctor.name},</p>
    <p>This email is to inform you of a new appointment with your patient, ${userInfo === null || userInfo === void 0 ? void 0 : userInfo.name}, on the Medical platform.</p>
    <p>The appointment is scheduled for the upcoming session. Please be prepared to discuss the patient's health concerns.</p>
    <p>You can access your chat with ${userInfo === null || userInfo === void 0 ? void 0 : userInfo.name} through the platform.</p>
    <p><a href="${config_1.default.frontend_ui_link}" style="color: #007bff; text-decoration: none;">Click here to start your chat with your patients</a></p>
    <p>Thank you for your dedication to patient care.</p>
    <p>Sincerely,</p>
    <p>The Medical Team</p>
  </div>
`;
    (0, sendEmail_1.sendEmail)(doctorSubject, userdoctor.email, doctorHtml);
    (0, sendEmail_1.sendEmail)(userSubject, userInfo.email, userHtml);
    return newAppointment;
});
exports.AppointmentServices = {
    createAppointmentPayemntIntent,
    createAppointmentIntoDB,
};
