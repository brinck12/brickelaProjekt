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
