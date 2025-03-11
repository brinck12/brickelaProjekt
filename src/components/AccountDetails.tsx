import { User, Mail, Phone, Edit, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { updateUserData } from "../api/apiService";

export default function AccountDetails() {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    Keresztnev: user?.Keresztnev || "",
    Vezeteknev: user?.Vezeteknev || "",
    Email: user?.Email || "",
    Telefonszam: user?.Telefonszam || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) return;

    try {
      setError(null);
      await updateUserData(formData);
      await refreshUser();
      setIsEditing(false);
    } catch (err) {
      setError((err as Error).message);
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
    <div className="bg-barber-dark rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-barber-accent">
          Személyes adatok
        </h2>
        <button
          onClick={() => {
            if (isEditing) {
              setFormData({
                Keresztnev: user?.Keresztnev || "",
                Vezeteknev: user?.Vezeteknev || "",
                Email: user?.Email || "",
                Telefonszam: user?.Telefonszam || "",
              });
            }
            setIsEditing(!isEditing);
            setError(null);
          }}
          className="text-barber-accent hover:text-barber-secondary transition-colors"
        >
          {isEditing ? <X className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-500/10 border border-red-500 rounded text-red-500 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-barber-accent" />
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-sm text-barber-secondary">Vezetéknév</p>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.Vezeteknev}
                  onChange={(e) =>
                    setFormData({ ...formData, Vezeteknev: e.target.value })
                  }
                  className="w-full bg-barber-primary text-barber-light p-1 rounded"
                />
              ) : (
                <p className="text-barber-light">{user.Vezeteknev}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-barber-secondary">Keresztnév</p>
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
              <p className="text-barber-light">{user.Telefonszam}</p>
            )}
          </div>
        </div>

        {isEditing && (
          <button
            type="submit"
            className="w-full bg-barber-accent hover:bg-barber-accent/90 text-barber-primary py-2 rounded transition-colors"
          >
            Mentés
          </button>
        )}
      </form>
    </div>
  );
}
