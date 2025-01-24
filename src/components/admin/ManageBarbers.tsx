import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash, Upload } from "lucide-react";
import {
  fetchBarbers,
  addBarber,
  deleteBarber,
  updateBarber,
} from "../../api/apiService";
import { Barber } from "../../types/barber";

export function ManageBarbers() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    experience: "",
    specialization: "",
    details: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    loadBarbers();
  }, []);

  const loadBarbers = async () => {
    try {
      setIsLoading(true);
      const response = await fetchBarbers();
      setBarbers(response.data);
      console.log(response.data);
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
      firstName: barber.Keresztnev || "",
      lastName: barber.Vezeteknev || "",
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
      if (selectedImage) {
        formDataToSend.append("image", selectedImage);
      }
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("experience", formData.experience);
      formDataToSend.append("specialization", formData.specialization);
      formDataToSend.append("details", formData.details);
      formDataToSend.append("startTime", formData.startTime);
      formDataToSend.append("endTime", formData.endTime);

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
      alert("Please select an image");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("image", selectedImage);
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("experience", formData.experience);
      formDataToSend.append("specialization", formData.specialization);
      formDataToSend.append("details", formData.details);
      formDataToSend.append("startTime", formData.startTime);
      formDataToSend.append("endTime", formData.endTime);

      await addBarber(formDataToSend);
      await loadBarbers();
      setIsAddModalOpen(false);
      setFormData({
        firstName: "",
        lastName: "",
        experience: "",
        specialization: "",
        details: "",
        startTime: "",
        endTime: "",
      });
      setSelectedImage(null);
    } catch (error) {
      console.error("Failed to add barber:", error);
    }
  };

  const handleDeleteBarber = async (barberId: number) => {
    if (window.confirm("Are you sure you want to delete this barber?")) {
      try {
        await deleteBarber(barberId);
        await loadBarbers();
      } catch (error) {
        console.error("Failed to delete barber:", error);
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
      <div className="bg-barber-dark rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-barber-accent">
            Manage Barbers
          </h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded bg-barber-accent text-white hover:bg-barber-accent/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Barber
          </button>
        </div>

        <div className="overflow-x-auto bg-barber-dark">
          <table className="w-full">
            <thead>
              <tr className="text-left text-barber-light border-b border-barber-secondary/20">
                <th className="pb-4">Image</th>
                <th className="pb-4">Name</th>
                <th className="pb-4">Experience</th>
                <th className="pb-4">Specialization</th>
                <th className="pb-4">Working Hours</th>
                <th className="pb-4">Actions</th>
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
                Add New Barber
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-barber-light text-sm block mb-1">
                    Profile Image
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
                      Choose Image
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
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded bg-barber-primary text-white"
                    />
                  </div>
                  <div>
                    <label className="text-barber-light text-sm block mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded bg-barber-primary text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-barber-light text-sm block mb-1">
                    Experience (years)
                  </label>
                  <input
                    type="number"
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({ ...formData, experience: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded bg-barber-primary text-white"
                  />
                </div>
                <div>
                  <label className="text-barber-light text-sm block mb-1">
                    Specialization
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
                    Details
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
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) =>
                        setFormData({ ...formData, startTime: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded bg-barber-primary text-white"
                    />
                  </div>
                  <div>
                    <label className="text-barber-light text-sm block mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) =>
                        setFormData({ ...formData, endTime: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded bg-barber-primary text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded bg-barber-primary text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddBarber}
                    className="px-4 py-2 rounded bg-barber-accent text-white"
                  >
                    Add Barber
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
                Edit Barber
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-barber-light text-sm block mb-1">
                    Profile Image
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
                      Choose New Image
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
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded bg-barber-primary text-white"
                    />
                  </div>
                  <div>
                    <label className="text-barber-light text-sm block mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded bg-barber-primary text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-barber-light text-sm block mb-1">
                    Experience (years)
                  </label>
                  <input
                    type="number"
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({ ...formData, experience: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded bg-barber-primary text-white"
                  />
                </div>
                <div>
                  <label className="text-barber-light text-sm block mb-1">
                    Specialization
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
                    Details
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
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) =>
                        setFormData({ ...formData, startTime: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded bg-barber-primary text-white"
                    />
                  </div>
                  <div>
                    <label className="text-barber-light text-sm block mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) =>
                        setFormData({ ...formData, endTime: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded bg-barber-primary text-white"
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
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateBarber}
                    className="px-4 py-2 rounded bg-barber-accent text-white"
                  >
                    Update Barber
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
