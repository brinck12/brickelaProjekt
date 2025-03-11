import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ServiceCard from "./ServiceCard";
import { Service } from "../types/service";
import { fetchServices } from "../api/apiService";
// Szolgáltatás típusdefiníció

export default function ServiceSelection() {
  const navigate = useNavigate();

  const [services, setServices] = useState<Service[]>([]); // Szolgáltatások listája
  const [loading, setLoading] = useState(true); // Betöltés állapota
  const [error, setError] = useState<string | null>(null); // Hibaüzenet, ha van

  // Adatok betöltése az API-ból
  useEffect(() => {
    const getServices = async () => {
      try {
        const response = await fetchServices(); // API hívás
        //console.log(response);
        setServices(response.data); // Adatok beállítása
      } catch (error) {
        console.log("Hiba történt az adatok lekérése közben:", error);
        setError("Hiba történt az adatok lekérése közben.");
      } finally {
        setLoading(false);
      }
    };

    getServices();
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
            Válasszon szolgáltatást
          </h1>

          {loading && <p className="text-barber-secondary">Loading...</p>}
          {error && <p className="text-red-400">Error: {error}</p>}

          {!loading && !error && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onSelect={() => navigate(`/booking?service=${service.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
