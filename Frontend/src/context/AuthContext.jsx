import { createContext, useState, useEffect } from "react"
import { fetchUser, loginUser, logoutUser, registerUser } from '../api/auth.api.js'
import { toast } from "react-toastify";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [status, setStatus] = useState("checkingSession");
    const [error, setError] = useState(null);
    const [cooldown, setCooldown] = useState(0);

    // ticks cooldown down every second
    useEffect(() => {
        if (cooldown === 0) return;
        const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    // pulls seconds out of a 429 response and starts the shared cooldown
    function startCooldownFrom429(err) {
        const data = err.response?.data;
        const message = data?.message || "Too many requests.";
        const seconds = data?.retryAfter ?? Number(message.match(/(\d+)\s*seconds/)?.[1]);
        if (seconds) setCooldown(seconds);
        return message;
    }

    useEffect(() => {
        fetchUser()
            .then((data) => {
                setUser(data.user);
                setStatus("authenticated");
            })
            .catch((err) => {
                if (err.response?.status === 429) {
                    toast.error(startCooldownFrom429(err)); // <-- now also blocks the login button
                }
                setStatus("unauthenticated");
            })
    }, [])

    async function login(credentials) {
        setError(null);
        try {
            const data = await loginUser(credentials);
            setUser(data.user);
            setStatus("authenticated");
        } catch (err) {
            const message = err.response?.status === 429
                ? startCooldownFrom429(err)
                : (err.response?.data?.message || "Login failed");
            setError(message);
            throw err;
        }
    }

    async function register(credentials) {
        setError(null);
        try {
            const data = await registerUser(credentials);
            setUser(data.user);
            setStatus("authenticated");
        } catch (err) {
            const message = err.response?.status === 429
                ? startCooldownFrom429(err)
                : (err.response?.data?.message || "Registration failed");
            setError(message);
            throw err;
        }
    }

    async function logout() {
        try {
            await logoutUser();
            setUser(null);
            setStatus("unauthenticated");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to logout");
            throw err;
        }
    }

    return (
        <AuthContext.Provider value={{
            user, status, error, login, logout, register,
            cooldown, isLimited: cooldown > 0,
        }}>
            {children}
        </AuthContext.Provider>
    )
}