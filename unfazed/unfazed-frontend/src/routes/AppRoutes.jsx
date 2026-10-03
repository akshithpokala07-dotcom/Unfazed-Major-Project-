import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/therapist/Dashboard";
import Profile from "../pages/therapist/Profile";
import PublicTherapistProfile from "../pages/client/PublicTherapistProfile";
import BookingPage from "../pages/client/BookingPage";
import Clients from "../pages/therapist/Clients";
import ClientDetails from "../pages/therapist/ClientDetails";
import Analytics from "../pages/therapist/Analytics";
import ChatPage from "../pages/client/ChatPage";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route
    path="/:slug"
    element={<PublicTherapistProfile />}
/>
<Route
    path="/:slug/book"
    element={<BookingPage />}
/>
<Route
    path="/clients"
    element={<Clients />}
/>
         <Route
    path="/clients/:clientId"
    element={<ClientDetails />}
/>   
<Route
    path="/chat"
    element={<ChatPage />}
/>
        </Routes>
        
    );
};

export default AppRoutes;