import { useEffect, useState } from "react";
import Home from "./components/Home";
import DeMap from "./components/DeMap";
import "aos/dist/aos.css";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

// polkadot
await web3Enable("Trypto");
const allAccounts = await web3Accounts();

export const App = () => {
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (allAccounts) {
  //     navigate("/DeMap");
  //   } else {
  //     navigate("/Home");
  //   }
  // }, [allAccounts, navigate]);

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
