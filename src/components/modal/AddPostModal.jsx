import axios from "axios";
import React, { useContext, useRef, useState } from "react";
import { HiDocumentText, HiUser } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { RxUpload } from "react-icons/rx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../context/UserContext";
import TextFieldWithLabel from "../Login-Signup/TextFieldWithLabel";

const AddPostModal = ({ closeModal }) => {
  const { setUser, isLoading, setIsLoading } = useContext(UserContext);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [postCover, setPostCover] = useState(null);

  const handleTopicChange = (e) => setTopic(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  const handlePostCoverChange = (e) => {
    setPostCover(e.target.files[0]);
    setSelectedFileName(e.target.files[0].name);
  };

  const handleAddPost = async (e) => {
    e.preventDefault();

    if (!topic.trim() || !description.trim() || !postCover) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    try {
      let filename = null;
      if (postCover) {
        const formData = new FormData();
        formData.append("profilePicture", postCover);

        const response = await axios.post(
          "http://localhost:3001/posts/uploadPostCover",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        filename = response.data.filename;
      }

      await axios.post(
        "http://localhost:3001/posts",
        {
          topic,
          description: description.trim(),
          postCover: filename,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Post added successfully!"); // Success toast
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add post."); // Error toast
    } finally {
      setIsLoading(false);
      setTopic("");
      setDescription("");
      setPostCover(null);
    }
  };

  const inputRef = useRef(null);
  const handleDivClick = () => inputRef.current.click();
  const handleReset = () => {
    setTopic("");
    setDescription("");
    setPostCover(null);
  };

  return (
    <div className="bg-[#000000cb] text-black  fixed top-0 left-0 z-50 w-full h-full flex flex-col items-center justify-center">
      <div className="modal relative w-full max-w-2xl overflow-auto">
        <div className="relative my-10 mx-5 bg-light-bg -75 p-4 rounded-xl shadow ">
          <button className="absolute top-3 right-4">
            <IoClose onClick={closeModal} className="w-7 h-7 text-black " />
          </button>

          <form className="my-6 flex flex-col gap-4">
            <div className="w-full flex flex-col items-baseline gap-2">
              <label className="font-medium">Post Cover</label>
              <div
                onClick={handleDivClick}
                className="relative cursor-pointer bg-purple-lighter w-full h-28 md:h-full"
              >
                <div className="w-full h-full flex items-center justify-center gap-2 bg-[#ffffff70] p-4 ">
                  {selectedFileName ? (
                    <p>{selectedFileName}</p>
                  ) : (
                    <>
                      <label>
                        <RxUpload className="cursor-pointer text-2xl text-black " />
                      </label>
                      <p className="font-medium">Choose post cover</p>
                    </>
                  )}

                  <input
                    ref={inputRef}
                    type="file"
                    id="image"
                    name="postCover"
                    className="w-6 h-6 invisible absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    onChange={handlePostCoverChange}
                  />
                </div>
              </div>
            </div>

            <div>
              <TextFieldWithLabel
                label="Topic"
                type="text"
                placeholder="Enter post topic"
                icon={HiUser}
                onChange={handleTopicChange}
              />
            </div>

            <div>
              <TextFieldWithLabel
                label="Description"
                type="textarea"
                placeholder="Enter post description"
                icon={HiDocumentText}
                onChange={handleDescriptionChange}
              />
            </div>

            <div className="flex items-center justify-between md:col-span-2">
              <button
                type="button"
                className="w-fit mt-4 bg-black  text-white text-sm px-4 py-2 rounded-[2px]"
                onClick={handleReset}
              >
                Reset
              </button>

              <button
                type="submit"
                className="w-fit mt-4 bg-purple-lighter text-black font-semibold text-sm px-4 py-2 rounded-[2px]"
                onClick={handleAddPost}
              >
                Add Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPostModal;
