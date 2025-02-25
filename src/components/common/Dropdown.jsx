import { useEffect, useRef, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

const Dropdown = ({
  dropdownList,
  dropdownLabel,
  dropdownPlaceholder,
  selectedValue,
  onDropdownChange,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [dropdownRef]);

  const handleToggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setShowOptions(false);
    onDropdownChange(option);
  };

  useEffect(() => {
    if (selectedValue) {
      const initialSelectedOption = dropdownList.find(
        (option) => option.title === selectedValue
      );
      setSelectedOption(initialSelectedOption);
    }
  }, [dropdownList, selectedValue]);

  return (
    <div className="relative md:col-span-2" ref={dropdownRef}>
      <div className="flex flex-col gap-2">
        <label className="font-medium text-black dark:text-white">
          {dropdownLabel}
        </label>

        <button
          type="button"
          className="w-full p-4 text-black bg-light-bg dark:bg-black flex items-center justify-between gap-2 border dark:border-white dark:text-white transition-all duration-200 ease-linear hover:border-purple-lighter focus:border-purple-lighter"
          id="options-menu"
          data-testid="options-menu"
          aria-haspopup="true"
          aria-expanded={showOptions}
          onClick={handleToggleOptions}
        >
          {selectedOption ? selectedOption.title : dropdownPlaceholder}

          {showOptions ? (
            <FaAngleUp className="text-xl dark:text-white" />
          ) : (
            <FaAngleDown className="text-xl dark:text-white" />
          )}
        </button>
      </div>

      {showOptions && (
        <div
          className="dropdown-options w-full absolute z-10 right-0 mt-2 shadow-lg bg-white dark:bg-black max-h-40 overflow-y-scroll"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="w-full">
            {dropdownList.map((option) => (
              <button
                key={option.title}
                onClick={() => handleOptionSelect(option)}
                className="w-full flex items-center p-4 bg-white dark:bg-black dark:text-white text-sm font-medium hover:bg-[#f5f2f2] dark:hover:bg-[#0e0e0e] focus:outline-none"
                role="menuitem"
              >
                {option.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
