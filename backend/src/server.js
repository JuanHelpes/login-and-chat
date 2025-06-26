require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const socketIO = require("socket.io");

const usersRoutes = require("./routes/usuarioRoutes");
const connectToDataBase = require("./database");

// Conecta ao banco de dados
connectToDataBase();

const app = express();
const port = process.env.PORT || 3333;

// Cria o servidor HTTP baseado no Express
const server = http.createServer(app);

// Cria o servidor Socket.IO com suporte a CORS
const io = socketIO(server, {
  cors: {
    origin: "*", // ou substitua por http://localhost:5173 (Vite) se quiser restringir
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Rotas da API REST
app.use("/user", usersRoutes);

// ----------------------
//  SOCKET.IO - CHAT
// ----------------------
let messages = [];

io.on("connection", (socket) => {
  console.log(`🟢 Socket conectado: ${socket.id}`);

  socket.emit("previusMessage", messages);

  socket.on("sendMessage", (data) => {
    messages.push(data);
    socket.broadcast.emit("receivedMessage", data);
  });

  socket.on("disconnect", () => {
    console.log(`🔴 Socket desconectado: ${socket.id}`);
  });
});

// Inicia servidor com rotas + socket.io
server.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
