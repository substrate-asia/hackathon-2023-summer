import React, { Fragment, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../context/ThemeContext";
import cube1 from "../../../images/cube1.png";

const NavHader = ({blockHeader}) => {
  const [toggle, setToggle] = useState(false);
  const { navigationHader, openMenuToggle, background } = useContext(
    ThemeContext
  );
  return (
    <div className="nav-header">
      <Link to="#" className="brand-logo">
     
        {/* {background.value === "dark" || navigationHader !== "color_1" ? ( */}
        {true? (
          <Fragment>
              <div className="row">
                  <div className="col-xl-4 col-xxl-4">
                        <img alt="images" width={50} src={cube1} />  
                  </div>
                  <div className="col-xl-8 col-xxl-8">
                            <h6 style={{fontSize:"16px"}}>Moonbeam Block</h6> 
                            <h6 style={{fontSize:"16px"}}>#{blockHeader.number? blockHeader.number : "Not Connected"}</h6>
                  </div>
              </div>
          </Fragment>
        ) : (
          <Fragment>
							<img alt="images" width={50} src={cube1} />
          </Fragment>
        )}
      </Link>

      <div
        className="nav-control"
        onClick={() => {
          setToggle(!toggle);
          openMenuToggle();
        }}
      >
        <div className={`hamburger ${toggle ? "is-active" : ""}`}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
      </div>
    </div>
  );
};

export default NavHader;
