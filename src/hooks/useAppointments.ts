import { useState, useEffect } from "react";
import { fetchAppointments } from "../api/apiService";
import { Appointment } from "../types/appointment";
import { useAuth } from "./useAuth";

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const getAppointments = async () => {
      if (!user) {
        setAppointments([]);
        setLoading(false);
        return;
      }

      try {
        const data = await fetchAppointments();
        setAppointments(data);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        setError("Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };

    getAppointments();
  }, [user]);

  return { appointments, loading, error };
}
