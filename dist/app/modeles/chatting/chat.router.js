"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatrouter = void 0;
const express_1 = __importDefault(require("express"));
const chat_controller_1 = require("./chat.controller");
const router = express_1.default.Router();
// for taks parpous i made only fetch doctos and  nedded all functions like create, update,delete etc.
router.post('/create-chat', chat_controller_1.chatControllers.createChat);
router.post('/get-previous-chat', chat_controller_1.chatControllers.createChat);
exports.chatrouter = router;
