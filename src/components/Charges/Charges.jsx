import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Charges = () => {
  const [charges, setCharges] = useState([]);
  const [newCharge, setNewCharge] = useState({ name: "", image: null });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editChargeId, setEditChargeId] = useState(null);
  const [editChargeName, setEditChargeName] = useState("");
  const [editChargeImage, setEditChargeImage] = useState(null);

  // Fetch charges data from the backend
  const fetchCharges = async () => {
    try {
      const response = await axios.get("http://localhost:3001/charges");
      setCharges(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch charges");
    }
  };

  // Handle charge upload
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!newCharge.name || !newCharge.image) {
      toast.error("Name and Image are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", newCharge.name);
    formData.append("profilePicture", newCharge.image);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3001/charges",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message);
      setNewCharge({ name: "", image: null });
      fetchCharges();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload charge");
    }
  };

  // Handle charge update (Admin only)
  const handleUpdate = async (id, updatedName, updatedImage) => {
    const formData = new FormData();
    formData.append("name", updatedName);
    if (updatedImage) {
      formData.append("profilePicture", updatedImage);
    }

    try {
      const response = await axios.put(
        `http://localhost:3001/charges/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success(response.data.message);
      fetchCharges();
      setIsEditModalOpen(false); // Close modal after update
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update charge");
    }
  };
  // Handle charge deletion (Admin only)
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/charges/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success(response.data.message);
      fetchCharges();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete charge");
    }
  };

  // Handle opening edit modal
  const openEditModal = (id, name, image) => {
    setEditChargeId(id);
    setEditChargeName(name);
    setEditChargeImage(null); // Reset image preview
    setIsEditModalOpen(true);
  };

  // Handle closing edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditChargeName("");
    setEditChargeImage(null);
  };

  useEffect(() => {
    fetchCharges();
  }, []);

  console.log(charges);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold text-center mb-8">Charges</h1>

      <form
        onSubmit={handleUpload}
        className="mb-8 p-6 bg-[#f5f5f5] rounded-lg shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Upload New Charge</h2>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Charge Name
          </label>
          <input
            type="text"
            id="name"
            value={newCharge.name}
            onChange={(e) =>
              setNewCharge({ ...newCharge, name: e.target.value })
            }
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Image
          </label>
          <input
            type="file"
            id="image"
            onChange={(e) =>
              setNewCharge({ ...newCharge, image: e.target.files[0] })
            }
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-lighter text-white px-4 py-2.5 rounded-md"
        >
          Upload Charge
        </button>
      </form>

      {/* Charges List */}
      {charges && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {charges.map((charge) => (
            <div
              key={charge.id}
              className="p-4 border rounded-lg shadow-lg bg-white"
            >
              <img
                // Correcting the image path
                src={`http://localhost:3001/uploads/${charge.image}`}
                alt={charge.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">{charge.name}</h3>

              <div className="w-full flex-wrap flex justify-between gap-2">
                <button
                  onClick={() => openEditModal(charge.id, charge.name)}
                  className="w-full bg-purple-lighter text-white px-4 py-2 rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(charge.id)}
                  className="w-full bg-pale-red text-white px-4 py-2 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Charge</h2>
            <div className="mb-4">
              <label
                htmlFor="editChargeName"
                className="block text-sm font-medium text-gray-700"
              >
                Charge Name
              </label>
              <input
                type="text"
                id="editChargeName"
                value={editChargeName}
                onChange={(e) => setEditChargeName(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="editChargeImage"
                className="block text-sm font-medium text-gray-700"
              >
                Change Image
              </label>
              <input
                type="file"
                id="editChargeImage"
                onChange={(e) => setEditChargeImage(e.target.files[0])}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="flex justify-between gap-2">
              <button
                onClick={() =>
                  handleUpdate(editChargeId, editChargeName, editChargeImage)
                }
                className="w-full bg-purple-lighter text-white px-4 py-2 rounded-md"
              >
                Save Changes
              </button>
              <button
                onClick={closeEditModal}
                className="w-full bg-gray-300 text-black px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Charges;
