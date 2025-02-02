import { useState, useEffect } from "react";
import { Plus, Pencil, Trash, Upload, ArrowLeft } from "lucide-react";
import { fetchServices } from "../../api/apiService";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { Service } from "../../types/service";

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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: "" });
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      const response = await fetchServices();
      setServices(response.data);
    } catch (error) {
      setError("Nem sikerült betölteni a szolgáltatásokat");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddService = async () => {
    if (!selectedImage) {
      setErrorModal({ isOpen: true, message: "Kérjük válasszon ki egy képet" });
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("image", selectedImage);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("duration", formData.duration);
      formDataToSend.append("description", formData.description);

      const response = await fetch(
        "http://localhost/project/src/api/admin/add-service.php",
        {
          method: "POST",
          body: formDataToSend,
        }
      );
      const data = await response.json();

      if (data.error) {
        setErrorModal({ isOpen: true, message: data.error });
        return;
      }

      await loadServices();
      setIsAddModalOpen(false);
      setFormData({ name: "", price: "", duration: "", description: "" });
      setSelectedImage(null);
    } catch (error) {
      console.error("Nem sikerült hozzáadni a szolgáltatást:", error);
      setErrorModal({
        isOpen: true,
        message: `Hiba történt a szolgáltatás hozzáadása közben: ${
          error instanceof Error ? error.message : "Ismeretlen hiba"
        }`,
      });
    }
  };

  const handleDeleteService = async (serviceId: number) => {
    try {
      const formData = new FormData();
      formData.append("id", serviceId.toString());

      const response = await fetch(
        "http://localhost/project/src/api/admin/delete-service.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      if (data.error) {
        setErrorModal({ isOpen: true, message: data.error });
        return;
      }

      await loadServices();
    } catch (error) {
      console.error("Nem sikerült törölni a szolgáltatást:", error);
      setErrorModal({
        isOpen: true,
        message: `Hiba történt a szolgáltatás törlése közben: ${
          error instanceof Error ? error.message : "Ismeretlen hiba"
        }`,
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleEditClick = (service: Service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      price: service.price.toString(),
      duration: service.duration.toString(),
      description: service.description || "",
    });
    setIsEditModalOpen(true);
  };

  const handleEditService = async () => {
    if (!selectedService) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("id", selectedService.id.toString());
      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("duration", formData.duration);
      formDataToSend.append("description", formData.description);

      if (selectedImage) {
        formDataToSend.append("image", selectedImage);
      }

      const response = await fetch(
        "http://localhost/project/src/api/admin/edit-service.php",
        {
          method: "POST",
          body: formDataToSend,
        }
      );
      const data = await response.json();

      if (data.error) {
        setErrorModal({ isOpen: true, message: data.error });
        return;
      }

      await loadServices();
      setIsEditModalOpen(false);
      setSelectedService(null);
      setFormData({ name: "", price: "", duration: "", description: "" });
      setSelectedImage(null);
    } catch (error) {
      console.error("Nem sikerült módosítani a szolgáltatást:", error);
      setErrorModal({
        isOpen: true,
        message: `Hiba történt a szolgáltatás módosítása közben: ${
          error instanceof Error ? error.message : "Ismeretlen hiba"
        }`,
      });
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
          Újrapróbálás
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-barber-primary">
      <div className="p-6 max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 text-barber-accent hover:text-barber-accent/80 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Vissza a vezérlőpulthoz
        </button>

        <div className="bg-barber-dark rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-barber-accent">
              Szolgáltatások kezelése
            </h2>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded bg-barber-accent text-white hover:bg-barber-accent/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Új szolgáltatás
            </button>
          </div>

          <div className="overflow-x-auto bg-barber-dark">
            <table className="w-full">
              <thead>
                <tr className="text-left text-barber-light border-b border-barber-secondary/20">
                  <th className="pb-4">Kép</th>
                  <th className="pb-4">Név</th>
                  <th className="pb-4">Ár</th>
                  <th className="pb-4">Időtartam</th>
                  <th className="pb-4">Leírás</th>
                  <th className="pb-4">Műveletek</th>
                </tr>
              </thead>
              <tbody className="bg-barber-dark">
                <AnimatePresence>
                  {services.map((service) => (
                    <motion.tr
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className="text-barber-light border-b border-barber-secondary/10 last:border-0 cursor-default"
                    >
                      <td className="py-3">
                        <img
                          src={`http://localhost/project/src/imgs/${service.image}`}
                          alt={service.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                      </td>
                      <td className="py-3">{service.name}</td>
                      <td className="py-3">{service.price} Ft</td>
                      <td className="py-3">{service.duration} perc</td>
                      <td className="py-3">{service.description}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditClick(service)}
                            className="p-2 rounded bg-barber-accent/10 text-barber-accent hover:bg-barber-accent/20"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmation(service.id)}
                            className="p-2 rounded bg-red-500/10 text-red-500 hover:bg-red-500/20"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Service Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-barber-dark p-6 rounded-lg w-full max-w-md"
            >
              <h3 className="text-xl font-semibold text-barber-accent mb-4">
                Új szolgáltatás hozzáadása
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-barber-light text-sm block mb-1">
                    Kép
                  </label>
                  <div className="flex items-center gap-4">
                    {selectedImage && (
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Preview"
                        className="w-16 h-16 rounded object-cover"
                      />
                    )}
                    <label className="flex items-center gap-2 px-4 py-2 rounded bg-barber-primary text-white cursor-pointer hover:bg-barber-primary/90">
                      <Upload className="w-4 h-4" />
                      Kép kiválasztása
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="text-barber-light text-sm block mb-1">
                    Név
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
                    Ár (Ft)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded bg-barber-primary text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div>
                  <label className="text-barber-light text-sm block mb-1">
                    Időtartam (perc)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded bg-barber-primary text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div>
                  <label className="text-barber-light text-sm block mb-1">
                    Leírás
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded bg-barber-primary text-white resize-none h-24"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded bg-barber-primary text-white"
                  >
                    Mégse
                  </button>
                  <button
                    onClick={handleAddService}
                    className="px-4 py-2 rounded bg-barber-accent text-white"
                  >
                    Hozzáadás
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Service Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-barber-dark p-6 rounded-lg w-full max-w-md"
            >
              <h3 className="text-xl font-semibold text-barber-accent mb-4">
                Szolgáltatás szerkesztése
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-barber-light text-sm block mb-1">
                    Kép
                  </label>
                  <div className="flex items-center gap-4">
                    {selectedImage ? (
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Preview"
                        className="w-16 h-16 rounded object-cover"
                      />
                    ) : (
                      selectedService && (
                        <img
                          src={`http://localhost/project/src/imgs/${selectedService.image}`}
                          alt={selectedService.name}
                          className="w-16 h-16 rounded object-cover"
                        />
                      )
                    )}
                    <label className="flex items-center gap-2 px-4 py-2 rounded bg-barber-primary text-white cursor-pointer hover:bg-barber-primary/90">
                      <Upload className="w-4 h-4" />
                      {selectedImage ? "Kép módosítása" : "Új kép feltöltése"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="text-barber-light text-sm block mb-1">
                    Név
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
                    Ár (Ft)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded bg-barber-primary text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div>
                  <label className="text-barber-light text-sm block mb-1">
                    Időtartam (perc)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded bg-barber-primary text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div>
                  <label className="text-barber-light text-sm block mb-1">
                    Leírás
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded bg-barber-primary text-white resize-none h-24"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setSelectedService(null);
                      setSelectedImage(null);
                      setFormData({
                        name: "",
                        price: "",
                        duration: "",
                        description: "",
                      });
                    }}
                    className="px-4 py-2 rounded bg-barber-primary text-white"
                  >
                    Mégse
                  </button>
                  <button
                    onClick={handleEditService}
                    className="px-4 py-2 rounded bg-barber-accent text-white"
                  >
                    Mentés
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Modal */}
      <AnimatePresence>
        {errorModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-barber-dark p-6 rounded-lg w-full max-w-md"
            >
              <h3 className="text-xl font-semibold text-red-500 mb-4">
                Hiba történt
              </h3>
              <p className="text-barber-light mb-6">{errorModal.message}</p>
              <div className="flex justify-end">
                <button
                  onClick={() => setErrorModal({ isOpen: false, message: "" })}
                  className="px-4 py-2 rounded bg-barber-primary text-white hover:bg-barber-primary/90 transition-colors"
                >
                  Bezárás
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-barber-dark p-6 rounded-lg w-full max-w-md"
            >
              <h3 className="text-xl font-semibold text-barber-accent mb-4">
                Szolgáltatás törlése
              </h3>
              <p className="text-barber-light mb-6">
                Biztosan törölni szeretné ezt a szolgáltatást? Ez a művelet nem
                vonható vissza.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmation(null)}
                  className="px-4 py-2 rounded bg-barber-primary text-white hover:bg-barber-primary/90 transition-colors"
                >
                  Mégse
                </button>
                <button
                  onClick={() => {
                    if (deleteConfirmation) {
                      handleDeleteService(deleteConfirmation);
                      setDeleteConfirmation(null);
                    }
                  }}
                  className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Törlés
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
