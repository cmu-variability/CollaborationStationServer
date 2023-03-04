const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, { cors: {
    origin: "http://localhost:8601",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});
const port = process.env.PORT || 8000;






io.on('connection', (socket) => {
    let roomName = "room";
    socket.on('joinRoom', (room) => {
      roomName = "room" + room;
      socket.join(roomName);
      //this is an ES6 Set of all client ids in the room
      const clients = io.sockets.adapter.rooms.get(roomName);
  
      //to get the number of clients in this room
      const numClients = clients ? clients.size : 0;
  
      const clientArr = [];
  
      for (const clientId of clients ) {
        clientArr.push(clientId);
      }
  
      io.to(roomName).emit('newPerson', clientArr);
  
      socket.on("disconnect", () => {
        //this is an ES6 Set of all client ids in the room
      const clients = io.sockets.adapter.rooms.get(roomName);
  
      //to get the number of clients in this room
      const numClients = clients ? clients.size : 0;
  
      const clientArr = [];
  
      if(clients != undefined)
      {
        for (const clientId of clients ) {
          clientArr.push(clientId);
        }
      }
        io.to(roomName).emit('newPerson', clientArr);
      });
  
    });
  
  
  
    
  
    socket.on('requestRoom', () => {
      const rooms = []
      for (const room of socket.rooms ) {
        rooms.push(room);
      }
      socket.emit('giveRoom', rooms);
    });
  });
  
  
  
  
  
  
  io.of("/").adapter.on("create-room", (room) => {
    console.log(`room ${room} was created`);
  });
  
  io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
  });
  
  http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
  });