const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors());

const server = http.createServer(app);


// Crea un servidor io y permite CORS desde http://localhost:3000 con metodos GET y POST
const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

//escuacha cuando el cliente se conecta a traves de socket.io-client
io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);


    socket.on('join_room', (data) => {
        const { username, room } = data; // Datos enviados desde el cliente cuando el evento join_room se emite
        socket.join(room); // Une el usuario a una sala de socket
      });


    app.get('/', (req, res) => {
        res.send('Hello world '+ socket.id);
    });
});


server.listen(4000, () => 'Server is running on port 4000');