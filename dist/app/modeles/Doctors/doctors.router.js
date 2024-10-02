"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorsRouter = void 0;
const express_1 = __importDefault(require("express"));
const doctors_controller_1 = require("./doctors.controller");
const router = express_1.default.Router();
// for taks parpous i made only fetch doctos and  nedded all functions like create, update,delete etc.
router.get('/', doctors_controller_1.doctorsControllers.getAllDoctors);
router.get('/:id', doctors_controller_1.doctorsControllers.getSingleDoctors);
exports.doctorsRouter = router;
