import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";

const AppContent = () => {
    const { user, loading } = useAuth();
    const [isLogin, setIsLogin] = useState(true);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return isLogin ? (
            <Login onToggleMode={() => setIsLogin(false)} />
        ) : (
            <Register onToggleMode={() => setIsLogin(true)} />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Dashboard />
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
