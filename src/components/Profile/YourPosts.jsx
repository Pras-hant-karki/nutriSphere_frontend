import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { BsTrash } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import UpdatePostModal from "../modal/UpdatePostModal";

const YourPosts = () => {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const userId = user?.data[0]?.id;

  useEffect(() => {
    axios
      .get("http://localhost:3001/posts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setPosts(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Filter posts by the currently logged-in user
  const filteredPosts = posts.filter((post) => post.user.id === userId);

  const handleEditClick = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (post) => {
    setSelectedPost(post);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedPost(null);
  };

  const handleConfirmDelete = () => {
    axios
      .delete(`http://localhost:3001/posts/${selectedPost.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        console.log("Post deleted successfully!");
        setPosts(posts.filter((post) => post.id !== selectedPost.id));
        handleCloseDeleteModal();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="mt-5 mb-16 flex flex-col gap-6 md:mb-5">
      {filteredPosts.length === 0 ? (
        <p className="font-medium text-center text-lg">
          You haven't added any <span className="text-purple-500">posts</span>{" "}
          yet.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md relative"
            >
              {post.postCover && (
                <img
                  src={`http://localhost:3001/uploads/${post.postCover}`}
                  alt="Post Cover"
                  className="w-full h-48 object-cover rounded-md"
                />
              )}
              <h3 className="mt-3 text-lg font-semibold">{post.topic}</h3>

              <div className="absolute top-3 right-3 flex gap-2">
                <button onClick={() => handleEditClick(post)}>
                  <FaEdit className="w-6 h-6 text-white transition duration-300 hover:text-purple-lighter" />
                </button>

                <button onClick={() => handleDeleteClick(post)}>
                  <BsTrash className="w-6 h-6 text-white transition duration-300 hover:text-purple-lighter" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && selectedPost && (
        <UpdatePostModal closeModal={handleCloseModal} post={selectedPost} />
      )}

      {isDeleteModalOpen && selectedPost && (
        <div className="bg-[#000000cb] text-white fixed top-0 left-0 z-50 w-full h-full flex flex-col items-center justify-center">
          <div className="modal relative w-full max-w-2xl overflow-auto">
            <div className="relative py-10 mx-5 bg-black-75 p-4 rounded-xl shadow dark:bg-gray-700">
              <button className="absolute top-3 right-4">
                <IoClose
                  onClick={handleCloseDeleteModal}
                  className="w-7 h-7 text-white transition duration-300 hover:text-red"
                />
              </button>

              <p className="text-2xl font-medium text-center mb-4">
                Delete Post
              </p>

              <p className="text-sm text-center">
                Are you sure you want to delete this post?
              </p>

              <div className="flex justify-center gap-6 mt-6">
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-lg bg-purple-lighter text-black text-base font-medium transition duration-300 hover:bg-purple-lighter-hover"
                >
                  Confirm Delete
                </button>

                <button
                  onClick={handleCloseDeleteModal}
                  className="px-4 py-2 rounded-lg bg-gray-500 text-white text-base font-medium transition duration-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YourPosts;
