const express = require('express'); // mongodb+srv://andresreyesceo:<db_password>@cluster0.ki9xn.mongodb.net/
const mongoose = require('mongoose');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors());

const server = http.createServer(app);

try {
    mongoose.connect("mongodb+srv://andresreyesceo:hnf3mcw.ceo@cluster0.ki9xn.mongodb.net/realtime_chat_app")
    console.log("connected")
    
    const Schema = mongoose.Schema;
    const ObjectId = mongoose.ObjectId
    
    const messages = new Schema({
        id : ObjectId,
        message : String
    })
    
    const userModel = mongoose.model("appMnsj", messages )
    console.log("DB creada")
    
} catch (error) {
    console.log(error)
}

// Crea un servidor io y permite CORS desde http://localhost:3000 con metodos GET y POST
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

const CHAT_BOT = 'ChatBot ';
let chatRoom = ''; // Ej. javascript, node,...
let allUsers = []; // Todos los usuarios en la sala de chat actual

//escuacha cuando el cliente se conecta a traves de socket.io-client
io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);


    socket.on('join_room', (data) => {
        const { username, room } = data; // Datos enviados desde el cliente cuando el evento join_room se emite

        if (!room) {
            console.error('Error: room is undefined');
            return; // Evita que el código continúe si room no está definido
        }


        socket.join(room); // Une el usuario a una sala de socket
        let __createdtime__ = Date.now();

        socket.to(room).emit('receive_message', {
            message: `${username} has joined the chat room`,
            username: CHAT_BOT,
            __createdtime__,
        });

        // Envía el msg de bienvenida al usuario que se acaba de unir
        socket.emit('receive_message', {
            message: `Bienvenido ${username}`,
            username: CHAT_BOT,
            __createdtime__,
        })

        chatRoom = room;
        allUsers.push({ id: socket.id, username, room });
        let chatRoomUsers = allUsers.filter((user) => user.room === room);
        socket.to(room).emit('chatroom_users', chatRoomUsers);
        socket.emit('chatroom_users', chatRoomUsers);
    })

});


server.listen(4000, () => 'Server is running on port 4000');