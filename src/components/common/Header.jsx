import React, { useContext, useState } from "react";
import { BsFillSunFill, BsMoonFill } from "react-icons/bs";
import { IoAddCircleSharp } from "react-icons/io5";
import { UserContext } from "../../context/UserContext";

const Header = (props) => {
  const { user, setUser } = useContext(UserContext);
  const [theme, setTheme] = useState("light");

  const handleThemeChange = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark");
  };

  const handleAddPostClick = () => {
    props.openModal();
  };

  return (
    <header className="relative flex justify-between md:py-4 md:items-center md:after:bg-black md:after:dark:bg-white md:after:h-[1px] md:after:w-[100vw] md:after:absolute md:after:-left-10 md:after:bottom-0">
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
          {/* <button className="relative text-black dark:text-white hover:text-purple-lighter hover:dark:text-purple-lighter transition duration-200 ease-linear">
            <FaBell className="w-[18px] h-[18px]" />
            <div className="bg-light-bg dark:bg-dark-bg p-0.5 rounded-full absolute -top-1.5 -right-1.5">
              <div className="bg-pale-green w-2.5 h-2.5 rounded-full"></div>
            </div>
          </button> */}

          <button
            className="text-black flex items-center gap-1.5 bg-purple-lighter px-4 py-1.5 border border-black font-semibold transition duration-200 ease-linear hover:bg-purple-lighter-hover"
            onClick={handleAddPostClick}
          >
            <IoAddCircleSharp className="w-5 h-5" />
            <p className="font-bold">Add Post</p>
          </button>

          <div className="flex border border-black">
            <button
              className={`p-2 ${
                theme === "light" ? "bg-purple-lighter" : "dark:bg-dark-bg"
              } text-black dark:text-white`}
              onClick={handleThemeChange}
              data-testid="theme-sun-button"
            >
              <BsFillSunFill className="w-3.5 h-3.5" />
            </button>
            <button
              className={`p-2 ${
                theme === "light" ? "bg-light-bg" : "bg-purple-lighter"
              } text-black dark:text-white`}
              onClick={handleThemeChange}
              data-testid="theme-moon-button"
            >
              <BsMoonFill className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="md:hidden flex gap-4 items-center">
          <button
            className="text-black text-sm flex items-center gap-0.5 bg-purple-lighter px-2 py-1.5 border border-black font-semibold transition duration-200 ease-linear hover:bg-purple-lighter-hover"
            onClick={handleAddPostClick}
          >
            <IoAddCircleSharp className="w-4 h-4" />
            <p className="font-bold">Add Post</p>
          </button>

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
