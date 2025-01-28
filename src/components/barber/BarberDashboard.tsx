import { useState, useEffect, useMemo } from "react";
import { Calendar, Clock, Users, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchDashboardStats, updateAppointment } from "../../api/apiService";
import { RecentAppointment } from "../../types/appointment";
import { AppointmentTable } from "../admin/AppointmentTable";
import { ViewAppointmentModal } from "../admin/ViewAppointmentModal";
import { EditAppointmentModal } from "../admin/EditAppointmentModal";
import { DashboardHeader } from "../admin/DashboardHeader";
import { StatCard } from "../admin/StatCard";

interface BarberStats {
  todayAppointments: number;
  totalAppointments: number;
  totalCustomers: number;
}

export default function BarberDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<BarberStats>({
    todayAppointments: 0,
    totalAppointments: 0,
    totalCustomers: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<
    RecentAppointment[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<RecentAppointment | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    date: "",
    time: "",
    status: "",
    note: "",
  });

  useEffect(() => {
    fetchDashboardData();

    let intervalId: NodeJS.Timeout;
    if (autoRefresh) {
      intervalId = setInterval(fetchDashboardData, 30000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchDashboardStats();

      // Use the stats directly from the API
      setStats({
        totalAppointments: response.stats.totalAppointments,
        todayAppointments: response.stats.todayAppointments,
        totalCustomers: response.stats.totalCustomers,
      });

      // Use appointments directly from the API - they're already filtered for this barber
      setRecentAppointments(response.recentAppointments);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAppointments = useMemo(() => {
    return recentAppointments.filter((appointment) => {
      const matchesSearch =
        appointment.customerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        appointment.service.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        appointment.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [recentAppointments, searchTerm, statusFilter]);

  const handleViewAppointment = (appointment: RecentAppointment) => {
    setSelectedAppointment(appointment);
    setIsViewModalOpen(true);
  };

  const handleEditAppointment = (appointment: RecentAppointment) => {
    setSelectedAppointment(appointment);
    setEditForm({
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
      note: appointment.note || "",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      await updateAppointment(selectedAppointment.id, editForm);
      await fetchDashboardData();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-barber-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-barber-accent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center min-h-screen bg-barber-primary">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-barber-accent text-white rounded hover:bg-barber-accent/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-barber-primary">
      <div className="p-6 max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-barber-accent hover:text-barber-accent/80 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <DashboardHeader
          title="Barber Dashboard"
          autoRefresh={autoRefresh}
          onAutoRefreshToggle={() => setAutoRefresh(!autoRefresh)}
          onManualRefresh={fetchDashboardData}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Appointments"
            value={stats.totalAppointments}
            icon={<Calendar className="w-8 h-8 text-barber-accent" />}
          />
          <StatCard
            title="Today's Appointments"
            value={stats.todayAppointments}
            icon={<Clock className="w-8 h-8 text-barber-accent" />}
          />
          <StatCard
            title="Total Customers"
            value={stats.totalCustomers}
            icon={<Users className="w-8 h-8 text-barber-accent" />}
          />
        </div>

        <AppointmentTable
          appointments={filteredAppointments}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
          onViewAppointment={handleViewAppointment}
          onEditAppointment={handleEditAppointment}
        />

        {isViewModalOpen && selectedAppointment && (
          <ViewAppointmentModal
            appointment={selectedAppointment}
            onClose={() => setIsViewModalOpen(false)}
          />
        )}

        {isEditModalOpen && selectedAppointment && (
          <EditAppointmentModal
            formData={editForm}
            onFormChange={(data) => setEditForm({ ...editForm, ...data })}
            onSave={handleUpdateAppointment}
            onClose={() => setIsEditModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
