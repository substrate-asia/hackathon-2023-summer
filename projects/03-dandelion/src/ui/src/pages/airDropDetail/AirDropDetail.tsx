import { useParams } from "react-router-dom";
import { Button, Progress } from "antd";
import { useNavigate } from "react-router-dom";
import { AIR_DROP_LIST } from "../../assets";

export default function AirDropDetail() {
  let { id } = useParams();
  const navigate = useNavigate();
  const idNumber = id ? Number(id) : null;
  const airdrop = AIR_DROP_LIST.find((item) => item.id === idNumber)!;
  const desc = airdrop.desc.replace(/\\n/g, "\n");
  const clickBack = () => {
    navigate("/list");
  };

  return (
    <>
      <div className=" flex flex-row  items-center px-10 pt-5 text-grey">
        <span className="ml-2 text-grey cursor-pointer" onClick={clickBack}>
          {"< 返回空投列表页"}
        </span>
      </div>
      <div className="flex flex-row h-screen py-10 px-10">
        <div className="w-[400px] flex flex-col items-center ">
          <img
            src={airdrop.logo}
            alt="logo"
            className="w-[140px] h-[140px] mb-3"
          />
          <span className="text-[28px] text-white">{airdrop.name}</span>
          <AirDropProgress/>
          <div className="flex flex-col mt-2">
            <StakeButton/>
            <GainButton/>
            <UnstakeButton/>
            <TipButton/>
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          <div className="text-[24px] font-semibold mb-4">{airdrop.title}</div>
          <div className="leading-[1.5rem] max-w-[1000px] whitespace-pre-line">
            {desc}
          </div>
          <div className="text-[24px] font-semibold mb-4 mt-6 ">空投规则</div>
          <ul className="list-none">
            {airdrop.rules.map((rule: string, index) => {
              return (
                <li key={index} className="leading-[2rem]">
                  {index + 1}) {rule}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

function AirDropProgress() {
  return (
    <Progress
      percent={50}
      size={["80%", 18]}
      trailColor="#fff"
      className="text-center mt-5"
    />
  )
}

function StakeButton() {
  return (
    <Btn text='质押'/>
  );
}

function GainButton() {
  return (
    <Btn text='Claim'/>
  );
}

function UnstakeButton() {
  return (
    <Btn text='解押'/>
  );
}

function TipButton() {
  return (
    <Btn text='打赏'/>
  );
}

function Btn({text, disabled}: {
  text: string
  disabled?: boolean
}) {
  return (
    <Button className="my-3 bg-blue rounded-full w-[120px] h-[40px]" disabled={disabled}>
      {text}
    </Button>
  );
}
