import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the Toastify styles
import { UserContext } from "../../context/UserContext";

const WorkoutRequests = () => {
  const { user, setUser } = useContext(UserContext);
  const [workoutRequests, setWorkoutRequests] = useState([]);
  const [newRequest, setNewRequest] = useState({
    height: "",
    weight: "",
    age: "",
    goal: "",
  });

  // Fetch user workout requests
  const fetchAcceptedRequests = async () => {
    try {
      const endpoint =
        user?.data[0]?.role === "admin"
          ? "http://localhost:3001/workout-requests/getAllRequests"
          : "http://localhost:3001/workout-requests/";

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setWorkoutRequests(response.data);
    } catch (error) {
      toast.error("Error fetching workout requests.");
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequest((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission to create a new workout request
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/workout-requests/",
        newRequest,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchAcceptedRequests(); // Re-fetch requests after submission
      setNewRequest({
        height: "",
        weight: "",
        age: "",
        goal: "",
      });
      toast.success("Workout request submitted successfully!");
    } catch (error) {
      toast.error("Error submitting workout request.");
    }
  };

  // Update workout plan for admin
  const handleUpdateWorkoutPlan = async (requestId, workoutPlan) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/workout-requests/${requestId}/respond`, // Updated endpoint
        { workoutPlan }, // Pass workout plan as part of the request body
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add the token for authentication
          },
        }
      );
      fetchAcceptedRequests(); // Re-fetch requests after update
      toast.success("Workout plan updated successfully!");
    } catch (error) {
      toast.error("Error updating workout plan.");
    }
  };

  // Fetch user requests when component mounts
  useEffect(() => {
    fetchAcceptedRequests();
  }, []);

  return (
    <div className="mt-5 mb-16 flex flex-col items-stretch gap-4 md-2:mb-5">
      {/* Form for creating a new workout request */}
      {user.data[0].role !== "admin" && (
        <>
          <h2 className="font-semibold text-xl mb-4">
            Submit a Workout Request
          </h2>
          <form onSubmit={handleSubmit} className="w-full mb-8">
            <div className="w-full flex flex-col gap-4">
              <input
                type="number"
                name="height"
                value={newRequest.height}
                onChange={handleInputChange}
                placeholder="Height (cm)"
                className="p-2 border rounded-lg shadow-sm"
                required
              />
              <input
                type="number"
                name="weight"
                value={newRequest.weight}
                onChange={handleInputChange}
                placeholder="Weight (kg)"
                className="p-2 border rounded-lg shadow-sm"
                required
              />
              <input
                type="number"
                name="age"
                value={newRequest.age}
                onChange={handleInputChange}
                placeholder="Age"
                className="p-2 border rounded-lg shadow-sm"
                required
              />
              <input
                type="text"
                name="goal"
                value={newRequest.goal}
                onChange={handleInputChange}
                placeholder="Fitness Goal"
                className="p-2 border rounded-lg shadow-sm"
                required
              />
              <button
                type="submit"
                className="bg-purple-lighter hover:bg-purple-lighter-hover text-white p-2 rounded-lg mt-3 hover:bg-purple-700"
              >
                Submit Request
              </button>
            </div>
          </form>
        </>
      )}

      {/* Displaying user's workout requests */}
      <h2 className="font-semibold text-xl mb-4">Your Workout Requests</h2>
      {workoutRequests.length === 0 ? (
        <div className="text-center">
          <p className="font-medium text-lg text-gray-500">
            No Workout Requests yet 🙁
          </p>
        </div>
      ) : (
        workoutRequests.map((request, index) => (
          <div
            key={request.id}
            className="bg-white p-6 rounded-lg shadow-md mb-6"
          >
            <h3 className="font-semibold text-xl text-purple-600">
              Request #{index + 1}
            </h3>
            <div className="space-y-2 mt-4">
              <p>
                <strong>Height:</strong> {request.height} cm
              </p>
              <p>
                <strong>Weight:</strong> {request.weight} kg
              </p>
              <p>
                <strong>Age:</strong> {request.age}
              </p>
              <p>
                <strong>Goal:</strong> {request.goal}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    request.status === "pending"
                      ? "bg-[#FFF4C2] text-[#A67C00]"
                      : "bg-[#D4F4DD] text-[#2E7D32]"
                  }`}
                >
                  {request.status}
                </span>
              </p>
              <p>
                <strong>Workout Plan:</strong>{" "}
                {request.workoutPlan ? (
                  <span className="text-green-600">{request.workoutPlan}</span>
                ) : (
                  <span className="text-red-600">
                    Pending Response from Admin
                  </span>
                )}
              </p>

              {user?.data[0]?.role === "admin" && (
                <div className="mt-4">
                  <textarea
                    id={`workout-plan-${request.id}`}
                    placeholder="Enter workout plan"
                    className="w-full p-2 border outline-none rounded-lg shadow-sm"
                    rows={4}
                    defaultValue={request.workoutPlan || ""} // Add the default value of the existing workout plan if available
                  />
                  <button
                    onClick={() =>
                      handleUpdateWorkoutPlan(
                        request.id,
                        document.querySelector(`#workout-plan-${request.id}`)
                          .value
                      )
                    }
                    className="mt-1 bg-purple-lighter hover:bg-purple-lighter-hover text-white p-2 rounded-lg"
                  >
                    Update Workout Plan
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default WorkoutRequests;
