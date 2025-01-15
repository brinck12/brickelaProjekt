import { User, Mail, Phone } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { updateUserData } from "../api/apiService";

export default function AccountDetails() {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    Keresztnev: user?.Keresztnev || "",
    Email: user?.Email || "",
    Telefonszam: user?.Telefonszam || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await updateUserData(formData);

      if (response.status === 200) {
        setIsEditing(false);
        await refreshUser();
        alert("Adatok sikeresen frissítve!");
      } else {
        alert("Hiba történt a mentés során.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hiba történt a mentés során.");
    }
  };

  if (!user) {
    return (
      <div className="bg-barber-dark rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-serif font-bold mb-6 text-barber-accent">
          Fiókadatok
        </h2>
        <p className="text-barber-light">
          Nincsenek felhasználói adatok. Kérjük, jelentkezz be!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-barber-dark rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-serif font-bold mb-6 text-barber-accent">
        Fiókadatok
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-barber-accent" />
          <div className="flex-1">
            <p className="text-sm text-barber-secondary">Név</p>
            {isEditing ? (
              <input
                type="text"
                value={formData.Keresztnev}
                onChange={(e) =>
                  setFormData({ ...formData, Keresztnev: e.target.value })
                }
                className="w-full bg-barber-primary text-barber-light p-1 rounded"
              />
            ) : (
              <p className="text-barber-light">{user.Keresztnev}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-barber-accent" />
          <div className="flex-1">
            <p className="text-sm text-barber-secondary">E-mail</p>
            {isEditing ? (
              <input
                type="email"
                value={formData.Email}
                onChange={(e) =>
                  setFormData({ ...formData, Email: e.target.value })
                }
                className="w-full bg-barber-primary text-barber-light p-1 rounded"
              />
            ) : (
              <p className="text-barber-light">{user.Email}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-barber-accent" />
          <div className="flex-1">
            <p className="text-sm text-barber-secondary">Telefonszám</p>
            {isEditing ? (
              <input
                type="tel"
                value={formData.Telefonszam}
                onChange={(e) =>
                  setFormData({ ...formData, Telefonszam: e.target.value })
                }
                className="w-full bg-barber-primary text-barber-light p-1 rounded"
              />
            ) : (
              <p className="text-barber-light">{user.Telefonszam || "N/A"}</p>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="flex gap-2">
            <button
              type="submit"
              className="mt-6 w-full bg-barber-accent hover:bg-barber-secondary text-barber-primary py-2 rounded-lg transition-colors"
            >
              Mentés
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="mt-6 w-full bg-barber-primary hover:bg-barber-secondary text-barber-light py-2 rounded-lg transition-colors"
            >
              Mégse
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="mt-6 w-full bg-barber-accent hover:bg-barber-secondary text-barber-primary py-2 rounded-lg transition-colors"
          >
            Adatok szerkesztése
          </button>
        )}
      </form>
    </div>
  );
}
