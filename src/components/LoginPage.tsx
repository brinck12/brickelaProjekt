import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import FormInput from "./FormInput";
import { useAuth } from "../hooks/useAuth";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); // Login funkció használata az AuthContext-ből
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Váratlan hiba történt");
      }
      //console.error("Login error:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-barber-primary">
      <div className="py-12 px-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-barber-accent hover:text-barber-secondary transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            Vissza a főoldalra
          </button>

          <div className="bg-barber-dark rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-6 text-barber-accent">
              Bejelentkezés
            </h1>

            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                label="E-mail"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <FormInput
                label="Jelszó"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="submit"
                className="w-full bg-barber-accent hover:bg-barber-secondary text-barber-primary py-3 rounded-lg font-semibold transition-colors"
              >
                Bejelentkezés
              </button>
            </form>

            <p className="mt-4 text-center text-barber-light">
              Még nincs fiókod?{" "}
              <Link
                to="/register"
                className="text-barber-accent hover:text-barber-secondary"
              >
                Regisztrálj itt
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
