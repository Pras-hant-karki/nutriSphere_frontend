import React, { useContext, useState } from "react";
import { BsFillSunFill, BsMoonFill } from "react-icons/bs";
import { IoAddCircleSharp } from "react-icons/io5";
import { UserContext } from "../../context/UserContext";

const Header = (props) => {
  const { user, setUser } = useContext(UserContext);

  const handleAddPostClick = () => {
    props.openModal();
  };

  return (
    <header className="relative flex justify-between md:py-4 md:items-center md:after:bg-black  md:after:h-[1px] md:after:w-[100vw] md:after:absolute md:after:-left-10 md:after:bottom-0">
      <div className="flex flex-col">
        <p className="text-purple-lighter font-medium md-2:hidden">
          {props.pageInfo}
        </p>
        <h2 className="leading-tight text-2xl font-bold lg:text-3xl">
          {props.currentPage}
        </h2>
      </div>

      <div>
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {user.data[0].role === "admin" && (
            <button
              className="text-black text-sm flex items-center gap-0.5 bg-purple-lighter px-2 py-1.5 border border-black font-semibold transition duration-200 ease-linear hover:bg-purple-lighter-hover"
              onClick={handleAddPostClick}
            >
              <IoAddCircleSharp className="w-4 h-4" />
              <p className="font-bold">Add Post</p>
            </button>
          )}
        </div>

        <div className="md:hidden flex gap-4 items-center">
          {user.data[0].role === "admin" && (
            <button
              className="text-black text-sm flex items-center gap-0.5 bg-purple-lighter px-2 py-1.5 border border-black font-semibold transition duration-200 ease-linear hover:bg-purple-lighter-hover"
              onClick={handleAddPostClick}
            >
              <IoAddCircleSharp className="w-4 h-4" />
              <p className="font-bold">Add Post</p>
            </button>
          )}

          <div
            className="cursor-pointer border border-black rounded-full md:hidden"
            onClick={() => props.handleTabClick("profile")}
          >
            <img
              src={`http://localhost:3001/uploads/${user?.data[0].image}`}
              alt=""
              className="w-10 h-10 rounded-full object-fill"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
