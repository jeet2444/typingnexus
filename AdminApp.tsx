import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';

const AdminApp: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<AdminLogin />} />
                    <Route
                        path="/dashboard/*"
                        element={<AdminPanel />}
                    />
                    {/* Catch all - redirect to login */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default AdminApp;
