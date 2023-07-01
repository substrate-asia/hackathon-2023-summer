import React from "react";

import type { AirDrop } from "../../constants";

function AirDropListCard({
  airDropList,
  title,
}: {
  airDropList: AirDrop[];
  title: string;
}) {
  return (
    <div className="w-[400px] card-bg">
      <div className="text-white w-full title text-[28px] ">{title}</div>
      <div className="flex flex-col justify-start w-full px-2">
        {airDropList.map((airDrop) => <Card airDrop={airDrop}/>)}
      </div>
    </div>
  );
}

export default AirDropListCard;

function Card({airDrop}: {
  airDrop: AirDrop;
}) {
  return (
    <div key={airDrop.id}>
      <div className="flex flex-row justify-start items-center">
        <img src={airDrop.logo} alt="" className="w-[30px] h-[30px]" />
        <div className="flex flex-col pl-3">
          <span>{airDrop.name}</span>
          <span>{airDrop.title}</span>
        </div>
      </div>
      <div className="bg-zinc-400 w-full h-[1px] my-2"></div>
    </div>
  );
}
