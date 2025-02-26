import React, { useContext, useState } from "react";
import Button from "./Button";
import ChangePassword from "./ChangePassword";
import EditProfile from "./EditProfile";
import UserInfo from "./UserInfo";
import { UserContext } from "../../context/UserContext";
import YourPosts from "./YourPosts";

const ProfileBody = () => {
  const { user } = useContext(UserContext);
  const [activeButton, setActiveButton] = useState(
    user.data[0].role === "admin" ? "Your Posts" : "Edit Profile"
  );

  const handleButtonClick = (btnName) => {
    setActiveButton(btnName);
  };

  const formComponent =
    activeButton === "Your Posts" ? (
      <YourPosts />
    ) : activeButton === "Edit Profile" ? (
      <EditProfile />
    ) : activeButton === "Change Password" ? (
      <ChangePassword />
    ) : null;

  return (
    <div className="mt-5 mb-16 flex flex-col gap-8 xl:flex-row">
      <UserInfo />

      <div className="w-full flex flex-col gap-6 xl:w-[70%]">
        <div className="flex flex-wrap gap-2 vsm:gap-4">
          {user.data[0].role === "admin" && (
            <Button
              btnName="Your Posts"
              activeButton={activeButton}
              handleButtonClick={handleButtonClick}
            />
          )}
          <Button
            btnName="Edit Profile"
            activeButton={activeButton}
            handleButtonClick={handleButtonClick}
          />
        </div>

        {formComponent}
      </div>
    </div>
  );
};

export default ProfileBody;
