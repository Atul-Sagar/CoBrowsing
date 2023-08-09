const app = require('express')();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {origin : '*'}
});

const port = 3000;

// connectedClients = new Array()

connectedClients = []

io.on('connection', (socket) => {
  socket.join("allClientsRoom")
  console.log('a user connected');

  socket.on('createRoom', (roomId) => {
    // Create the room with the provided ID
    socket.join(roomId);
    console.log(`User ${socket.id} created and joined room ${roomId}`);
  });

  // Event to join an existing room
  socket.on('joinRoom', (roomId) => {
    // Join the specified room
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Event to leave the current room
  socket.on('leaveRoom', () => {
    const rooms = Object.keys(socket.rooms);
    rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.leave(room);
        console.log(`User ${socket.id} left room ${room}`);
      }
    });
  });

  // Event when a user disconnects
  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected`);
  });

  // Event to send a message in the room
  // socket.on('sendMessage', (roomId, message) => {
  //   // io.to(roomId).emit('message', { user: socket.id, message : message})
  //   socket.to(roomId).emit('message', {user: socket.id, message})
  // })

  socket.on('sendMessage', (roomID, message) =>{
    console.log("ROOM ID : ", roomID);
    console.log("Message : ", message);
    const userMessage = {user: socket.id, message: message}
    console.log("Emitting : ", userMessage);
    io.to(roomID).emit('message', userMessage)
  })

  console.log("Hostname : ", socket.handshake.headers.host.split(":").shift());

  const clientIP = socket.request.connection.remoteAddress;
  if(!connectedClients.includes(clientIP))
    connectedClients.push(clientIP)

  console.log("clients connected :", connectedClients);
  socket.emit("YourIP", clientIP)
  


  socket.on('message', (message) => {
    console.log("Messaged Received :" , JSON.stringify(message).toString());

    socket.broadcast.emit("message", message)

    // let receiverRoom = connectedClients.delete(connectedClients.indexOf(message));
    // io.to()
    // connectedClients.forEach(client => {

      // if(client !== socket.handshake.address){
      //   console.log("sending to : ", client);
      //   io.emit('message', `${socket.id.substr(0, 2)}: ${message}`);
      // } 
    // });
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected!');
  });
});

httpServer.listen(port, () => console.log(`listening on port ${port}`));