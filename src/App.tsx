import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import BarberRoute from "./components/barber/BarberRoute";
import HomePage from "./components/HomePage";
import ServiceSelection from "./components/ServiceSelection";
import BarberSelection from "./components/BarberSelection";
import BookingForm from "./components/BookingForm";
import AppointmentsPage from "./components/AppointmentsPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import BookingConfirmation from "./components/BookingConfirmation";
import AdminDashboard from "./components/admin/AdminDashboard";
import { ManageBarbers } from "./components/admin/ManageBarbers";
import { ManageServices } from "./components/admin/ManageServices";
import BarberDashboard from "./components/barber/BarberDashboard";
import { EmailVerification } from "./components/EmailVerification";
import { CancelBooking } from "./components/CancelBooking";
import ReviewPage from "./components/ReviewPage";
import ServiceDetailPage from "./components/ServiceDetailPage";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/activate" element={<EmailVerification />} />
        <Route path="/cancel-booking" element={<CancelBooking />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <ServiceSelection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/services/:serviceId"
          element={
            <ProtectedRoute>
              <ServiceDetailPage />
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
        <Route path="/booking/confirmation" element={<BookingConfirmation />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/barbers"
          element={
            <AdminRoute>
              <ManageBarbers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <AdminRoute>
              <ManageServices />
            </AdminRoute>
          }
        />

        {/* Barber Routes */}
        <Route
          path="/barber"
          element={
            <BarberRoute>
              <BarberDashboard />
            </BarberRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
}
