import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/index";
import Register from "./pages/Register/index";
import { AuthProvider } from "./context/AuthProvider";
import Chat from "./pages/Chat";
import { GoogleOAuthProvider } from '@react-oauth/google';
const App = () => {
  return (
    <AuthProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID as string}>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/chat" element={<Chat />} />
            {/* Adicione outras rotas aqui conforme necessário */}
          </Routes>
        </Router>
      </GoogleOAuthProvider>
    </AuthProvider>
  );
};

export default App;
