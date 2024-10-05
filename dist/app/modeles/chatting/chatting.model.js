"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chatting = void 0;
const mongoose_1 = require("mongoose");
const ChattingSchemma = new mongoose_1.Schema({
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    message: { type: String, required: true },
}, {
    timestamps: true,
});
exports.Chatting = (0, mongoose_1.model)('Chatting', ChattingSchemma);
