import AirDropListCard from "./AirDropCard";
import styles from "style";
import AssetsList from "./AssetsList";
import airlist from "assets/list.json";
import type { AirDrop } from "constants/index";
const toAirDrop = airlist.filter(
  (item) => item.type === "准备空投"
) as unknown as AirDrop[];
const onAirDrop = airlist.filter(
  (item) => item.type === "正在空投"
) as unknown as AirDrop[];
const endAirDrop = airlist.filter(
  (item) => item.type === "空投结束"
) as unknown as AirDrop[];
function ListAndAssets() {
  return (
    <div className={` air-drop-list-bg text-white`}>
      <div className={`${styles.paddingX}`}>
        <div className="airdrop-title"> AirDrop List</div>
        <div className=" w-full flex flex-row justify-between mt-1">
          <AirDropListCard airDropList={toAirDrop} title="准备空投" />
          <AirDropListCard airDropList={onAirDrop} title="正在空投" />
          <AirDropListCard airDropList={endAirDrop} title="空投结束" />
        </div>
      </div>
      <div className={` ${styles.paddingX}`}>
        <div className="separator  h-1 mt-10"></div>
        <div className="airdrop-title"> Assets</div>
        <AssetsList />
      </div>
    </div>
  );
}

export default ListAndAssets;
