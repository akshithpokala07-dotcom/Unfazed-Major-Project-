import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [therapist, setTherapist] = useState(() => {
        const savedTherapist = localStorage.getItem("therapist");

        return savedTherapist
            ? JSON.parse(savedTherapist)
            : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem("token");
    });

    const login = (loginData) => {
        setToken(loginData.token);
        setTherapist(loginData.therapist);

        localStorage.setItem("token", loginData.token);
        localStorage.setItem(
            "therapist",
            JSON.stringify(loginData.therapist)
        );
    };

    const logout = () => {
        setToken(null);
        setTherapist(null);

        localStorage.removeItem("token");
        localStorage.removeItem("therapist");
    };

    return (
        <AuthContext.Provider
            value={{
                therapist,
                token,
                login,
                logout,
                isAuthenticated: !!token
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};