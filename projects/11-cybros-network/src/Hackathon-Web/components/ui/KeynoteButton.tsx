import Image from "next/image";

const KeynoteButton = () => {
  return (
    <div className="flex bg-white/[0.52] cb-border-h rounded-15 w-[196px] h-[49px]">
      <div className="flex items-end gap-[9px] ml-[25px] mb-[13px]">
        <Image src="/Spiral.svg" alt="" width={24} height={24} />
        <div className="text-[18px] text-cb-normal leading-24 font-medium">The Keynote</div>
      </div>
    </div>
  );
};

export default KeynoteButton;