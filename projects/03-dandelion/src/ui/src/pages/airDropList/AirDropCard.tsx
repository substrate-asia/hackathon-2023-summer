import { Astar } from "assets";
import { AIRDROPS } from "../../constants";
import React from "react";

import type { AirDrop } from "../../constants";

function AirDropListCard({
  airDropList = AIRDROPS,
  title = "即将空投",
}: {
  airDropList?: AirDrop[];
  title?: string;
}) {
  return (
    <div className="w-[400px] card-bg">
      <div className="text-white w-full title text-[28px] ">{title}</div>
      <div className="flex flex-col justify-start w-full px-2">
        {airDropList.map((item) => {
          return (
            <div key={item.id}>
              <div className="flex flex-row justify-start items-center">
                <img src={Astar} alt="" className="w-[30px] h-[30px]" />
                <div className="flex flex-col pl-3">
                  <span> Astar</span>
                  <span>Moonbeam 突破 100 万用户,超级空投来袭!</span>
                </div>
              </div>
              <div className="bg-zinc-400 w-full h-[1px] my-2"></div>
            </div>
          );
          // return <div>{item.title}</div>;
        })}
      </div>
    </div>
  );
}

export default AirDropListCard;

const Card = () => {
  return (
    <div className="flex flex-row justify-start items-center">
      <img src={Astar} alt="" className="w-[30px] h-[30px]" />
      <div className="flex flex-col pl-3">
        <span> Astar</span>
        <span>Moonbeam 突破 100 万用户,超级空投来袭!</span>
      </div>
    </div>
  );
};
