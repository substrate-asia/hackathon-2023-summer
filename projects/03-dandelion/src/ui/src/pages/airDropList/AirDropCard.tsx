import { Astar } from "assets";
import { AirDrop } from "constants/index";
import { NavLink } from "react-router-dom";

function AirDropListCard({
  airDropList = [],
  title = "即将空投",
}: {
  airDropList: AirDrop[];
  title: string;
}) {
  return (
    <div className="w-[400px] h-[400px] card-bg overflow-scroll">
      <div className="text-white w-full card-title text-[28px] ">{title}</div>
      <div className="flex flex-col justify-start w-full px-2">
        {airDropList.map((item, index) => {
          return (
            <NavLink to={`airdrop/${item.id}`} key={item.id}>
              <div className="flex flex-row justify-start items-center3">
                <img src={Astar} alt="" className="w-[30px] h-[30px]" />
                <div className="flex flex-col pl-3 overflow-hidden">
                  <span className="font-300"> {item.name}</span>
                  <span className="flex flex-grow overflow-hidden whitespace-nowrap">
                    {item.desc}
                  </span>
                </div>
              </div>
              {index === airDropList.length - 1 ? (
                ""
              ) : (
                <div className="bg-zinc-400 w-full h-[1px] my-2"></div>
              )}
            </NavLink>
          );
        })}

      </div>
    </div>
  );
}

export default AirDropListCard;

