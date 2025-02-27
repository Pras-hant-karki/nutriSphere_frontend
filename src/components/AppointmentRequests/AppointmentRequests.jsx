import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../context/UserContext";
import { IoClose } from "react-icons/io5";

const AppointmentRequests = () => {
  const { user } = useContext(UserContext);
  const [appointments, setAppointments] = useState([]);
  const [charges, setCharges] = useState([]);
  const [requestedDate, setRequestedDate] = useState("");
  const [showChargesModal, setShowChargesModal] = useState(false); // State to control modal visibility

  // Fetch charges
  const fetchCharges = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required.");
        return;
      }

      const response = await axios.get("http://localhost:3001/charges", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCharges(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch charges.");
    }
  };

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required.");
        return;
      }

      const response = await axios.get("http://localhost:3001/appointment", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (user) {
        const filteredAppointments =
          user.data[0].role === "admin"
            ? response.data.appointments
            : response.data.appointments.filter(
                (appointment) => appointment.userId === user.data[0].id
              );

        const appointmentWithUserDetails = await Promise.all(
          filteredAppointments.map(async (appointment) => {
            try {
              const userResponse = await axios.get(
                `http://localhost:3001/users/${appointment.userId}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );

              return {
                ...appointment,
                user: userResponse.data.data, // Include user details
              };
            } catch (err) {
              console.error("Failed to fetch user details:", err);
              return { ...appointment, user: null };
            }
          })
        );

        setAppointments(appointmentWithUserDetails);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAppointments();
      fetchCharges();
    }
  }, [user]);

  const handleAppointmentRequest = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required.");
        return;
      }

      const response = await axios.post(
        "http://localhost:3001/appointment",
        { requestedDate },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(response.data.message);
      setRequestedDate("");
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required.");
        return;
      }

      await axios.put(
        `http://localhost:3001/appointment/${appointmentId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Status updated successfully.");
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status.");
    }
  };

  const toggleChargesModal = () => {
    setShowChargesModal(!showChargesModal);
  };

  return (
    <div className="mt-5 mb-16 flex flex-col items-stretch gap-8 md-2:mb-5">
      {/* Button to show charges modal */}
      {user.data[0].role !== "admin" && (
        <div className="flex flex-col items-center">
          <p className="text-gray-700 text-lg font-medium mb-3">
            Want to know about our gym charges? Click below to view the pricing
            details.
          </p>
          <button
            onClick={toggleChargesModal}
            className="bg-purple-lighter rounded-lg text-black font-semibold px-6 py-3 transition duration-300 hover:bg-purple-lighter-hover shadow-md transform hover:scale-105"
          >
            Click to View Gym Charges
          </button>
        </div>
      )}

      {/* Gym Charges Modal */}
      {showChargesModal && (
        <div className="fixed inset-0 bg-[#000000] bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[95%] max-w-[1200px] max-h-[95vh] overflow-y-auto">
            <button
              onClick={toggleChargesModal}
              className="absolute top-2 right-2 text-lg font-bold text-gray-500 z-20"
            >
              <IoClose className="text-4xl text-white" />
            </button>
            {charges.length > 0 ? (
              charges.map((charge) => (
                <div
                  key={charge.id}
                  className="flex flex-col gap-2 p-4 border border-[#E0E0E0] rounded-lg shadow-sm mb-4"
                >
                  <div>
                    <h3 className="font-semibold">{charge.name}</h3>
                  </div>
                  <img
                    src={`http://localhost:3001/uploads/${charge.image}`}
                    alt={charge.name}
                    className="object-cover mb-2"
                  />
                  <p>{charge.description}</p>
                </div>
              ))
            ) : (
              <p>No charges available at the moment.</p>
            )}
          </div>
        </div>
      )}

      {/* Appointment Request Form */}
      {user?.data[0].role !== "admin" && (
        <form
          onSubmit={handleAppointmentRequest}
          className="flex flex-col gap-4"
        >
          <label className="font-medium">Request an Appointment:</label>
          <input
            type="date"
            value={requestedDate}
            onChange={(e) => setRequestedDate(e.target.value)}
            required
            className="border rounded-lg p-2"
          />
          <button
            type="submit"
            className="bg-purple-lighter rounded-lg text-black font-semibold px-4 py-2.5 transition duration-300 hover:bg-purple-lighter-hover"
          >
            Submit Request
          </button>
        </form>
      )}

      {/* Appointment Requests */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-center">
          {user?.data[0].role === "admin"
            ? "All Appointment Requests"
            : "Your Appointment Requests"}
        </h2>
        {appointments.length === 0 ? (
          <p className="text-center text-gray-500">No appointments found.</p>
        ) : (
          appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="border border-[#E0E0E0] shadow-sm rounded-xl p-4 flex justify-between items-center bg-white"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <p className="text-lg text-[#333]">
                    Appointment Request for{" "}
                    <span className="font-semibold">
                      {new Date(appointment.requestedDate).toLocaleDateString()}
                    </span>
                  </p>
                </div>

                {user.data[0].role === "admin" && (
                  <div>
                    <p className="text-sm font-medium text-[#333]">
                      Name:{" "}
                      {appointment.user
                        ? appointment.user.fullname
                        : "Unknown User"}
                    </p>
                    <p className="text-sm font-medium text-[#333]">
                      Email :{" "}
                      {appointment.user ? appointment.user.email : "No Email"}
                    </p>
                    <p className="text-sm font-medium text-[#333]">
                      Phone Number:{" "}
                      {appointment.user
                        ? appointment.user.phoneNumber
                        : "No Phone Number"}
                    </p>
                  </div>
                )}
              </div>

              {user?.data[0].role === "admin" ? (
                <select
                  value={appointment.status}
                  onChange={(e) =>
                    handleStatusUpdate(appointment.id, e.target.value)
                  }
                  className="border p-1 rounded-lg"
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              ) : (
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    appointment.status === "pending"
                      ? "bg-[#FFF4C2] text-[#A67C00]"
                      : appointment.status === "accepted"
                      ? "bg-[#D4F4DD] text-[#2E7D32]"
                      : "bg-[#FFCDD2] text-[#C62828]"
                  }`}
                >
                  {appointment.status.charAt(0).toUpperCase() +
                    appointment.status.slice(1)}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AppointmentRequests;
