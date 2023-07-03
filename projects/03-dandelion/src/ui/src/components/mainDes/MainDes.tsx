import { HomeMainPic } from "assets";
import Button from "components/Button";
function MainDes() {
  return (
    <div className="flex flex-row items-center justify-between mt-20">
      <div className="flex flex-col">
        <span className="text-3xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] drop-shadow tracking-tight">
          Dandelion Airdrop
        </span>
        <span className="sm:text-xl mt-6 sm:mt-10 mb-8 sm:mb-14">
          A Decentralized Airdrop Community, getting The Latest Airdrop Tokens
        </span>
        <div className="text-center">
          <Button size="lg"></Button>
        </div>
      </div>
      <img className="w-[500px]" src={HomeMainPic} alt="" />
    </div>
  );
}

export default MainDes;
