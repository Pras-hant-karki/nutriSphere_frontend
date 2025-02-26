import axios from "axios";
import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import SearchIllustration from "../../assets/images/search.webp";

const SearchBody = ({ handlePostClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = (event) => {
    event.preventDefault();

    if (searchQuery.trim() === "") {
      // Empty search query, clear the results
      setSearchResults([]);
      setSearchPerformed(false);
      return;
    }

    axios
      .get(`http://localhost:3001/posts/search?query=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          setSearchResults(response.data.data);
          setSearchPerformed(true);
        } else {
          setSearchResults([]);
          setSearchPerformed(true);
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <form
      className="mt-5 mb-16 flex flex-col gap-8 md-2:mb-5"
      onSubmit={handleSearch}
    >
      <div className="bg-dark-slate-85 -75 flex items-center justify-between gap-2 px-4 py-2 rounded-full vsm:gap-4">
        <input
          type="text"
          placeholder="Search posts"
          className="w-full bg-dark-slate-85 -75 outline-none placeholder:font-light"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <button className="focus:outline-none" onClick={handleSearch}>
          <FiSearch className="w-5 h-5" />
        </button>
      </div>

      {searchPerformed ? (
        searchResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <img
              src={SearchIllustration}
              alt="Search Illustration"
              className="w-[70vw] max-w-[300px]"
            />
            <p className="font-medium md-2:text-lg">No search results found.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {searchResults.map((post, index) => (
              <div
                key={index}
                className="bg-white cursor-pointer  p-2 rounded-lg shadow-md"
                onClick={() => handlePostClick(post)}
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
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center gap-4">
          <img
            src={SearchIllustration}
            alt="Search Illustration"
            className="w-[70vw] max-w-[300px]"
          />
          <p className="font-medium md-2:text-lg">
            Your <span className="text-purple-lighter">searches</span> will
            appear here.
          </p>
        </div>
      )}
    </form>
  );
};

export default SearchBody;
