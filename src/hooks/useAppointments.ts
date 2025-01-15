import { useState, useEffect } from "react";
import { Appointment } from "../types/appointment";

// Mock data - in a real app, this would come from your API
const mockAppointments: Appointment[] = [
  {
    id: 1,
    barberName: "James Wilson",
    date: "2024-03-15",
    time: "10:00 AM",
    status: "completed",
    service: "Haircut & Beard Trim",
  },
  {
    id: 2,
    barberName: "Michael Rodriguez",
    date: "2024-03-20",
    time: "2:30 PM",
    status: "upcoming",
    service: "Fade & Design",
  },
  {
    id: 3,
    barberName: "David Chen",
    date: "2024-02-28",
    time: "11:00 AM",
    status: "cancelled",
    service: "Haircut",
  },
];

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchAppointments = async () => {
      try {
        // In a real app, this would be an API call
        setAppointments(mockAppointments);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        setError("Failed to fetch appointments");
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return { appointments, loading, error };
}
