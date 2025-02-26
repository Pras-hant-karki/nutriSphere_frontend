const Button = ({ btnName, activeButton, handleButtonClick }) => {
  return (
    <button
      className={`${
        activeButton === btnName ? "text-black  bg-dark-slate-85 " : "bg-none"
      } font-semibold text-sm px-2 py-1 rounded-[2px] vsm:px-4 vsm:text-base vsm:min-w-[90px]`}
      onClick={() => handleButtonClick(btnName)}
    >
      {btnName}
    </button>
  );
};

export default Button;
