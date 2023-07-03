import Input from "antd/es/input/Input";
import { useState } from "react";

const InputModal = ({ onConfirm }: { onConfirm: (val: string) => void }) => {
  const [number, setNumber] = useState("");

  const handleInputConfirm = () => {
    onConfirm(number);
    setNumber("");
  };

  return (
    <div className="w-[200px] h-[300px] bg-slate-300">
      <Input
        type="number"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
      />
      <button onClick={handleInputConfirm}>确定</button>
    </div>
  );
};

export default InputModal;
