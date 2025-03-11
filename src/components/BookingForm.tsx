import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "./ui/calendar";
import FormInput from "./FormInput";
import { Barber } from "../types/barber";
import { Service } from "../types/service";
import { useAuth } from "../hooks/useAuth";
import {
  fetchBarbers,
  fetchServices,
  checkAppointments,
  createBooking,
} from "../api/apiService";

// Helper function to format time
const formatTime = (hour: number, minute: number): string => {
  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
};

// Helper function to generate time slots
const generateTimeSlots = (startTime: number, endTime: number) => {
  const slots = [];
  for (let hour = startTime; hour < endTime; hour++) {
    // Add both :00 and :30 slots
    slots.push(formatTime(hour, 0));
    // Only add the :30 slot if it's not going to exceed the end time
    if (hour < endTime - 1) {
      slots.push(formatTime(hour, 30));
    }
  }
  return slots;
};

export default function BookingForm() {
  const navigate = useNavigate();
  const { barberId } = useParams();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("service");
  const { user, isLoading: authLoading } = useAuth();

  const [barber, setBarber] = useState<Barber | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedTime, setSelectedTime] = useState("");
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const appointmentsRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState(() => {
    // Get user data from localStorage
    const savedUser = localStorage.getItem("user");
    const userData = savedUser ? JSON.parse(savedUser) : null;

    //console.log("User data:", userData);
    return {
      name: userData?.Keresztnev || "",
      email: userData?.email || "",
      phone: userData?.Telefonszam || "",
      date: "",
      time: "",
      barberId: barberId || "",
      serviceId: serviceId || "",
      megjegyzes: "",
    };
  });

  // Update form when user data becomes available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.Vezeteknev + " " + user.Keresztnev,
        email: user.Email,
        phone: user.Telefonszam || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (barberId) {
          //console.log("Fetching barber data for ID:", barberId);
          const barberResponse = await fetchBarbers();
          //console.log("All barbers:", barberResponse.data);
          const selectedBarber = barberResponse.data.find(
            (b: Barber) => b.id.toString() === barberId
          );
          //console.log("Selected barber data:", selectedBarber);
          setBarber(selectedBarber || null);

          if (selectedBarber) {
            //console.log(
            //  "Working hours - Start:",
            //  selectedBarber.startTime,
            //  "End:",
            //  selectedBarber.endTime
            //);
            const slots = generateTimeSlots(
              parseInt(selectedBarber.KezdesIdo),
              parseInt(selectedBarber.BefejezesIdo)
            );
            //console.log("Generated time slots:", slots);
            setTimeSlots(slots);
          }
        }
        if (serviceId) {
          //console.log("Fetching service data for ID:", serviceId);
          const serviceResponse = await fetchServices();
          //console.log("All services:", serviceResponse.data);
          const selectedService = serviceResponse.data.find(
            (s: Service) => s.id.toString() === serviceId
          );
          //console.log("Selected service:", selectedService);
          setService(selectedService || null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [barberId, serviceId]);

  // New effect to fetch booked appointments when date changes
  useEffect(() => {
    const fetchBookedAppointments = async () => {
      if (selectedDate && barberId) {
        try {
          const formattedDate = format(selectedDate, "yyyy-MM-dd");
          const response = await checkAppointments(barberId, formattedDate);
          const bookedTimes = response.data?.bookedTimes || [];
          // Filter out booked times from available slots
          const available = timeSlots.filter(
            (time) => !bookedTimes.includes(time)
          );
          setAvailableTimeSlots(available);
        } catch (error) {
          console.error("Error fetching booked appointments:", error);
          setAvailableTimeSlots(timeSlots);
        }
      } else {
        setAvailableTimeSlots(timeSlots);
      }
    };

    fetchBookedAppointments();
  }, [selectedDate, barberId, timeSlots]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(""); // Reset selected time when date changes
    if (date) {
      setFormData({
        ...formData,
        date: format(date, "yyyy-MM-dd"),
        time: "",
      });

      // Wait for the appointments section to render
      setTimeout(() => {
        appointmentsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  };

  const handleTimeSelection = (time: string) => {
    setSelectedTime(time);
    setFormData({
      ...formData,
      time: time,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBooking({
        barberId: formData.barberId,
        serviceId: formData.serviceId,
        date: formData.date,
        time: formData.time,
        megjegyzes: formData.megjegyzes,
      });
      navigate("/booking/confirmation", {
        state: {
          booking: {
            barberName: barber?.nev,
            serviceName: service?.name,
            date: formData.date,
            time: formData.time,
            service: {
              duration: service?.duration,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unexpected error occurred");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-barber-primary flex items-center justify-center">
        <p className="text-barber-accent">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-barber-primary">
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(`/booking?service=${serviceId}`)}
            className="flex items-center gap-2 text-barber-accent hover:text-barber-secondary transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            Vissza a fodrászokhoz
          </button>

          <div className="bg-barber-dark rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-6 text-barber-accent">
              Időpontfoglalás
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left side - Combined Barber and Service Info */}
              <div>
                {barber && service && (
                  <div className="bg-barber-primary p-6 rounded-lg">
                    <img
                      src={`http://localhost/project/src/imgs/${barber.kep}`}
                      alt={barber.nev}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                    <h2 className="text-xl font-bold text-barber-accent mb-2">
                      {barber.nev}
                    </h2>
                    <p className="text-barber-light/80 whitespace-normal break-words mb-4">
                      {barber.reszletek}
                    </p>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-barber-accent">
                        {service.name}
                      </h3>
                      <p className="text-barber-accent">
                        Ár: {service.price} Ft
                      </p>
                      <p className="text-barber-secondary">
                        Időtartam: {service.duration} perc
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right side - Booking Form */}
              <div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <FormInput
                    label="Teljes Név"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={true}
                  />

                  <FormInput
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={true}
                  />

                  <FormInput
                    label="Telefonszám"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={true}
                  />

                  <div className="space-y-2">
                    <label className="block text-barber-light">
                      Megjegyzés (opcionális)
                    </label>
                    <textarea
                      name="megjegyzes"
                      value={formData.megjegyzes}
                      onChange={(e) =>
                        setFormData({ ...formData, megjegyzes: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-barber-primary border border-barber-secondary/20 rounded-lg text-barber-light resize-none"
                      rows={3}
                      placeholder="További megjegyzések a foglaláshoz..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-barber-light">
                      Válassz dátumot
                    </label>
                    <Calendar
                      selected={selectedDate}
                      onDateSelect={handleDateSelect}
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    {selectedDate && (
                      <motion.div
                        ref={appointmentsRef}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2 overflow-hidden"
                      >
                        <label className="block text-barber-light">
                          Válassz időpontot
                        </label>
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 20, opacity: 0 }}
                          className="max-h-[200px] overflow-y-auto rounded-lg border border-barber-secondary/20"
                        >
                          <div className="grid grid-cols-4 gap-2 p-3">
                            <AnimatePresence mode="popLayout">
                              {availableTimeSlots.map((time) => (
                                <motion.button
                                  key={time}
                                  layout
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0.8, opacity: 0 }}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  type="button"
                                  onClick={() => handleTimeSelection(time)}
                                  className={`p-2 rounded text-sm ${
                                    selectedTime === time
                                      ? "bg-barber-accent text-barber-primary"
                                      : "bg-barber-primary text-barber-light hover:bg-barber-secondary/20"
                                  }`}
                                >
                                  {time}
                                </motion.button>
                              ))}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                        <AnimatePresence>
                          {availableTimeSlots.length === 0 && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-barber-accent text-sm mt-2"
                            >
                              Nincs elérhető időpont ezen a napon
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={!selectedDate || !selectedTime}
                    className="w-full bg-barber-accent hover:bg-barber-secondary text-barber-primary py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Foglalás megerősítése
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
