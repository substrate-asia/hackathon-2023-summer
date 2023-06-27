import Navbar from "components/navbar/NavBar";
import styles from "style";
import "./AirDropList.css";
import Wallet from "./Wallet";
import AirDropListCard from "./AirDropCard";
import AssetsList from "./AssetsList";
// import Button from "components/Button";

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
          <AirDropListCard></AirDropListCard>
          <AirDropListCard></AirDropListCard>
          <AirDropListCard></AirDropListCard>
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
