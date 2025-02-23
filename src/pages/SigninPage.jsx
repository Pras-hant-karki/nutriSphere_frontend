import axios from "axios";
import React, { useContext, useState } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import { Link } from "react-router-dom";
import AuthCard from "../components/Login-Signup/AuthCard";
import PasswordFieldWithLabel from "../components/Login-Signup/PasswordFieldWithLabel";
import TextFieldWithLabel from "../components/Login-Signup/TextFieldWithLabel";
import PrimaryButton from "../components/common/PrimaryButton";
import { UserContext } from "../context/UserContext";
import Logo from "../assets/images/nutrilogo.png";

const SigninPage = () => {
  const { user, setUser, isLoading, setIsLoading } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignin = (e) => {
    e.preventDefault();

    // Perform form validation
    if (username.trim() === "") {
      setError("Username is required");
      return;
    }

    if (password.trim() === "") {
      setError("Password is required");
      return;
    }

    setIsLoading(true); // Set isLoading to true before making the API call

    axios
      .post("http://localhost:3001/users/login", { username, password })
      .then((response) => {
        console.log(response);
        localStorage.setItem("token", response.data.token);
        // Assuming the user data is returned in the response
        const user = response.data.user;
        setUser(user);
        setIsLoading(false); // Set isLoading to false after the API call is completed
        window.location.href = "/";
      })
      .catch((err) => {
        setError(err.response.data.error);
        setIsLoading(false); // Set isLoading to false after the API call is completed
      });
  };

  return (
    <div className="bg-container bg-contain bg-no-repeat min-h-[100vh] flex bg-light-bg dark:bg-dark-bg">
      <div className="w-full flex flex-col items-center sm:flex-row-reverse">
        <div className="max-w-[60%] flex-1 flex items-center justify-center">
          <img src={Logo} alt="" />
        </div>

        <AuthCard>
          <Link to="/">
            <button className="border dark:border-white p-1 rounded-[3px] sm:hidden">
              <FaAngleLeft className="text-xl text-black dark:text-white" />
            </button>
          </Link>

          <div className="w-full flex flex-col gap-8">
            <div>
              <h1 className="font-bold text-2xl dark:text-white">Sign In</h1>

              <p className="text-dark-slate font-medium">
                Enter your account details to sign in!
              </p>
            </div>

            <form className="flex flex-col gap-4">
              {error && <span className="text-pale-red">{error}</span>}

              <TextFieldWithLabel
                label="Username"
                type="username"
                placeholder="Enter your username"
                icon={HiMail}
                onChange={handleUsernameChange}
              />

              <PasswordFieldWithLabel
                label="Password"
                placeholder="Enter your password"
                onChange={handlePasswordChange}
              />

              <PrimaryButton
                btnLabel="Sign In"
                onClick={handleSignin}
                isLoading={isLoading}
              />
            </form>

            <div className="hidden sm:flex flex-col items-center gap-1 lg:flex-row lg:gap-2 2xl:mt-8">
              <p className="dark:text-white">You don’t have an account?</p>
              <Link to="/signup" className="font-bold dark:text-white">
                Create an account
              </Link>
            </div>
          </div>
        </AuthCard>
      </div>
    </div>
  );
};

export default SigninPage;
