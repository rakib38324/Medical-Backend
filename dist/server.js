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
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config/config"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRegistration_model_1 = require("./app/modeles/UsersRegistration/userRegistration.model");
const chatting_model_1 = require("./app/modeles/chatting/chatting.model");
const server = http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Your frontend origin
        methods: ['GET', 'POST'],
    },
});
io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('A user connected: ' + socket.id);
    // console.log(socket.handshake.auth.userId);
    const _id = socket.handshake.auth.userId;
    yield userRegistration_model_1.User.findByIdAndUpdate(_id, {
        $set: { is_online: '1' },
    }, { new: true });
    // // Emit online status
    // io.emit('online', { userId: socket.id, status: 'online' });
    //  user broadcast online status
    socket.broadcast.emit('/getOnlineUser', { userId: _id });
    // Listen for messages
    socket.on('sendMessage', (message) => __awaiter(void 0, void 0, void 0, function* () {
        const chatingPayload = {
            senderId: message.senderId,
            receiverId: message.receiverId,
            message: message.text,
        };
        yield chatting_model_1.Chatting.create(chatingPayload);
        io.emit('receiveMessage', chatingPayload);
    }));
    // Listen for the existing chat event
    socket.on('existingChat', (_a) => __awaiter(void 0, [_a], void 0, function* ({ senderId, receiverId }) {
        try {
            // console.log(senderId, receiverId)
            // Query the database to find existing chats between sender and receiver
            const existingChats = yield chatting_model_1.Chatting.find({
                $or: [
                    { senderId: senderId, receiverId: receiverId },
                    { senderId: receiverId, receiverId: senderId },
                ],
            }).sort({ createdAt: 1 }); // Sort by time if needed
            // Send the existing messages back to the frontend
            io.emit('receiveExistingChat', existingChats);
        }
        catch (err) {
            console.error('Error fetching existing chats:', err);
        }
    }));
    // User disconnects
    socket.on('disconnect', () => __awaiter(void 0, void 0, void 0, function* () {
        // console.log('A user disconnected: ' + socket.id);
        yield userRegistration_model_1.User.findByIdAndUpdate(_id, {
            $set: { is_online: '0' },
        }, { new: true });
        //  user broadcast online status
        socket.broadcast.emit('/getOflineUser', { userId: _id });
        io.emit('offline', { userId: socket.id, status: 'offline' });
    }));
}));
// let usp = io.of('/name-namespace');
// usp.on('connection', async (socket) => {
//   console.log('User connected successfully!');
//   console.log(socket.handshake.auth.userId);
//   const _id = socket.handshake.auth.userId;
//   if (_id) {
//     await User.findByIdAndUpdate(
//       _id,
//       {
//         $set: { is_online: '1' },
//       },
//       { new: true }, // This option returns the updated document
//     );
//   }
//   socket.on('dicconnected', async () => {
//     console.log('User dicconnected');
//     if (_id) {
//       await User.findByIdAndUpdate(
//         _id,
//         {
//           $set: { is_online: '0' },
//         },
//         { new: true }, // This option returns the updated document
//       );
//     }
//   });
// });
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.default.database_url);
            server.listen(config_1.default.port, () => {
                console.log(`Medical app listening on port ${config_1.default.port}`);
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
main().catch((err) => console.log(err));
