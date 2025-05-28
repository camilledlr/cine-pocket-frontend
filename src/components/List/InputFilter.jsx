import React from "react";
import { TfiClose } from "react-icons/tfi";
import "./InputFilter.css";


const InputFilter = ({labelText, placeholderText, inputValue, setInputValue}) => {
  return (
    <>
      <label>
        {labelText} :
        <div className="input-with-icon">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholderText}
          />
          {inputValue && (
            <TfiClose
              className="clear-icon"
              onClick={() => setInputValue("")}
            />
          )}
        </div>
      </label>
    </>
  );
};

export default InputFilter;
