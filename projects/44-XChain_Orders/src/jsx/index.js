import React, { useContext } from "react";
import {  Switch, Route } from "react-router-dom";
import Header from "./layouts/nav/Header";
import NAV_NAVHADE from "./layouts/nav/NavHader";
import NAV_SIDEBAR from "./layouts/nav/SideBar";
import Footer from "./layouts/Footer";
import OrderManager from "./components/Screens/OrderManager";

import ReadMe from "./components/Screens/ReadMe";
import { ThemeContext } from "../context/ThemeContext";  
  
const Markup = ( { api, blockHeader, 
  walletConnected, changeChain, setupSpecs, getUserChain,
}) => {

  const { menuToggle } = useContext(ThemeContext);

  let path = window.location.pathname;
  path = path.split("/");
  path = path[path.length - 1];

  let pagePath = path.split("-").includes("page");
  return (
    <>
      <div id={`${!pagePath ? "main-wrapper" : ""}`} className={`${!pagePath ? "show" : "mh100vh"}  ${menuToggle ? "menu-toggle" : ""}`}>

        {!pagePath && <Header 
            walletConnected={walletConnected}
            changeChain={changeChain}
            setupSpecs={setupSpecs}
            getUserChain={getUserChain}
          />}
        {!pagePath && <NAV_NAVHADE blockHeader={blockHeader} />}
        {!pagePath && <NAV_SIDEBAR />}

        <div className={`${!pagePath ? "content-body" : ""}`} style={{marginBottom:"-50px"}}>
          <div
            className={`${!pagePath ? "container-fluid" : ""}`}
            style={{ minHeight: window.screen.height - 60 }}
          >
            <Switch>

              <Route exact path='/OrderManager'> 
                <OrderManager 
                api={api} blockHeader={blockHeader}
                /> 
              </Route>
              <Route exact path='/readme'> <ReadMe/> </Route>
              <Route exact path='/'> 
                <OrderManager 
                  api={api} blockHeader={blockHeader}
                  /> 
              </Route>

            </Switch> 
          </div>
        </div>
        {!pagePath && <Footer />}
      </div>
    </>
  );
};

export default Markup;