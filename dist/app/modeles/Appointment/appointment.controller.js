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
exports.appointmentControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utiles/catchAsync"));
const commonResponse_1 = __importDefault(require("../../utiles/commonResponse"));
const appointment_server_1 = require("./appointment.server");
const getPaymentInent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield appointment_server_1.AppointmentServices.createAppointmentPayemntIntent(id);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Payment Intent create successfully',
        data: result,
    });
}));
const createAppointment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield appointment_server_1.AppointmentServices.createAppointmentIntoDB(req.body);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Appointment Create Successfully',
        data: result,
    });
}));
exports.appointmentControllers = {
    getPaymentInent,
    createAppointment,
};
