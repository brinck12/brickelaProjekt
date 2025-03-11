import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import FormInput from "./FormInput";
import { register } from "../api/apiService";
import { ApiError } from "../api/apiService";
import PageTransition from "./PageTransition";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    keresztnev: "",
    vezeteknev: "",
    email: "",
    telefonszam: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (error) setError(""); // Előző hibák törlése
    if (formData.password !== formData.confirmPassword) {
      setError("A jelszavak nem egyeznek");
      return;
    }

    try {
      /*console.log("Attempting registration with:", {
        ...formData,
        password: "[REDACTED]",
        confirmPassword: "[REDACTED]",
      });
*/
      const response = await register(
        formData.email,
        formData.password,
        formData.keresztnev,
        formData.vezeteknev,
        formData.telefonszam
      );

      //console.log("Registration response:", response);

      if (response.data.success) {
        navigate("/login");
      } else {
        setError(response.data.message || "A regisztráció nem sikerült");
      }
    } catch (err) {
      //console.error("Regisztrációs hiba:", err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Hiba történt a regisztráció során");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-barber-primary">
        <div className="py-12 px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-barber-dark rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold mb-6 text-barber-accent">
                Regisztráció
              </h1>

              {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <FormInput
                  label="Vezetéknév"
                  type="text"
                  name="vezeteknev"
                  value={formData.vezeteknev}
                  onChange={handleChange}
                  required
                />

                <FormInput
                  label="Keresztnév"
                  type="text"
                  name="keresztnev"
                  value={formData.keresztnev}
                  onChange={handleChange}
                  required
                />

                <FormInput
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <FormInput
                  label="Telefonszám"
                  type="text"
                  name="telefonszam"
                  value={formData.telefonszam}
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

                <FormInput
                  label="Jelszó megerősítése"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />

                <button
                  type="submit"
                  className="w-full bg-barber-accent hover:bg-barber-secondary text-barber-primary py-3 rounded-lg font-semibold transition-colors"
                >
                  Regisztráció
                </button>
              </form>

              <p className="mt-4 text-center text-barber-light">
                Már van fiókod?{" "}
                <Link
                  to="/login"
                  className="text-barber-accent hover:text-barber-secondary"
                >
                  Jelentkezz be itt
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
