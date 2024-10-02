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
exports.doctorsControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utiles/catchAsync"));
const commonResponse_1 = __importDefault(require("../../utiles/commonResponse"));
const doctors_services_1 = require("./doctors.services");
const getAllDoctors = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield doctors_services_1.doctorServices.getAllDcotorFromDB();
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Doctors information retrieved successfully',
        data: result,
    });
}));
const getSingleDoctors = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield doctors_services_1.doctorServices.getSingleDcotorFromDB(id);
    (0, commonResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Doctor information retrieved successfully',
        data: result,
    });
}));
exports.doctorsControllers = {
    getAllDoctors,
    getSingleDoctors,
};
