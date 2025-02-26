import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";

const HomepageBody = ({ handlePostClick }) => {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/posts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => setPosts(response.data.data))
      .catch((error) => console.log(error));
  }, []);

  console.log(posts);

  return (
    <div className="mt-5 mb-16 flex flex-col gap-6 md:mb-5">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {posts.length === 0 ? (
          <div className="col-span-full text-center">
            <p className="font-medium text-gray-500">
              No <span className="text-purple-500">posts</span> available. 😟
            </p>
          </div>
        ) : (
          posts.map((post, index) => (
            <div
              key={index}
              className="bg-white cursor-pointer  p-2 rounded-lg shadow-md"
              onClick={() => {
                handlePostClick(post);
              }}
            >
              {post.postCover && (
                <img
                  src={`http://localhost:3001/uploads/${post.postCover}`}
                  alt="Post Cover"
                  className="w-full h-48 object-cover rounded-md"
                />
              )}
              <h3 className="mt-3 text-lg font-semibold">{post.topic}</h3>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomepageBody;
