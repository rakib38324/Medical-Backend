import { Server } from 'socket.io';
import http from 'http';
import app from './app';
import config from './app/config/config';
import mongoose from 'mongoose';
import { User } from './app/modeles/UsersRegistration/userRegistration.model';
import { Chatting } from './app/modeles/chatting/chatting.model';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://new-medicale-server-updated.vercel.app', // Your frontend origin
    methods: ['GET', 'POST'],
  },
});

io.on('connection', async (socket) => {
  // console.log('A user connected: ' + socket.id);

  // console.log(socket.handshake.auth.userId);
  const _id = socket.handshake.auth.userId;
  await User.findByIdAndUpdate(
    _id,
    {
      $set: { is_online: '1' },
    },
    { new: true }, // This option returns the updated document
  );

  // // Emit online status
  // io.emit('online', { userId: socket.id, status: 'online' });

  //  user broadcast online status
  socket.broadcast.emit('/getOnlineUser', { userId: _id });

  // Join a room and fetch existing chats
  socket.on('joinRoom', async ({ roomId, senderId, receiverId }) => {
    socket.join(roomId);
    console.log(`User ${_id} joined roomId: ${roomId}`);
    console.log(senderId, receiverId);
    try {
      // Fetch existing chats between sender and receiver
      const existingChats = await Chatting.find({
        $or: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      }).sort({ createdAt: 1 });

      // console.log(existingChats)
      // Emit existing chats to the room
      socket.emit('receiveExistingChat', existingChats);
    } catch (err) {
      console.error('Error fetching existing chats:', err);
    }
  });

  // Handle sending messages
  socket.on('sendMessage', async (message) => {
    const chatingPayload = {
      roomId: message.roomId,
      senderId: message.senderId,
      receiverId: message.receiverId,
      message: message.message,
    };

    // Save the message to the database
    await Chatting.create(chatingPayload);

    // Emit the new message to all users in the room
    io.to(message.roomId).emit('receiveMessage', message);
    io.emit('outerRoomReceiveMessage', message);
  });

  // User disconnects
  socket.on('disconnect', async () => {
    // console.log('A user disconnected: ' + socket.id);
    await User.findByIdAndUpdate(
      _id,
      {
        $set: { is_online: '0' },
      },
      { new: true }, // This option returns the updated document
    );

    //  user broadcast online status
    socket.broadcast.emit('/getOflineUser', { userId: _id });

    io.emit('offline', { userId: socket.id, status: 'offline' });
  });
});

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

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    server.listen(config.port, () => {
      console.log(`Medical app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main().catch((err) => console.log(err));
