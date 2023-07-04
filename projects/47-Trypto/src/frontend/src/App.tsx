import { useEffect, useState } from "react";
import Home from "./components/Home";
import DeMap from "./components/DeMap";
import "aos/dist/aos.css";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// polkadot
await web3Enable("Trypto");
const allAccounts = await web3Accounts();

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/DeMap" element={<DeMap users={allAccounts} />} />
      </Routes>
    </Router>
  );
};

export default App;
