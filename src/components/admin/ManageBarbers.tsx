import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash, Upload, ArrowLeft } from "lucide-react";
import { fetchBarbers, updateBarber } from "../../api/apiService";
import { Barber } from "../../types/barber";
import { useNavigate } from "react-router-dom";

export function ManageBarbers() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    experience: "",
    specialization: "",
    details: "",
    startTime: "",
    endTime: "",
  });
  const navigate = useNavigate();
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    barberId: number | null;
  }>({ isOpen: false, barberId: null });
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    message: string;
  }>({ isOpen: false, message: "" });

  useEffect(() => {
    loadBarbers();
  }, []);

  const loadBarbers = async () => {
    try {
      setIsLoading(true);
      const response = await fetchBarbers();
      const activeBarbers = response.data.filter(
        (barber: Barber) => barber.Aktiv === 1
      );
      setBarbers(activeBarbers);
    } catch (error) {
      setError("Failed to load barbers");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleEditBarber = (barber: Barber) => {
    setSelectedBarber(barber);
    setFormData({
      email: barber.email || "",
      experience: barber.evtapasztalat || "",
      specialization: barber.specializacio || "",
      details: barber.reszletek || "",
      startTime: barber.KezdesIdo || "",
      endTime: barber.BefejezesIdo || "",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateBarber = async () => {
    if (!selectedBarber) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("id", selectedBarber.id.toString());
      if (selectedImage) {
        formDataToSend.append("image", selectedImage);
      }
      formDataToSend.append("email", formData.email);
      formDataToSend.append("experience", formData.experience);
      formDataToSend.append("specialization", formData.specialization);
      formDataToSend.append("details", formData.details);
      formDataToSend.append("startTime", formData.startTime);
      formDataToSend.append("endTime", formData.endTime);
      formDataToSend.append("token", localStorage.getItem("userToken") || "");

      await updateBarber(selectedBarber.id, formDataToSend);
      await loadBarbers();
      setIsEditModalOpen(false);
      setSelectedBarber(null);
      setSelectedImage(null);
    } catch (error) {
      console.error("Failed to update barber:", error);
    }
  };

  const handleAddBarber = async () => {
    if (!selectedImage) {
      setErrorModal({ isOpen: true, message: "Kérjük válasszon ki egy képet" });
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("image", selectedImage);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("experience", formData.experience);
      formDataToSend.append("specialization", formData.specialization);
      formDataToSend.append("details", formData.details);
      formDataToSend.append("startTime", formData.startTime);
      formDataToSend.append("endTime", formData.endTime);

      const response = await fetch(
        "http://localhost/project/src/api/admin/add-barber.php",
        {
          method: "POST",
          body: formDataToSend,
        }
      );
      const data = await response.json();

      if (data.error) {
        setErrorModal({
          isOpen: true,
          message: `${data.error}`,
        });
        return;
      }

      // Várjunk egy kicsit, hogy a fájl biztosan felkerüljön a szerverre
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Frissítsük a listát
      await loadBarbers();

      setIsAddModalOpen(false);
      setFormData({
        email: "",
        experience: "",
        specialization: "",
        details: "",
        startTime: "",
        endTime: "",
      });
      setSelectedImage(null);
    } catch (error) {
      console.error("Failed to add barber:", error);
      setErrorModal({
        isOpen: true,
        message: `Hiba történt a barber hozzáadása közben: ${
          error instanceof Error ? error.message : "Ismeretlen hiba"
        }`,
      });
    }
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setFormData({
      email: "",
      experience: "",
      specialization: "",
      details: "",
      startTime: "",
      endTime: "",
    });
    setSelectedImage(null);
  };

  const handleDeleteBarber = async (barberId: number) => {
    setDeleteConfirmation({ isOpen: true, barberId });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation.barberId) return;

    try {
      const formData = new FormData();
      formData.append("id", deleteConfirmation.barberId.toString());

      const response = await fetch(
        "http://localhost/project/src/api/admin/delete-barber.php",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          body: formData,
        }
      );
      const data = await response.json();

      if (data.error) {
        setErrorModal({ isOpen: true, message: `${data.error}` });
        return;
      }

      await loadBarbers();
      setDeleteConfirmation({ isOpen: false, barberId: null });
    } catch (error) {
      console.error("Failed to delete barber:", error);
      setErrorModal({
        isOpen: true,
        message: `Hiba történt a borbély törlése közben: ${
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
          onClick={loadBarbers}
          className="ml-2 text-barber-accent hover:text-barber-accent/80"
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
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 text-barber-accent hover:text-barber-accent/80 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Vissza az irányítópultra
        </button>

        <div className="bg-barber-dark rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-barber-accent">
              Barberek kezelése
            </h2>
            <button
              onClick={() => {
                setFormData({
                  email: "",
                  experience: "",
                  specialization: "",
                  details: "",
                  startTime: "",
                  endTime: "",
                });
                setSelectedImage(null);
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded bg-barber-accent text-white hover:bg-barber-accent/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Barber hozzáadása
            </button>
          </div>

          <div className="overflow-x-auto bg-barber-dark">
            <table className="w-full">
              <thead>
                <tr className="text-left text-barber-light border-b border-barber-secondary/20">
                  <th className="pb-4">Kép</th>
                  <th className="pb-4">Név</th>
                  <th className="pb-4">Tapasztalat</th>
                  <th className="pb-4">Specializáció</th>
                  <th className="pb-4">Munkaidő</th>
                  <th className="pb-4">Műveletek</th>
                </tr>
              </thead>
              <tbody className="bg-barber-dark">
                {barbers.map((barber) => (
                  <tr
                    key={barber.id}
                    className="text-barber-light border-b border-barber-secondary/20 last:border-0"
                  >
                    <td className="py-3">
                      <img
                        src={`http://localhost/project/src/imgs/${barber.kep}`}
                        alt={`${barber.nev}`}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </td>
                    <td className="py-3">{barber.nev}</td>
                    <td className="py-3">{barber.evtapasztalat} év</td>
                    <td className="py-3">{barber.specializacio}</td>
                    <td className="py-3">
                      {barber.KezdesIdo} - {barber.BefejezesIdo}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditBarber(barber)}
                          className="p-2 rounded bg-barber-accent/10 text-barber-accent hover:bg-barber-accent/20"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBarber(barber.id)}
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

          {/* Add Barber Modal */}
          {isAddModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-barber-dark p-6 rounded-lg w-full max-w-md">
                <h3 className="text-xl font-semibold text-barber-accent mb-4">
                  Új barber hozzáadása
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
                          className="w-16 h-16 rounded-full object-cover"
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
                      Email cím
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded bg-barber-primary text-white"
                      placeholder="Regisztrált felhasználó email címe"
                    />
                  </div>
                  <div>
                    <label className="text-barber-light text-sm block mb-1">
                      Tapasztalat (év)
                    </label>
                    <input
                      type="number"
                      value={formData.experience}
                      onChange={(e) =>
                        setFormData({ ...formData, experience: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded bg-barber-primary text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <div>
                    <label className="text-barber-light text-sm block mb-1">
                      Specializáció
                    </label>
                    <input
                      type="text"
                      value={formData.specialization}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specialization: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded bg-barber-primary text-white"
                    />
                  </div>
                  <div>
                    <label className="text-barber-light text-sm block mb-1">
                      Részletek
                    </label>
                    <textarea
                      value={formData.details}
                      onChange={(e) =>
                        setFormData({ ...formData, details: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded bg-barber-primary text-white resize-none h-24"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-barber-light text-sm block mb-1">
                        Kezdes Idő
                      </label>
                      <input
                        type="text"
                        pattern="[0-9]*"
                        maxLength={2}
                        min="0"
                        max="24"
                        value={formData.startTime}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (parseInt(value) <= 24 || value === "") {
                            setFormData({
                              ...formData,
                              startTime: value,
                            });
                          }
                        }}
                        className="w-full px-3 py-2 rounded bg-barber-primary text-white"
                        placeholder="8"
                      />
                    </div>
                    <div>
                      <label className="text-barber-light text-sm block mb-1">
                        Befejezes Idő
                      </label>
                      <input
                        type="text"
                        pattern="[0-9]*"
                        maxLength={2}
                        min="0"
                        max="24"
                        value={formData.endTime}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (parseInt(value) <= 24 || value === "") {
                            setFormData({
                              ...formData,
                              endTime: value,
                            });
                          }
                        }}
                        className="w-full px-3 py-2 rounded bg-barber-primary text-white"
                        placeholder="16"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={handleCloseAddModal}
                      className="px-4 py-2 rounded bg-barber-primary text-white"
                    >
                      Mégse
                    </button>
                    <button
                      onClick={handleAddBarber}
                      className="px-4 py-2 rounded bg-barber-accent text-white"
                    >
                      Barber hozzáadása
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Barber Modal */}
          {isEditModalOpen && selectedBarber && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-barber-dark p-6 rounded-lg w-full max-w-md">
                <h3 className="text-xl font-semibold text-barber-accent mb-4">
                  Barber szerkesztése
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
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <img
                          src={`http://localhost/project/src/imgs/${selectedBarber.kep}`}
                          alt={selectedBarber.nev}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      )}
                      <label className="flex items-center gap-2 px-4 py-2 rounded bg-barber-primary text-white cursor-pointer hover:bg-barber-primary/90">
                        <Upload className="w-4 h-4" />
                        Új kép kiválasztása
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-barber-light text-sm block mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded bg-barber-primary text-white"
                      />
                    </div>
                    <div>
                      <label className="text-barber-light text-sm block mb-1">
                        Tapasztalat (év)
                      </label>
                      <input
                        type="number"
                        value={formData.experience}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            experience: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded bg-barber-primary text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-barber-light text-sm block mb-1">
                      Specializáció
                    </label>
                    <input
                      type="text"
                      value={formData.specialization}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specialization: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded bg-barber-primary text-white"
                    />
                  </div>
                  <div>
                    <label className="text-barber-light text-sm block mb-1">
                      Részletek
                    </label>
                    <textarea
                      value={formData.details}
                      onChange={(e) =>
                        setFormData({ ...formData, details: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded bg-barber-primary text-white resize-none h-24"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-barber-light text-sm block mb-1">
                        Kezdes Idő
                      </label>
                      <input
                        type="text"
                        pattern="[0-9]*"
                        maxLength={2}
                        min="0"
                        max="24"
                        value={formData.startTime}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (parseInt(value) <= 24 || value === "") {
                            setFormData({
                              ...formData,
                              startTime: value,
                            });
                          }
                        }}
                        className="w-full px-3 py-2 rounded bg-barber-primary text-white"
                        placeholder="8"
                      />
                    </div>
                    <div>
                      <label className="text-barber-light text-sm block mb-1">
                        Befejezes Idő
                      </label>
                      <input
                        type="text"
                        pattern="[0-9]*"
                        maxLength={2}
                        min="0"
                        max="24"
                        value={formData.endTime}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (parseInt(value) <= 24 || value === "") {
                            setFormData({
                              ...formData,
                              endTime: value,
                            });
                          }
                        }}
                        className="w-full px-3 py-2 rounded bg-barber-primary text-white"
                        placeholder="16"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => {
                        setIsEditModalOpen(false);
                        setSelectedBarber(null);
                        setSelectedImage(null);
                      }}
                      className="px-4 py-2 rounded bg-barber-primary text-white"
                    >
                      Mégse
                    </button>
                    <button
                      onClick={handleUpdateBarber}
                      className="px-4 py-2 rounded bg-barber-accent text-white"
                    >
                      Barber szerkesztése
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deleteConfirmation.isOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-barber-dark p-6 rounded-lg w-full max-w-md">
                <h3 className="text-xl font-semibold text-barber-accent mb-4">
                  Barber törlése
                </h3>
                <p className="text-barber-light mb-6">
                  Biztosan törölni szeretné ezt a barbert? Ez a művelet nem
                  vonható vissza.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() =>
                      setDeleteConfirmation({ isOpen: false, barberId: null })
                    }
                    className="px-4 py-2 rounded bg-barber-primary text-white hover:bg-barber-primary/90 transition-colors"
                  >
                    Mégse
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    Törlés
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error Modal */}
          {errorModal.isOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-barber-dark p-6 rounded-lg w-full max-w-md">
                <h3 className="text-xl font-semibold text-red-500 mb-4">
                  Hiba történt
                </h3>
                <p className="text-barber-light mb-6">{errorModal.message}</p>
                <div className="flex justify-end">
                  <button
                    onClick={() =>
                      setErrorModal({ isOpen: false, message: "" })
                    }
                    className="px-4 py-2 rounded bg-barber-primary text-white hover:bg-barber-primary/90 transition-colors"
                  >
                    Bezárás
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
