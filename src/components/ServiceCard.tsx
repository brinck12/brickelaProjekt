import { Clock } from "lucide-react";
import { Service } from "../types/service";

interface ServiceCardProps {
  service: Service;
  onSelect: () => void;
}

export default function ServiceCard({ service, onSelect }: ServiceCardProps) {
  return (
    <div
      onClick={onSelect}
      className="bg-barber-dark rounded-lg p-6 cursor-pointer hover:bg-barber-dark/80 transition-colors group"
    >
      <div className="mb-4 overflow-hidden rounded-lg">
        <img
          src={`http://localhost/project/src/imgs/${service.image}`}
          alt={service.name}
          className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <h3 className="text-xl font-semibold text-barber-accent mb-2">
        {service.name}
      </h3>
      <div className="flex justify-between items-center text-barber-light mb-2">
        <span>{service.duration} perc</span>
        <span>{service.price} Ft</span>
      </div>
      {service.description && (
        <p className="text-barber-secondary text-sm">{service.description}</p>
      )}
    </div>
  );
}
