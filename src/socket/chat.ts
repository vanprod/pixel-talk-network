// socket/chat.ts
import { Server } from 'socket.io';

export default function setupChat(io: Server) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('send_message', (data) => {
      io.emit('receive_message', data);
    });
  });
}
