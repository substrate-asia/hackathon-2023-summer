import Image from "next/image";
import { KeynoteButton, IndexEntrace } from "@/components";
import React from "react";
import { DC_URL, GITHUB_URL, entranceConfig } from "@/constants";

export default function Home() {
  return (
    <main className="main">
      <header className="flex justify-between items-end w-full px-[72px] pt-[36px]">
        <div className="flex">
          <Image src="/Logo.svg" alt="Logo" width={98} height={92} />
        </div>
        <div className="flex gap-[60px] items-end">
          <div className="flex justify-between gap-[42px] text-[18px] text-cb-value leading-21 mb-[19px]">
            <div>
              <a href={GITHUB_URL}>Github</a>
            </div>
            <div>
              <a href={DC_URL}>Discord</a>
            </div>
          </div>
          <div className="mb-[5px]">
            <KeynoteButton />
          </div>
        </div>
      </header>

      <div className="mx-24 pt-[69px] text-black">
        <div className="text-[36px] leading-[44px]">
          Web3 Job Scheduler connecting everything
        </div>
        <div className="whitespace-pre-wrap mr-[136px] mt-[27px] leading-22 text-[15px]">
          {" "}
        </div>
        <div className="-mx-[3px] my-[49px]">
          <div className="flex flex-col justify-start gap-[21px]">
            <IndexEntrace {...entranceConfig.main} />

            <div className="flex flex-row justify-start gap-[18px]">
              {entranceConfig.subs.map((item) => {
                return <IndexEntrace key={item.title} {...item} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
