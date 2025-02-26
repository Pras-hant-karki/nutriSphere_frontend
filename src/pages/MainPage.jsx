import axios from "axios";
import React, { useState } from "react";
import HomepageBody from "../components/Homepage/HomepageBody";
import ProfileBody from "../components/Profile/ProfileBody";
import SearchBody from "../components/SearchPage/SearchBody";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import { ToastContainer } from "react-toastify";
import AddPostModal from "../components/modal/AddPostModal";
import WorkoutRequests from "../components/WorkoutRequests/WorkoutRequests";
import AppointmentRequests from "../components/AppointmentRequests/AppointmentRequests";
import PostDetails from "../components/Homepage/PostDetails";

const MainPage = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    setSelectedPost(null);
    localStorage.setItem("activeTab", tabName);
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setActiveTab("postDetails");
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const fetchUserInfo = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ); // Replace with your API endpoint for fetching user information
      if (response.status === 200) {
        const userData = response.data;
        setUserInfo(userData);
      } else {
        console.error("Failed to fetch user information");
      }
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  };

  const tabConfig = {
    home: {
      header: "All Posts",
      pageInfo: "View all posts",
      body: (
        <HomepageBody
          handlePostClick={handlePostClick}
          userInfo={userInfo}
          fetchUserInfo={fetchUserInfo}
        />
      ),
    },
    search: {
      header: "Search Posts",
      pageInfo: "Search for posts",
      body: (
        <SearchBody
          handlePostClick={handlePostClick}
          userInfo={userInfo}
          fetchUserInfo={fetchUserInfo}
        />
      ),
    },
    appointmentRequests: {
      header: "Appointment Requests",
      pageInfo: "View your appointment requests",
      body: <AppointmentRequests />,
    },
    workoutRequests: {
      header: "Workout Requests",
      pageInfo: "View your workout requests",
      body: <WorkoutRequests />,
    },
    profile: {
      header: "Profile",
      pageInfo: "View your profile",
      body: <ProfileBody userInfo={userInfo} fetchUserInfo={fetchUserInfo} />,
    },
    postDetails: {
      header: "Post Details",
      pageInfo: "View post details",
      body: (
        <PostDetails
          post={selectedPost}
          userInfo={userInfo}
          fetchUserInfo={fetchUserInfo}
        />
      ),
    },
  };

  const { header, pageInfo, body } = tabConfig[activeTab];

  return (
    <div className="flex w-full min-h-[100vh] bg-light-bg ">
      <Sidebar activeTab={activeTab} handleTabClick={handleTabClick} />

      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-col justify-between text-black  p-6 w-full md-2:ml-[280px] md-2:flex-1 md-2:relative md-2:px-6 md-2:py-0 lg:px-10">
        <div>
          <Header
            currentPage={header}
            pageInfo={pageInfo}
            handleTabClick={handleTabClick}
            openModal={openModal}
          />

          {body}
        </div>
      </div>

      {isModalOpen && (
        <AddPostModal closeModal={closeModal} openModal={openModal} />
      )}
    </div>
  );
};

export default MainPage;
