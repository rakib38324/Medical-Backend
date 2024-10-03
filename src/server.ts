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
    origin: 'http://localhost:3000', // Your frontend origin
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

  // Listen for messages
  socket.on('sendMessage', async (message) => {
    const chatingPayload = {
      senderId: message.senderId,
      receiverId: message.receiverId,
      message: message.text,
    };
    await Chatting.create(chatingPayload);
    io.emit('receiveMessage', chatingPayload);
  });

  // Listen for the existing chat event
  socket.on('existingChat', async ({ senderId, receiverId }) => {
    try {
      // console.log(senderId, receiverId)
      // Query the database to find existing chats between sender and receiver
      const existingChats = await Chatting.find({
        $or: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      }).sort({ createdAt: 1 }); // Sort by time if needed

      // Send the existing messages back to the frontend
      io.emit('receiveExistingChat', existingChats);
    } catch (err) {
      console.error('Error fetching existing chats:', err);
    }
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
