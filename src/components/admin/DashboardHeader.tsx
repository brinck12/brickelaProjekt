import { RefreshCw } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  autoRefresh: boolean;
  onAutoRefreshToggle: () => void;
  onManualRefresh: () => void;
}

export function DashboardHeader({
  title,
  autoRefresh,
  onAutoRefreshToggle,
  onManualRefresh,
}: DashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-barber-accent">{title}</h1>
      <div className="flex items-center gap-4">
        <button
          onClick={onAutoRefreshToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded ${
            autoRefresh ? "bg-barber-accent" : "bg-barber-dark"
          } text-white transition-colors`}
        >
          <RefreshCw className="w-4 h-4" />
          {autoRefresh ? "Auto-refresh On" : "Auto-refresh Off"}
        </button>
        <button
          onClick={onManualRefresh}
          className="p-2 rounded bg-barber-dark text-barber-accent hover:bg-barber-dark/90"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
