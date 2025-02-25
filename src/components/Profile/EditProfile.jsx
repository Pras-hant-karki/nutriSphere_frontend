import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";

const EditProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [initialValues, setInitialValues] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFullname(user?.data[0].fullname);
      setUsername(user?.data[0].username);
      setBio(user?.data[0].bio || "");
      setEmail(user?.data[0].email);
      setPhoneNumber(user?.data[0].phoneNumber || "");
      setInitialValues({
        fullname: user?.data[0].fullname,
        username: user?.data[0].username,
        bio: user?.data[0].bio || "",
        email: user?.data[0].email,
        phoneNumber: user?.data[0].phoneNumber || "",
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.put(
        `http://localhost:3001/users/edit-profile`,
        {
          fullname,
          username,
          bio,
          email,
          phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const updatedUser = response.data;
      setUser(updatedUser);
      setSuccess(true);
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleReset = () => {
    setFullname(initialValues.fullname);
    setUsername(initialValues.username);
    setBio(initialValues.bio);
    setEmail(initialValues.email);
    setPhoneNumber(initialValues.phoneNumber);
    setError("");
  };

  return (
    <form
      onSubmit={handleProfileUpdate}
      className="my-6 grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-x-4 md:gap-y-6 md-2:grid-cols-1 lg:grid-cols-2"
    >
      {error && (
        <div className="text-pale-red md:col-span-2 md-2:col-span-1 lg:col-span-2">
          {error}
        </div>
      )}

      {success && ( // Show success message when success is true
        <div className="text-pale-green md:col-span-2 md-2:col-span-1 lg:col-span-2">
          Profile updated successfully!
        </div>
      )}

      <div className="flex flex-col items-baseline gap-2">
        <label htmlFor="fullname" className="font-medium">
          Full Name
        </label>
        <input
          type="text"
          id="fullname"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          className="w-full p-4 outline-none font-medium bg-white dark:bg-black text-black dark:text-white border border-black dark:border-white placeholder:text-dark-slate text-sm vsm:text-base"
        />
      </div>

      <div className="flex flex-col items-baseline gap-2">
        <label htmlFor="username" className="font-medium">
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-4 outline-none font-medium bg-white dark:bg-black text-black dark:text-white border border-black dark:border-white placeholder:text-dark-slate text-sm vsm:text-base"
        />
      </div>

      <div className="flex flex-col gap-2 md:col-span-2 md-2:col-span-1 lg:col-span-2">
        <label htmlFor="bio" className="font-medium">
          Bio
        </label>
        <input
          type="text"
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-4 outline-none font-medium bg-white dark:bg-black text-black dark:text-white border border-black dark:border-white placeholder:text-dark-slate text-sm vsm:text-base"
        />
      </div>

      <div className="flex flex-col items-baseline gap-2">
        <label htmlFor="email" className="font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 outline-none font-medium bg-white dark:bg-black text-black dark:text-white border border-black dark:border-white placeholder:text-dark-slate text-sm vsm:text-base"
        />
      </div>

      <div className="flex flex-col items-baseline gap-2">
        <label htmlFor="phoneNumber" className="font-medium">
          Phone Number
        </label>
        <input
          type="text"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full p-4 outline-none font-medium bg-white dark:bg-black text-black dark:text-white border border-black dark:border-white placeholder:text-dark-slate text-sm vsm:text-base"
        />
      </div>

      <div className="flex items-center justify-between md:col-span-2 md-2:col-span-1 lg:col-span-2">
        <button
          type="reset"
          className="w-fit mt-4 bg-dark-slate text-white font-semibold text-sm px-4 py-2 rounded-[2px] vsm:text-base md:mt-8"
          onClick={handleReset}
        >
          Reset
        </button>

        <button
          type="submit"
          className="w-fit mt-4 bg-black dark:bg-purple-lighter text-white dark:text-black font-semibold text-sm px-4 py-2 rounded-[2px] vsm:text-base md:mt-8"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default EditProfile;
