"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentRouter = void 0;
const express_1 = __importDefault(require("express"));
const appointment_controller_1 = require("./appointment.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const appointment_validation_1 = require("./appointment.validation");
const router = express_1.default.Router();
router.post('/create_payment_intent/:id', appointment_controller_1.appointmentControllers.getPaymentInent);
router.post('/create_appointment', (0, validateRequest_1.default)(appointment_validation_1.AppointmentValidations.createAppointmentValidationSchema), appointment_controller_1.appointmentControllers.createAppointment);
exports.AppointmentRouter = router;
