import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchBarbers } from "../api/apiService"; // API hívás
import { Barber } from "../types/barber"; // Típusdefiníció
import BarberCard from "./BarberCard"; // Vélemények megjelenítése

export default function BarberSelection() {
  const navigate = useNavigate();

  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getBarbers = async () => {
      try {
        const response = await fetchBarbers(); // API hívás
        console.log(response);
        setBarbers(response.data); // Adatok beállítása
      } catch (error) {
        console.log("Hiba történt az adatok lekérése közben:", error);
        setError("Hiba történt az adatok lekérése közben.");
      } finally {
        setLoading(false);
      }
    };

    getBarbers();
  }, []);

  return (
    <div className="min-h-screen bg-barber-primary">
      <div className="py-8 md:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-barber-accent hover:text-barber-secondary transition-colors mb-6 md:mb-8"
          >
            <ArrowLeft size={20} />
            Vissza a főoldalra
          </button>

          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-6 md:mb-8 text-barber-accent">
            Válassz Fodrászt
          </h1>

          {loading && (
            <p className="text-center text-barber-accent">Betöltés...</p>
          )}
          {error && <p className="text-center text-red-400">{error}</p>}

          {!loading && !error && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {barbers.map((barber) => (
                <BarberCard
                  key={barber.id}
                  barber={barber}
                  onSelect={() => navigate(`/booking-form/${barber.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
