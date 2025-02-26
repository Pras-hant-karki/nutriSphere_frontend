import React, { useEffect, useState } from "react";
import { IoTime } from "react-icons/io5";
import { getTimeDifference } from "../../utils/dateUtils";

const PostDetails = ({ userInfo, fetchUserInfo, post, openModal }) => {
  const { topic, description, user } = post;
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user.id) {
      fetchUserInfo(user.id);
    }
  }, [fetchUserInfo, user.id]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  console.log(post.description);

  return (
    <div className="mt-5 mb-16 flex flex-col gap-6 md:flex-row md:gap-8 md-2:mb-5">
      <div className="flex flex-col gap-4 md:items-start">
        <div className="w-full flex flex-col gap-2 items-start justify-start">
          <div className="w-full">
            <img
              src={`http://localhost:3001/uploads/${post.postCover}`}
              alt=""
              className="rounded-lg max-h-[400px] w-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex gap-1 items-center">
                <IoTime className="w-4 h-4" />

                <p className="text-sm text-black dark:text-dark-slate-85 font-light">
                  Posted {getTimeDifference(post.date)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-semibold">{topic}</h2>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {description
            .split("\n")
            .filter((para) => para.trim() !== "")
            .map((para, index) => (
              <p key={index}>{para}</p>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
