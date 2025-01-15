import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import FormInput from "./FormInput";
import axios from "axios";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
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
      const response = await axios.post(
        "http://localhost/project/api/register.php",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          telefonszam: formData.telefonszam,
        }
      );
      console.log(response);
      if (response.data.success) {
        navigate("/"); // Sikeres regisztráció után irányítsuk a főoldalra
      } else {
        setError(response.data.message || "A regisztráció nem sikerült");
      }
    } catch (err) {
      console.error("Regisztrációs hiba:", err);
      setError("Hiba történt a regisztráció során");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-slate-900 rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-6 text-indigo-400">
              Regisztráció
            </h1>

            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                label="Teljes név"
                type="text"
                name="name"
                value={formData.name}
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
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Regisztráció
              </button>
            </form>

            <p className="mt-4 text-center text-slate-400">
              Már van fiókod?{" "}
              <Link
                to="/login"
                className="text-indigo-400 hover:text-indigo-300"
              >
                Jelentkezz be itt
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
