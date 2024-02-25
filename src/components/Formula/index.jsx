import {
  ChevronDown,
  ChevronRight,
  Info,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { useState } from "react";
import CustomInput from "./CustomInput";
import useStore from "../../utils/store";

const Formula = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { value, setValue } = useStore();

  const openHandler = () => {
    setIsOpen(!isOpen);
  };

  const date = new Date();

  const options = { month: "short" };

  const monthName = date.toLocaleString("en-US", options);
  const currentYear = monthName + " " + date.getFullYear();

  return (
    <div className="container mx-auto mt-10 rounded-md border border-slate-200 text-slate-900">
      <div className="flex items-center justify-between bg-slate-200 p-3">
        <div className="flex items-center gap-1">
          {isOpen ? (
            <ChevronDown
              className="cursor-pointer text-slate-600 hover:text-slate-900"
              onClick={openHandler}
            />
          ) : (
            <ChevronRight
              className="cursor-pointer text-slate-600 hover:text-slate-900"
              onClick={openHandler}
            />
          )}
          <p className="text-xs">New Formula</p>
        </div>
        <div className="flex gap-1">
          <Info className="cursor-pointer text-slate-600 hover:text-slate-900" />
          <MoreHorizontal className="cursor-pointer text-slate-600 hover:text-slate-900" />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between bg-slate-100 px-4 py-2">
          <p className="text-2xl">
            ${value ? Number(value)?.toFixed(2) : Number("0")?.toFixed(2)}
          </p>
          <p className="rounded-md bg-slate-200 p-1 text-xs">{currentYear}</p>
        </div>
        {isOpen ? (
          <div className="flex flex-col gap-2 p-3">
            <CustomInput />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Formula;
