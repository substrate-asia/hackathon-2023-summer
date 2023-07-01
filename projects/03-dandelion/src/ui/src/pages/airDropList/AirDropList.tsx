import Navbar from "components/navbar/NavBar";
import styles from "style";
import "./AirDropList.css";
import Wallet from "./Wallet";
import AirDropListCard from "./AirDropCard";
import AssetsList from "./AssetsList";
import { AIR_DROPS_0, AIR_DROPS_1, AIR_DROPS_2 } from "../../constants";

function AirDropList() {
  return (
    <div className={` air-drop-list-bg text-white`}>
      <div className={`${styles.flexCenter} ${styles.paddingX} pb-6`}>
        <div className={`${styles.boxWidth}`}>
          <Navbar>
            {/* <Button /> */}
            <Wallet></Wallet>
          </Navbar>
        </div>
      </div>
      <div className="separator w-full h-1"></div>
      <div className={`${styles.paddingX}`}>
        <div className="airdrop-title"> AirDrop List</div>
        <div className=" w-full flex flex-row justify-between mt-1">
          <AirDropListCard
            airDropList={AIR_DROPS_0}
            title='准备空投'
          ></AirDropListCard>
          <AirDropListCard
            airDropList={AIR_DROPS_1}
            title='正在空投'
          ></AirDropListCard>
          <AirDropListCard
            airDropList={AIR_DROPS_2}
            title='空投结束'
          ></AirDropListCard>
        </div>
      </div>
      <div className={` ${styles.paddingX}`}>
        <div className="separator  h-1 mt-10"></div>
        <div className="airdrop-title"> Assets</div>
        <AssetsList></AssetsList>
      </div>
    </div>
  );
}

export default AirDropList;
