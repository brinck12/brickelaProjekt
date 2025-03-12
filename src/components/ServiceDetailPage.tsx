import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { fetchServices, fetchBarbers } from "../api/apiService";
import { Service } from "../types/service";
import { Barber } from "../types/barber";
import BarberCard from "./BarberCard";

export default function ServiceDetailPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();

  const [service, setService] = useState<Service | null>(null);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (serviceId) {
          // Fetch service details
          const servicesResponse = await fetchServices();
          const selectedService = servicesResponse.data.find(
            (s: Service) => s.id.toString() === serviceId
          );
          setService(selectedService || null);

          // Fetch all barbers (in a real app, you'd filter by service)
          const barbersResponse = await fetchBarbers();
          setBarbers(barbersResponse.data);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Hiba történt az adatok lekérése közben.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [serviceId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-barber-primary flex items-center justify-center">
        <p className="text-barber-accent">Loading...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-barber-primary flex items-center justify-center">
        <p className="text-barber-accent">Szolgáltatás nem található</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-barber-primary">
      <div className="py-8 md:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate("/services")}
            className="flex items-center gap-2 text-barber-accent hover:text-barber-secondary transition-colors mb-6 md:mb-8"
          >
            <ArrowLeft size={20} />
            Vissza a szolgáltatásokhoz
          </button>

          <div className="bg-barber-dark rounded-lg p-8 mb-8">
            <h1 className="text-3xl font-bold mb-4 text-barber-accent">
              {service.name}
            </h1>
            {service.description && (
              <p className="text-barber-light mb-6">{service.description}</p>
            )}
            <div className="flex space-x-6">
              <div className="bg-barber-primary px-4 py-2 rounded-lg">
                <span className="text-barber-accent font-bold">
                  {service.price} Ft
                </span>
              </div>
              <div className="bg-barber-primary px-4 py-2 rounded-lg">
                <span className="text-barber-secondary font-bold">
                  {service.duration} perc
                </span>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-barber-accent">
            Válassz fodrászt
          </h2>

          {error && <p className="text-red-400 mb-4">{error}</p>}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {barbers.map((barber) => (
              <BarberCard
                key={barber.id}
                barber={barber}
                onSelect={() =>
                  navigate(`/booking-form/${barber.id}?service=${service.id}`)
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
