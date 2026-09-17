import api from './axiosInstance.js'

export async function loginUser(data) {
    const res = await api.post("/auth/login", data);
    return res.data;
}

export async function registerUser(data) {
    const res = await api.post("/auth/register", data);
    return res.data;
}

export async function logoutUser() {
    const res = await api.delete("/auth/logout");
    return res.data;
}

export async function fetchUser() {
    const res = await api.get("/auth/profile");
    return res.data;
}