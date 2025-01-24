import React, { useState, useEffect } from "react";
import { Calendar, Clock, Users, Scissors } from "lucide-react";
import { fetchDashboardStats } from "../../api/apiService";

interface DashboardStats {
  totalAppointments: number;
  todayAppointments: number;
  totalCustomers: number;
  totalBarbers: number;
}

interface RecentAppointment {
  id: number;
  customerName: string;
  service: string;
  date: string;
  time: string;
  status: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    todayAppointments: 0,
    totalCustomers: 0,
    totalBarbers: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<
    RecentAppointment[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchDashboardStats();
      setStats(response.stats);
      setRecentAppointments(response.recentAppointments);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to fetch dashboard data. Please try again later.");
    } finally {
      setIsLoading(false);
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
        <h1 className="text-3xl font-bold text-barber-accent mb-8">
          Admin Dashboard
        </h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          <StatCard
            title="Active Barbers"
            value={stats.totalBarbers}
            icon={<Scissors className="w-8 h-8 text-barber-accent" />}
          />
        </div>

        {/* Recent Appointments */}
        <div className="bg-barber-dark rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-barber-accent mb-4">
            Recent Appointments
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-barber-light border-b border-barber-secondary/20">
                  <th className="pb-4">Customer</th>
                  <th className="pb-4">Service</th>
                  <th className="pb-4">Date</th>
                  <th className="pb-4">Time</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="text-barber-light border-b border-barber-secondary/10 last:border-0"
                  >
                    <td className="py-3">{appointment.customerName}</td>
                    <td className="py-3">{appointment.service}</td>
                    <td className="py-3">{appointment.date}</td>
                    <td className="py-3">{appointment.time}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          appointment.status === "Completed"
                            ? "bg-green-500/20 text-green-500"
                            : appointment.status === "Pending"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentAppointments.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-4 text-center text-barber-light"
                    >
                      No recent appointments
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-barber-dark rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-barber-light">{title}</h3>
        {icon}
      </div>
      <p className="text-3xl font-bold text-barber-accent">{value}</p>
    </div>
  );
}
