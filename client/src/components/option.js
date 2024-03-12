import { useState } from "react";
export const Option = ({ options, no, save, answer }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const handleRadioChange = (option) => {
    setSelectedOption(option);
    // Reset the selectedOption to null after the selection is made
    setSelectedOption(null);
  };
  return (
    <div style={{ marginTop: "3rem" }}>
      {options.map((option, index) => {
        const isOptionSelected =
          selectedOption === option ||
          (answer.findIndex((item) => item.id === no) >= 0 &&
            answer[answer.findIndex((item) => item.id === no)].answer ===
              option);
        return (
          <span key={index} style={{ marginTop: "2rem" }}>
            <input
              type="radio"
              name={no}
              value={option}
              checked={isOptionSelected}
              onClick={(event) => {
                handleRadioChange();
                save(event);
              }}
            />
            {option}
            <br />
          </span>
        );
      })}
    </div>
  );
};
