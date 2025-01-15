import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './components/HomePage';
import ServiceSelection from './components/ServiceSelection';
import BarberSelection from './components/BarberSelection';
import BookingForm from './components/BookingForm';
import AppointmentsPage from './components/AppointmentsPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/services" 
            element={
              <ProtectedRoute>
                <ServiceSelection />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/booking" 
            element={
              <ProtectedRoute>
                <BarberSelection />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/booking-form/:barberId" 
            element={
              <ProtectedRoute>
                <BookingForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/appointments" 
            element={
              <ProtectedRoute>
                <AppointmentsPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}