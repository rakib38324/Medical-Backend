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
exports.AuthServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../errors/appError"));
const userRegistration_model_1 = require("../UsersRegistration/userRegistration.model");
const auth_utillis_1 = require("./auth.utillis");
const config_1 = __importDefault(require("../../config/config"));
const sendEmail_1 = require("../../utiles/sendEmail");
const emailVerification = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, token } = payload;
    //===>check if the user is exists
    const isUserExists = yield userRegistration_model_1.User.findOne({ email: email });
    if (!isUserExists) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Invalid User Information, Please create your account again.');
    }
    //====> verify token
    const decoded = (0, auth_utillis_1.VerifyToken)(token, config_1.default.jwt_access_secret);
    // console.log(decoded)
    if (decoded.email !== payload.email) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, `Invalid User Information, try again leater.`);
    }
    yield userRegistration_model_1.User.findOneAndUpdate({
        email: email,
    }, {
        verified: true,
    });
    return { message: 'Email Verifired Successfully.' };
});
const resendEmailVerification = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = payload;
    //===>check if the user is exists
    const isUserExists = yield userRegistration_model_1.User.findOne({ email: email });
    if (!isUserExists) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Invalid User Information, Please create your account.');
    }
    if (isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.verified) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Your email already verified.');
    }
    const jwtPayload = {
        email,
        name: isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.name,
    };
    //===========> create token and sent to the client
    const resetToken = (0, auth_utillis_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, '20m');
    const resetUILink = `${config_1.default.email_vErification_ui_link}?email=${email}&token=${resetToken}`;
    const subject = 'Verification email from Medicine E-commerce.';
    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      
      <p>Dear ${isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.name},</p>
      <p>Thank you for registering with us. To complete your registration, please verify your email address by clicking on the following link:</p>
       <p>
       <a href="${resetUILink}" style="color: #007bff; text-decoration: none;">Click here to verify your email</a>
       </p>
      <p>This link is valid for 20 minutes. Please do not share this code with anyone.</p>
      <p>If you did not create an account using this email address, please ignore this email.</p>
      <p>Best regards,<br />Medicine E-Commerce</p>
    </div>
  `;
    (0, sendEmail_1.sendEmail)(subject, email, html);
    return {
        message: `Successfully Resend your verification link with ${email}. Please Check Your Email.`,
    };
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //===>check if the user is exists
    const isUserExists = yield userRegistration_model_1.User.isUserExistsByEmail(payload.email);
    if (!isUserExists) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'User not found! Check your Email.');
    }
    ///====> checking if the password is correct
    const isPasswordMatch = yield userRegistration_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.password, isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.password);
    if (!isPasswordMatch) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, 'Password is not match!!');
    }
    if (!(isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.verified)) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, 'You are not verified. Please verify your account.');
    }
    //-====> access granted: send accessToken, RefreshToken
    const jwtPayload = {
        email: isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.email,
        name: isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.name,
    };
    //===========> create token and sent to the client
    const accessToken = (0, auth_utillis_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    //===========> create refresh token and sent to the client
    const refreshToken = (0, auth_utillis_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_access_expires_in);
    const returndata = {
        name: isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.name,
        email: isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.email,
        _id: isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists._id,
    };
    return { user: returndata, token: accessToken, refreshToken: refreshToken };
});
const changePassword = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(payload.currentPassword, payload.newPassword);
    //===>check if the user is exists
    const isUserExists = yield userRegistration_model_1.User.isUserExistsByEmail(userData.email);
    if (!isUserExists) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'This user not found!');
    }
    const currentPassword = payload === null || payload === void 0 ? void 0 : payload.currentPassword;
    const hashpassword = isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.password;
    ///====> checking if the given password and exists password is correct
    const isPasswordMatch = yield userRegistration_model_1.User.isPasswordMatched(currentPassword, hashpassword);
    if (!isPasswordMatch) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, 'Password is not match!!');
    }
    yield userRegistration_model_1.User.findOneAndUpdate({
        email: userData.email,
    }, {
        password: payload.newPassword,
        passwordChangedAt: new Date(),
    });
    return null;
});
const forgetPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield userRegistration_model_1.User.isUserExistsByEmail(email);
    if (!isUserExists) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'No Account found. PLease check your email.');
    }
    const jwtPayload = {
        email: isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.email,
        name: isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.name,
    };
    //===========> create token and sent to the client
    const resetToken = (0, auth_utillis_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, '20m');
    const resetUILink = `${config_1.default.reset_password_ui_link}?email=${isUserExists.email}&token=${resetToken}`;
    const subject = 'Password Reset Link From Medicine E-commerce.';
    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      
      <p>Dear ${isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.name},</p>
      <p>Please reset your password by clicking on the following link:</p>
       <p>
       <a href="${resetUILink}" style="color: #007bff; text-decoration: none;">Click here to reset your password</a>
       </p>
      <p>This link is valid for 20 minutes. Please do not share this code with anyone.</p>
      <p>If you did not request to reset your password, please ignore this email.</p>
      <p>Best regards,<br />Medicine E-Commerce</p>
    </div>
  `;
    (0, sendEmail_1.sendEmail)(subject, isUserExists.email, html);
    return `Reset link sent your email: ${isUserExists.email}`;
});
const resetPassword = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield userRegistration_model_1.User.isUserExistsByEmail(payload.email);
    if (!isUserExists) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'This user not found!');
    }
    //====> verify token
    const decoded = (0, auth_utillis_1.VerifyToken)(token, config_1.default.jwt_access_secret);
    // console.log(decoded)
    if (decoded.email !== payload.email) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, `You are forbidden!!`);
    }
    yield userRegistration_model_1.User.findOneAndUpdate({
        email: decoded.email,
    }, {
        password: payload.newPassword,
        passwordChangedAt: new Date(),
    });
    return 'Your Password Changed Successfully';
});
const getMeFromDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield userRegistration_model_1.User.aggregate([
        {
            $match: { email: email },
        },
        {
            $project: {
                password: 0,
                passwordChangedAt: 0,
                __v: 0,
            },
        },
    ]);
    if ((result === null || result === void 0 ? void 0 : result.length) > 0) {
        return result[0];
    }
    else {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'This user not found!');
    }
});
exports.AuthServices = {
    emailVerification,
    resendEmailVerification,
    loginUser,
    changePassword,
    forgetPassword,
    resetPassword,
    getMeFromDB,
};
