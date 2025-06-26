// src/pages/Chat.tsx
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Box, TextField, Button, Paper, Typography, Stack } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io, { Socket } from 'socket.io-client';
import { AuthContext } from "../../context/AuthProvider";
import { useNavigate } from 'react-router-dom';


interface Message {
  autor: string;
  message: string;
}

const Chat: React.FC = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

  const [username] = useState(user?.name || '');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  console.log('User:', user);
  // Referência do socket
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Conectar ao servidor Socket.IO
    const socket = io('http://localhost:3333');
    socketRef.current = socket;


    socket.on('receivedMessage', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('previusMessage', (msgs: Message[]) => {
      setMessages(msgs);
    });

return () => {
      socket.disconnect();
      console.log("❌ Socket desconectado");
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !message) {
      toast.error('Usuário e mensagem são obrigatórios');
      return;
    }

    const newMessage: Message = {
      autor: username,
      message: message,
    };

    setMessages((prev) => [...prev, newMessage]);
    socketRef.current?.emit('sendMessage', newMessage);
    setMessage('');
  };

  const handleLogout = () => {
    logout();
    socketRef.current?.disconnect();

    navigate('/');
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <ToastContainer position="top-right" autoClose={3000} />
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 600 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography align="left" gutterBottom>
                <strong>Usuário: </strong> {user?.name}
            </Typography>
            <Button onClick={handleLogout} variant="outlined" size="small" color="primary">
                Sair
            </Button>
        </Stack>
            <Box
              sx={{
                border: '1px solid #ddd',
                height: 400,
                overflowY: 'auto',
                p: 2,
              }}
            >
              {messages.map((msg, index) => (
                <Typography key={index} sx={{ mb: 1 }}>
                  <strong>{msg.autor}</strong>: {msg.message}
                </Typography>
              ))}
            </Box>
            <TextField
              label="Mensagem"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button variant="contained" type="submit">
              Enviar
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default Chat;
