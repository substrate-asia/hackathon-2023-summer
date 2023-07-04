import React from "react";
import Image from "next/image";

export const IndexEntranceHeader = (props: {titleDirection: "col" | "row", title: string, iconURL: string})  => {
  const boxVariants = {
    "row": "flex flex-row justify-start items-start mt-[21px] mx-[18px] gap-3",
    "col": "flex flex-col justify-start items-start mt-[21px] mx-[18px] gap-[9px]",
  };

  return (
    <div className={boxVariants[props.titleDirection]}>
      <Image src={props.iconURL} alt="icon" width={30} height={30} style={{ objectFit: "contain" }} />
      <p className={`text-[18px] font-medium leading-21 ${props.titleDirection == "row" && "mt-1"}`}>{props.title}</p>
    </div>
  );
};
