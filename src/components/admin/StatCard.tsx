import React from "react";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

export function StatCard({ title, value, icon }: StatCardProps) {
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
