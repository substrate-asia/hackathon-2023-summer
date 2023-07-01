import styles from "../../style";
import MainDes from "components/mainDes/MainDes";
import Partner from "./Partner";
import Dandelion from "./Dandelion";
import Footer from "./Footer";

function Home() {
  return (
    <div className="sm:px-20 px-6 mt-10">
      <MainDes />
      <Dandelion />
      <div className={` ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Partner />
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Home;
