import React from "react";

interface cardProps {
  className?: string;
  color: string;
  icon: string;
  title: string;
  subtitle: string;
}
export default function Card(props: cardProps) {
  return (
    <div
      data-aos="fade-in"
      data-aos-duration="1000"
      className={props.className}
    >
      <div className="h-[379px] w-[308px] drop-shadow-md rounded-3xl bg-white">
        <div className="flex items-center h-full w-full px-5 py-10">
          <div className="flex flex-col justify-between h-full items-center">
            <div
              className={`border h-[121px] w-[121px] flex justify-center items-center rounded-xl ${props.color}`}
            >
              <img src={props.icon} />
            </div>
            <div className="title text-[24px] text-center w-4/5">
              {props.title}
            </div>
            <div className="pt-5 text-center">{props.subtitle}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
