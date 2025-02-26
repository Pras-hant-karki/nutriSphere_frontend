import axios from "axios";
import React, { useContext, useRef, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { UserContext } from "../../context/UserContext";

const UserInfo = () => {
  const { user, setUser } = useContext(UserContext);
  const [profilePicture, setProfilePicture] = useState(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleProfilePictureChange = (e) => {
    setProfilePicture(e.target.files[0]);
    setError(null); // Reset the error message when selecting a new profile picture
  };

  const openFileInput = () => {
    fileInputRef.current.click();
  };

  const uploadProfilePicture = async () => {
    if (!profilePicture) {
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", profilePicture);

    try {
      const response = await axios.post(
        "http://localhost:3001/users/uploadImage",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { data } = response.data;

      // Update the user's profile picture in the user context
      setUser((prevUser) => ({
        ...prevUser,
        image: data,
      }));

      setIsImageUploaded(true);

      window.location.reload();
    } catch (error) {
      console.log(error);
      setError("Failed to upload profile picture.");
    }
  };

  const handleLogout = () => {
    // Clear the user authentication token from local storage
    localStorage.removeItem("token");

    // Navigate the user to the login page
    window.location.href = "/";
  };

  return (
    <div className="text-black dark:text-dark-slate-85 flex flex-col items-center text-center gap-4 xl:w-[30%] md-2:items-stretch md-2:text-start">
      <div className="relative w-fit">
        <img
          src={
            user?.data[0].image
              ? `http://localhost:3001/uploads/${user?.data[0].image}`
              : "https://st3.depositphotos.com/9998432/13335/v/600/depositphotos_133352156-stock-illustration-default-placeholder-profile-icon.jpg"
          }
          alt=""
          className="w-[100px] h-[100px] rounded-full object-fill"
        />

        <div
          className="absolute flex items-center justify-center cursor-pointer right-0 bottom-0 text-black bg-purple-lighter hover:bg-purple-lighter-hover w-8 h-8 rounded-full hover:bg-purple hover:text-black-75 transition duration-200"
          onClick={openFileInput}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleProfilePictureChange}
            className="invisible relative z-40 w-full h-full"
          />

          <FaEdit className="absolute w-[50%] h-[50%]" />
        </div>
      </div>

      {error && <p className="text-pale-red mt-2">{error}</p>}

      {profilePicture && !isImageUploaded && (
        <div className="w-full flex justify-center mt-2">
          <button
            className="self-center text-black dark:text-white flex items-center gap-1.5 px-4 py-1.5 border border-purple-lighter transition duration-200 ease-linear hover:bg-purple-lighter-hover hover:text-black md-2:self-start"
            onClick={uploadProfilePicture}
          >
            <p className="font-semibold">Upload Picture</p>
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <p className="text-xl font-semibold">
          {user?.data[0].fullname} {user.data[0].role === "admin" && "(Admin)"}
        </p>
        <p className="text-sm font-light">{user?.data[0].email}</p>
      </div>

      <div className="flex flex-col gap-4">
        <button
          className="self-center text-black dark:text-white flex items-center gap-1.5 px-4 py-1.5 border border-purple-lighter transition duration-200 ease-linear hover:bg-purple-lighter-hover hover:text-black md-2:self-start"
          onClick={handleLogout}
        >
          <FiLogOut className="w-5 h-5" />
          <p className="font-semibold">Log Out</p>
        </button>
      </div>
    </div>
  );
};

export default UserInfo;
