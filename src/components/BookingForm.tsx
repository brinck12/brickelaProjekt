import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import FormInput from "./FormInput";

export default function BookingForm() {
  const navigate = useNavigate();
  const { barberId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    barberId: barberId || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Foglalás sikeresen elküldve!");
    navigate("/");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-barber-primary">
      <div className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate("/booking")}
            className="flex items-center gap-2 text-barber-accent hover:text-barber-secondary transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            Vissza a fodrászokhoz
          </button>

          <div className="bg-barber-dark rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-6 text-barber-accent">
              Időpontfoglalás
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                label="Teljes Név"
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
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <FormInput
                label="Dátum"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />

              <FormInput
                label="Idő"
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />

              <button
                type="submit"
                className="w-full bg-barber-accent hover:bg-barber-secondary text-barber-primary py-3 rounded-lg font-semibold transition-colors"
              >
                Foglalás megerősítése
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
