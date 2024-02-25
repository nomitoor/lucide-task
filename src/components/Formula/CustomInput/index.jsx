import { useEffect, useState } from "react";
import { completionList } from "../../../utils/autoCompleteList";
import useStore from "../../../utils/store";

const CustomInput = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [isFunction, setIsFunction] = useState(false);
  const [result, setResult] = useState("");
  const { setValue } = useStore();

  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = completionList.filter((option) =>
      option.displayLabel.toLowerCase().includes(term.toLowerCase()),
    );
    setFilteredOptions(filtered);
    setOptionsVisible(true);
  };

  const handleOptionSelect = (option) => {
    let disp = option.displayLabel;

    if (option.type === "function") {
      disp = option.displayLabel + "()";
      setIsFunction(true);
    }

    setSearchTerm(disp);
    setOptionsVisible(false);
  };

  const handleOutsideClick = () => {
    setOptionsVisible(false);
  };

  const implementFunction = (val) => {
    const operators = ["+", "-", "*", "/"];
    const regex = new RegExp(`[${operators.map((op) => "\\" + op).join("")}]`);

    const tokens = val.split(regex).map((token) => parseFloat(token.trim()));
    const ops = val.split("").filter((char) => operators.includes(char));

    if (ops.length === 0) {
      setResult(parseFloat(val));
      return;
    }

    let result = tokens[0];
    for (let i = 0; i < ops.length; i++) {
      const operator = ops[i];
      const nextOperand = tokens[i + 1];

      if (isNaN(nextOperand)) {
        setResult("Invalid input");
        return;
      }

      switch (operator) {
        case "+":
          result += nextOperand;
          break;
        case "-":
          result -= nextOperand;
          break;
        case "*":
          result *= nextOperand;
          break;
        case "/":
          if (nextOperand === 0) {
            setResult("Cannot divide by zero");
            return;
          }
          result /= nextOperand;
          break;
        default:
          setResult("Invalid input");
          return;
      }
    }

    setResult(result);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (isFunction) {
        const regex = /\(([^)]+)\)/;
        const match = regex.exec(searchTerm);
        if (match) {
          const valueInsideParentheses = match[1];
          implementFunction(valueInsideParentheses);
        } else {
          console.log("No value inside parentheses found.");
        }
      }
    }
  };

  useEffect(() => {
    setValue(result);
  }, [result]);

  return (
    <div className="relative" onClick={handleOutsideClick}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search..."
        className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blue-400 focus:outline-none"
      />
      {optionsVisible && filteredOptions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => handleOptionSelect(option)}
              className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-100"
            >
              <span>{option.displayLabel}</span>
              <span className="text-sm text-gray-500">{option.type}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomInput;
