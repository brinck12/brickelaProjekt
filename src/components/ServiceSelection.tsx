import { useEffect, useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Service } from "../types/service";
import { Barber } from "../types/barber";
import { fetchServices, fetchBarbers } from "../api/apiService";
import BarberCard from "./BarberCard";
import { motion, AnimatePresence } from "framer-motion";

export default function ServiceSelection() {
  const navigate = useNavigate();

  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch services
        const servicesResponse = await fetchServices();
        setServices(servicesResponse.data);

        // Fetch all barbers
        const barbersResponse = await fetchBarbers();
        setBarbers(barbersResponse.data);
      } catch (error) {
        console.log("Hiba történt az adatok lekérése közben:", error);
        setError("Hiba történt az adatok lekérése közben.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleService = (serviceId: string) => {
    if (expandedServiceId === serviceId) {
      // If clicking on the already expanded service, close it
      setExpandedServiceId(null);
    } else {
      // Otherwise, expand the clicked service (and collapse any other)
      setExpandedServiceId(serviceId);
    }
  };

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
            <div className="space-y-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="border border-barber-secondary/20 rounded-lg overflow-hidden"
                >
                  {/* Service Header - Clickable */}
                  <div
                    onClick={() => toggleService(service.id.toString())}
                    className="bg-barber-dark p-6 cursor-pointer hover:bg-barber-dark/80 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-bold text-barber-accent">
                          {service.name}
                        </h2>
                        {service.description && (
                          <p className="text-barber-light mt-2">
                            {service.description}
                          </p>
                        )}
                        <div className="mt-4 flex space-x-4">
                          <span className="text-barber-accent">
                            {service.price} Ft
                          </span>
                          <span className="text-barber-secondary">
                            {service.duration} perc
                          </span>
                        </div>
                      </div>
                      {expandedServiceId === service.id.toString() ? (
                        <ChevronUp className="text-barber-secondary" />
                      ) : (
                        <ChevronDown className="text-barber-secondary" />
                      )}
                    </div>
                  </div>

                  {/* Barber Cards - Expandable Section */}
                  <AnimatePresence>
                    {expandedServiceId === service.id.toString() && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden bg-barber-primary"
                      >
                        <div className="p-6 border-t border-barber-secondary/20">
                          <h3 className="text-lg font-bold text-barber-accent mb-4">
                            Válassz fodrászt
                          </h3>
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {barbers.map((barber) => (
                              <BarberCard
                                key={barber.id}
                                barber={barber}
                                onSelect={() =>
                                  navigate(
                                    `/booking-form/${barber.id}?service=${service.id}`
                                  )
                                }
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
