import React from "react";
import Navbar from "components/navbar/NavBar";
import styles from "../../style";
import MainDes from "components/mainDes/MainDes";
import Partner from "./Partner";
import Dandelion from "./Dandelion";
import "./Home.css";
import Footer from "./Footer";
import Button from "components/Button";

function Home() {
  return (
    <div className={`home-bg ${styles.paddingX} `}>
      <div className={`${styles.flexCenter} `}>
        <div className={`${styles.boxWidth}`}>
          <Navbar>
            <Button />
          </Navbar>
        </div>
      </div>
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
