import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, Paper, Link, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api'; // Certifique-se de que o caminho está correto

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [apelido, setApelido] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password || !confirmPassword || !apelido) {
            toast.error('Preencha todos os campos.');
            return;
        }
        if (password !== confirmPassword) {
            toast.error('As senhas não coincidem.');
            return;
        }
        // Lógica de registro (API)
        var userObject = {
            nome: apelido,
            email: email,
            senha: password
        };

        try {
            const response = await api.post('/user/register', userObject);
            if (response.status === 201) {
                // Registro bem-sucedido, redirecionar para a página de login
                navigate('/');
            } else {
                toast.error('Erro ao registrar. Tente novamente.');
            }
        } catch (error: any) {
            if (error.response) {
                toast.error(error.response.data.message || 'Erro ao registrar.');
            }
        }
    };

    const handleLogin = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate('/');
    };

    return (
        <Container maxWidth="sm">
            <ToastContainer position='top-right' autoClose={3000} />
            <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Registrar
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        label="Apelido"
                        fullWidth
                        margin="normal"
                        value={apelido}
                        onChange={(e) => { setApelido(e.target.value)}}
                        required
                    />
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value)}}
                        required
                    />
                    <TextField
                        label="Senha"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value)}}
                        required
                    />
                    <TextField
                        label="Confirmar Senha"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value)}}
                        required
                    />
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            Registrar
                        </Button>
                    </Stack>
                </Box>
                <Box mt={2} textAlign="center">
                    <Typography variant="body2">
                        Já tem uma conta?{' '}
                        <Link href="#" onClick={handleLogin}>
                            Faça login
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Register;