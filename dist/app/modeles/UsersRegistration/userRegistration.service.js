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
exports.UserServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../errors/appError"));
const userRegistration_model_1 = require("./userRegistration.model");
const auth_utillis_1 = require("../Auth/auth.utillis");
const config_1 = __importDefault(require("../../config/config"));
const sendEmail_1 = require("../../utiles/sendEmail");
const doctors_model_1 = require("../Doctors/doctors.model");
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name } = payload;
    const userExists = yield userRegistration_model_1.User.findOne({ email });
    if (userExists) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'User already exists! Duplicate email.');
    }
    const jwtPayload = {
        email,
        name,
        role: 'user',
    };
    //===========> create token and sent to the client
    const resetToken = (0, auth_utillis_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, '20m');
    const resetUILink = `${config_1.default.email_vErification_ui_link}?email=${email}&token=${resetToken}`;
    const subject = 'Verification email from Medical.';
    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      
      <p>Dear ${name},</p>
      <p>Thank you for registering with us. To complete your registration, please verify your email address by clicking on the following link:</p>
       <p>
       <a href="${resetUILink}" style="color: #007bff; text-decoration: none;">Click here to verify your email</a>
       </p>
      <p>This code is valid for 20 minutes. Please do not share this code with anyone.</p>
      <p>If you did not create an account using this email address, please ignore this email.</p>
      <p>Best regards,<br />Medicine E-Commerce</p>
    </div>
  `;
    (0, sendEmail_1.sendEmail)(subject, email, html);
    if (payload === null || payload === void 0 ? void 0 : payload.isDoctor) {
        const specialists = [
            'Orthopedic',
            'Nutritionist',
            'Pediatric',
            'Anaesthetic',
        ];
        const images = [
            'https://res.cloudinary.com/softex-solution-podcast/image/upload/v1727229161/d-2_fh3iqe.png',
            'https://res.cloudinary.com/softex-solution-podcast/image/upload/v1727229158/d-1_h7hsun.png',
            'https://res.cloudinary.com/softex-solution-podcast/image/upload/v1727229161/d-3_yfaow3.png',
        ];
        const getRandomFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const getRandomPercentage = () => Math.floor(Math.random() * (100 - 30 + 1)) + 30; // 30 to 100
        const getRandomExperience = () => Math.floor(Math.random() * 10) + 1; // 1 to 10
        const getRandomAmount = () => Math.floor(Math.random() * (200 - 30 + 1)) + 30; // 30 to 200
        const doctorInfo = {
            name: payload.name,
            specialist: getRandomFromArray(specialists), // Random specialist
            like: `${getRandomPercentage()}%`, // Random like percentage as string
            experience: getRandomExperience(), // Random experience (1 to 10 years)
            img: getRandomFromArray(images), // Random image
            amount: getRandomAmount(), // Random amount (30 to 200)
        };
        const createdDoctor = yield doctors_model_1.Doctor.create(doctorInfo);
        const userInfo = Object.assign(Object.assign({}, payload), { doctorId: createdDoctor === null || createdDoctor === void 0 ? void 0 : createdDoctor._id, verified: false, is_online: '0', passwordChangedAt: new Date() });
        const user = yield userRegistration_model_1.User.create(userInfo);
        if (user) {
            const result = yield userRegistration_model_1.User.aggregate([
                {
                    $match: { email: user === null || user === void 0 ? void 0 : user.email },
                },
                {
                    $project: {
                        password: 0,
                        verified: 0,
                        passwordChangedAt: 0,
                        __v: 0,
                    },
                },
            ]);
            return result[0];
        }
    }
    const userInfo = Object.assign(Object.assign({}, payload), { verified: false, is_online: '0', passwordChangedAt: new Date() });
    const user = yield userRegistration_model_1.User.create(userInfo);
    if (user) {
        const result = yield userRegistration_model_1.User.aggregate([
            {
                $match: { email: user === null || user === void 0 ? void 0 : user.email },
            },
            {
                $project: {
                    password: 0,
                    verified: 0,
                    passwordChangedAt: 0,
                    __v: 0,
                },
            },
        ]);
        return result[0];
    }
});
const getAllUserFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield userRegistration_model_1.User.find().select('-password');
    return userExists;
});
const getSingleUserFromDB = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield userRegistration_model_1.User.findById({ _id }).select('-password');
    if (!result) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'User Inforamtion is not found.');
    }
    return result;
});
const updateUserFromDB = (_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield userRegistration_model_1.User.findById({ _id });
    if (!userExists) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'User Inforamtion is not found.');
    }
    const result = yield userRegistration_model_1.User.findByIdAndUpdate(_id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
exports.UserServices = {
    createUserIntoDB,
    getAllUserFromDB,
    getSingleUserFromDB,
    updateUserFromDB,
};
