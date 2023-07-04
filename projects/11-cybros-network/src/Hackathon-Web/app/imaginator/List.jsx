import React, { useMemo } from "react";
import { useAppStatus } from "@/utils/atoms";
import ArtCard from "@/app/imaginator/ArtCard";

export default function ImaginatorList() {
  const { data: statusData } = useAppStatus();
  const latestJobId = statusData?.latestJobId || 0;

  const idList = useMemo(() => {
    if (!latestJobId) return [];
    const ret = [];
    for (let i = latestJobId; i > 0; i--) {
      if (ret.length === 12) break;
      ret.push(i);
    }
    return ret;
  }, [latestJobId]);

  return (
    <>
      <div className="flex flex-row justify-between mx-[21px] mt-[48px]">
        <p className="text-[27px] font-medium leading-[33px]">Arts</p>
        {/*<label htmlFor="my-checkbox" className="inline-flex items-center">*/}
        {/*  <input*/}
        {/*    id="my-checkbox"*/}
        {/*    type="checkbox"*/}
        {/*    className="form-checkbox h-[18px] w-[18px] shadow-cb-normal shadow-cb rounded-[3px]"*/}
        {/*  />*/}
        {/*  <span className="ml-3 text-cb-value">only show my arts</span>*/}
        {/*</label>*/}
      </div>
      <div className="mt-7 mb-14 flex flex-wrap gap-[30px]">
        {idList.map((id) => {
          return <ArtCard key={`ArtCard-${id}`} jobId={id} />;
        })}
      </div>
    </>
  );
}
