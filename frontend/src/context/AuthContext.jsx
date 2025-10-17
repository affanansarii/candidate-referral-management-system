import React, { createContext, useState, useContext, useEffect } from "react";
import { authAPI } from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user on app start
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const res = await authAPI.getMe();
                    setUser(res.data.user);
                } catch (error) {
                    console.error("Error loading user:", error);
                    logout();
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await authAPI.login(email, password);
            localStorage.setItem("token", res.data.token);
            setUser(res.data.user);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Login failed",
            };
        }
    };

    const register = async (name, email, password) => {
        try {
            const res = await authAPI.register(name, email, password);
            localStorage.setItem("token", res.data.token);
            setUser(res.data.user);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    error.response?.data?.errors?.[0]?.msg ||
                    "Registration failed",
            };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
