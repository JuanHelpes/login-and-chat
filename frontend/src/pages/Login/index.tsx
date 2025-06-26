import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, Paper, Link, Stack } from '@mui/material';
// import GoogleIcon from '@mui/icons-material/Google';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider'; // Certifique-se de que o caminho está correto
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

type GoogleJwtPayload = {
    email: string;
    jti: string;
    name: string;
    [key: string]: any;
};

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const { login, Login_Google } = React.useContext(AuthContext); // Usando o contexto de autenticação
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Aqui você pode adicionar a lógica de autenticação
        if (!email || !senha) {
            toast.error('Preencha todos os campos.');
            return;
        }
        try{
            const success = await login(email, senha);
            if (success) {
                navigate('/Chat');
            } else {
                toast.error('Erro ao fazer login. Tente novamente.');
            }
        } catch (error) {
            toast.error('Erro ao fazer login. Tente novamente.');
        }

    };

    const handleGoogleLogin = async (res: any) => {
        if (!res.credential) {
            toast.error('Erro ao fazer login com o Google.');
            return;
        } else {
            try {
                // Lógica para login com Google
                const decodedToken = jwtDecode<GoogleJwtPayload>(res.credential);
                const success = await Login_Google(decodedToken.email, decodedToken.jti, decodedToken.name);
                if (success) {
                    navigate('/Chat');
                } else {
                    toast.error('Erro ao fazer login com o Google. Tente novamente.');
                }
            } catch (error) {
                toast.error('Erro ao fazer login com o Google.');
            }
        }
    };

    const handleRegister = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate('/register');
    };

    return (
        <Container maxWidth="sm">
            <ToastContainer position='top-right' autoClose={3000} />
            <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Login
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Senha"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            Entrar
                        </Button>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Box flex={1} height={1} sx={{ borderBottom: '0.7px solid #7F858D' }} />
                            <Typography align="center" component="span" color="#7F858D" sx={{ px: 1 }}>
                                OU
                            </Typography>
                            <Box flex={1} height={1} sx={{ borderBottom: '0.7px solid #7F858D' }} />
                        </Stack>
                        <GoogleLogin
                            onSuccess={(res) => handleGoogleLogin(res)}
                            onError={() => { toast.error('Erro ao fazer login com o Google.'); }}
                        />
                    </Stack>
                </Box>
                <Box mt={2} textAlign="center">
                    <Typography variant="body2">
                        Não tem uma conta?{' '}
                        <Link href="#" onClick={handleRegister}>
                            Registre-se
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;