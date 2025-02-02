import { Search, Download } from "lucide-react";
import { RecentAppointment } from "../../types/appointment";

interface AppointmentTableProps {
  appointments: RecentAppointment[];
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onViewAppointment: (appointment: RecentAppointment) => void;
  onEditAppointment: (appointment: RecentAppointment) => void;
}

export function AppointmentTable({
  appointments,
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onViewAppointment,
  onEditAppointment,
}: AppointmentTableProps) {
  const exportToCSV = () => {
    const headers = ["Customer", "Service", "Date", "Time", "Status"];
    const csvContent = [
      headers.join(","),
      ...appointments.map((app) =>
        [app.customerName, app.service, app.date, app.time, app.status].join(
          ","
        )
      ),
    ].join("\n");

    // Add UTF-8 BOM and specify encoding
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "appointments.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-barber-dark rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-barber-accent">
          Recent Appointments
        </h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-barber-light absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 rounded bg-barber-primary text-barber-light placeholder-barber-light/50 focus:outline-none focus:ring-2 focus:ring-barber-accent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-4 py-2 rounded bg-barber-primary text-barber-light focus:outline-none focus:ring-2 focus:ring-barber-accent"
          >
            <option value="all">Összes</option>
            <option value="teljesítve">Teljesítve</option>
            <option value="foglalt">Foglalt</option>
            <option value="lemondva">Lemondva</option>
          </select>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 rounded bg-barber-accent text-white hover:bg-barber-accent/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-barber-light border-b border-barber-secondary/20">
              <th className="pb-4">Ügyfél</th>
              <th className="pb-4">Szolgáltatás</th>
              <th className="pb-4">Dátum</th>
              <th className="pb-4">Időpont</th>
              <th className="pb-4">Státusz</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr
                key={appointment.id}
                className="text-barber-light border-b border-barber-secondary/10 last:border-0 hover:bg-barber-primary/5 cursor-pointer transition-colors"
              >
                <td className="py-3">{appointment.customerName}</td>
                <td className="py-3">{appointment.service}</td>
                <td className="py-3">{appointment.date}</td>
                <td className="py-3">{appointment.time}</td>
                <td className="py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      appointment.status === "Teljesítve"
                        ? "bg-green-500/20 text-green-500"
                        : appointment.status === "Foglalt"
                        ? "bg-yellow-500/20 text-yellow-500"
                        : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewAppointment(appointment)}
                      className="px-3 py-1 text-sm rounded bg-barber-accent text-white hover:bg-barber-accent/90 transition-colors"
                    >
                      Részletek
                    </button>
                    <button
                      onClick={() => onEditAppointment(appointment)}
                      className="px-3 py-1 text-sm rounded bg-barber-secondary text-white hover:bg-barber-secondary/90 transition-colors"
                    >
                      Szerkesztés
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 text-center text-barber-light">
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
