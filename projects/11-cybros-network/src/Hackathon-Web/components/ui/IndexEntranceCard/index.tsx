import { IndexEntranceProps} from "@/types";
import Link from "next/link";
import { IndexEntranceHeader } from "./IndexEntranceHeader";
import React from "react";

const IndexEntrace = ({ primaryColor, borderColor, titleDirection, title, description, goLink, iconURL, width, addtion}: IndexEntranceProps) => {

  const widthValue =  width.toString() + "px";
  
  return (
    <div className={`rounded-15 ${borderColor} flex flex-col justify-between bg-white h-[195px]`}
      style={{
        width: widthValue,
        color: primaryColor
      
      }}
    >
      <IndexEntranceHeader titleDirection={titleDirection} title={title} iconURL={iconURL} />
      <div>
        <p className="mb-[15px] ml-[18px] mr-[55px] text-[14px]">{description}</p>
        <div className="flex flex-row justify-star text-white text-[16px] font-medium leading-21 mx-[15px] mb-[18px] gap-[9px] h-[45px]">
          <Link href={goLink} className={"flex justify-center items-center rounded-15 w-[76px] cb-hover-border"} 
            style={ {background: primaryColor} }
          >
            Go 
          </Link>
          { addtion && (
            <Link href={addtion.link}
              className={addtion.className}
            >
              {addtion.title}
            </Link>
          ) }
        </div>
      </div>
    </div>
  );
};
export default IndexEntrace;