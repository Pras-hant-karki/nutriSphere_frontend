import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { HiDocumentText } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { UserContext } from "../../context/UserContext";
import TextFieldWithLabel from "../Login-Signup/TextFieldWithLabel";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdatePostModal = ({ post, closeModal }) => {
  const { setUser, isLoading, setIsLoading } = useContext(UserContext);
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (post.id) {
      axios
        .get(`http://localhost:3001/posts/${post.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          const { topic, description } = response.data.data[0];
          setTopic(topic);
          setDescription(description);
        })
        .catch((error) => {
          toast.error("Failed to fetch post details.");
        });
    }
  }, [post.id]);

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleUpdatePost = (e) => {
    e.preventDefault();

    setIsLoading(true);

    axios
      .put(
        `http://localhost:3001/posts/${post.id}`,
        {
          topic,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        toast.success("Post updated successfully.");
        closeModal();
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to update post.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleReset = () => {
    setTopic("");
    setDescription("");
  };

  return (
    <div className="bg-[#000000cb] text-black  fixed top-0 left-0 z-50 w-full h-full flex flex-col items-center justify-center">
      <div className="modal relative w-full max-w-2xl overflow-auto">
        <div className="relative my-10 mx-5 bg-light-bg -75 p-4 rounded-xl shadow ">
          <button className="absolute top-3 right-4">
            <IoClose onClick={closeModal} className="w-7 h-7 text-black " />
          </button>

          <form className="my-6 flex flex-col gap-4">
            <TextFieldWithLabel
              label="Post Topic"
              type="text"
              placeholder="Enter post topic"
              icon={HiDocumentText}
              value={topic}
              onChange={handleTopicChange}
            />

            <TextFieldWithLabel
              label="Description"
              type="textarea"
              placeholder="Enter post description"
              icon={HiDocumentText}
              value={description}
              onChange={handleDescriptionChange}
            />

            <div className="flex items-center justify-between md:col-span-2">
              <button
                type="button"
                className="w-fit mt-4 bg-black  text-white text-sm px-4 py-2 rounded-[2px] vsm:text-base md:mt-8"
                onClick={handleReset}
              >
                Reset
              </button>

              <button
                type="submit"
                className="w-fit mt-4 bg-purple-lighter text-black font-semibold text-sm px-4 py-2 rounded-[2px] vsm:text-base md:mt-8"
                onClick={handleUpdatePost}
              >
                Update Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePostModal;
