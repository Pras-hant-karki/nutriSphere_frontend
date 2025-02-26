import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../context/UserContext";

const AppointmentRequests = () => {
  const { user } = useContext(UserContext);
  const [appointments, setAppointments] = useState([]);
  const [requestedDate, setRequestedDate] = useState("");

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

      // Admins see all appointments, users see only their own
      if (user) {
        const filteredAppointments =
          user.data[0].role === "admin"
            ? response.data.appointments
            : response.data.appointments.filter(
                (appointment) => appointment.userId === user.data[0].id
              );

        setAppointments(filteredAppointments);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  // Handle appointment request submission
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

  // Handle status update (only for admins)
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

  return (
    <div className="mt-5 mb-16 flex flex-col items-stretch gap-8 md-2:mb-5">
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
            className="bg-purple-lighter rounded-lg text-black font-semibold px-4 py-1.5 transition duration-300 hover:bg-purple-lighter-hover"
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
              <span className="text-[#333] font-medium">
                {new Date(appointment.requestedDate).toLocaleDateString()}
              </span>
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
