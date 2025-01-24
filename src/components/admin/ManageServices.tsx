import { useState, useEffect } from "react";
import { Plus, Pencil, Trash } from "lucide-react";
import { fetchServices, addService, deleteService } from "../../api/apiService";

interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  description?: string;
}

export function ManageServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
    description: "",
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      const response = await fetchServices();
      setServices(response.data);
    } catch (error) {
      setError("Failed to load services");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddService = async () => {
    try {
      await addService({
        name: formData.name,
        price: Number(formData.price),
        duration: Number(formData.duration),
        description: formData.description,
      });
      await loadServices();
      setIsAddModalOpen(false);
      setFormData({ name: "", price: "", duration: "", description: "" });
    } catch (error) {
      console.error("Failed to add service:", error);
    }
  };

  const handleDeleteService = async (serviceId: number) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteService(serviceId);
        await loadServices();
      } catch (error) {
        console.error("Failed to delete service:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-barber-accent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
        <button
          onClick={loadServices}
          className="ml-2 text-barber-accent hover:text-barber-accent/80"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-barber-primary">
      <div className="bg-barber-dark rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-barber-accent">
            Manage Services
          </h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded bg-barber-accent text-white hover:bg-barber-accent/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-barber-light border-b border-barber-secondary/20">
                <th className="pb-4">Name</th>
                <th className="pb-4">Price</th>
                <th className="pb-4">Duration</th>
                <th className="pb-4">Description</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr
                  key={service.id}
                  className="text-barber-light border-b border-barber-secondary/10 last:border-0"
                >
                  <td className="py-3">{service.name}</td>
                  <td className="py-3">{service.price} Ft</td>
                  <td className="py-3">{service.duration} perc</td>
                  <td className="py-3">{service.description}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          /* TODO: Implement edit */
                        }}
                        className="p-2 rounded bg-barber-accent/10 text-barber-accent hover:bg-barber-accent/20"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="p-2 rounded bg-red-500/10 text-red-500 hover:bg-red-500/20"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Service Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-barber-dark p-6 rounded-lg w-full max-w-md">
              <h3 className="text-xl font-semibold text-barber-accent mb-4">
                Add New Service
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-barber-light text-sm block mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded bg-barber-primary text-white"
                  />
                </div>
                <div>
                  <label className="text-barber-light text-sm block mb-1">
                    Price (Ft)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded bg-barber-primary text-white"
                  />
                </div>
                <div>
                  <label className="text-barber-light text-sm block mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded bg-barber-primary text-white"
                  />
                </div>
                <div>
                  <label className="text-barber-light text-sm block mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded bg-barber-primary text-white resize-none h-24"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded bg-barber-primary text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddService}
                    className="px-4 py-2 rounded bg-barber-accent text-white"
                  >
                    Add Service
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
