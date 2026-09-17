import { BrowserRouter, Route, Routes } from "react-router-dom"
import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"
import ChatPage from "../pages/ChatPage"
import { AuthProvider } from '../context/AuthContext'
import ProtectedRoute from "../components/layout/ProtectedRoute"

function AppRoutes() {

    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/" element={<ProtectedRoute> <ChatPage /></ProtectedRoute>} />
                </Routes></AuthProvider>
        </BrowserRouter>
    )
}


export default AppRoutes