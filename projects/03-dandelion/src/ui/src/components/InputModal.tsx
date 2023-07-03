import { Modal } from "antd";
import Input from "antd/es/input/Input";
import { useState } from "react";
import "./InputModal.css";
const InputModal = ({
  title = "请输入数量",
  onConfirm,
  visible = false,
  onCancel,
}: {
  title?: string;
  visible?: boolean;
  onConfirm?: (val: string) => void;
  onCancel?: () => void;
}) => {
  const [number, setNumber] = useState("");
  const handleInputConfirm = () => {
    onConfirm && onConfirm(number);
    setNumber("");
  };

  return (
    <Modal
      title={title}
      open={visible}
      bodyStyle={{}}
      onOk={handleInputConfirm}
      onCancel={onCancel}
      centered
      okText="确定"
      cancelText="取消"
      // FIX: tailwind与ant的样式冲突
      cancelButtonProps={{
        styles: {
          icon: {
            color: "rgba(0,0,0, 0.88)",
          },
        },
        className: "modal-cancel-button",
      }}
      okButtonProps={{
        style: {
          background: "#4096ff",
        },
      }}
    >
      <Input
        type="number"
        value={number}
        className="w-[70%] "
        onChange={(e) => setNumber(e.target.value)}
      />
    </Modal>
  );
};

export default InputModal;
