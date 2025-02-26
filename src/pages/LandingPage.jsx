import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/images/nutrilogo.png";
import PrimaryButton from "../components/common/PrimaryButton";

const LandingPage = () => {
  return (
    <div className="bg-container bg-light-bg bg-no-repeat h-[100vh] flex justify-center sm:bg-contain sm:bg-right sm:h-auto sm:min-h-[100vh]">
      <div className="w-full flex flex-col items-center sm:flex-row-reverse">
        <div className="max-w-[60%] flex-1 flex items-center justify-center">
          <img src={Logo} alt="" />
        </div>

        <div className="absolute min-h-[40vh] flex flex-col gap-6 justify-center bottom-0 bg-white z-20 text-black py-8 px-6 sm:static sm:w-[50%] sm:gap-8 sm:bg-[transparent] md:w-[45%] md:px-[5%]">
          <div className="flex flex-col gap-2">
            <h2 className="text-[36px] font-bold leading-[46px] ">
              Transform Your Body, Elevate Your Strength
            </h2>

            <p className="">
              Join our gym community and start your fitness journey today.
              Expert trainers, state-of-the-art equipment, and a motivating
              environment to push your limits.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Link to="/signin">
              <PrimaryButton btnLabel="Get Started" />
            </Link>

            <Link to="/signup">
              <button className="font-semibold py-2 px-5 sm:px-8 w-full">
                Create new account
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
