import "./App.css";
import NavBar from "components/navbar/NavBar";
import { Outlet, useLocation } from "react-router-dom";
// import { Demo } from "./view/demo/Demo";

function App() {
  const location = useLocation();
  return (
    <div className={`${location.pathname === "/" ? "home-bg" : "bg-primary"}`}>
      <NavBar></NavBar>
      <Outlet />
    </div>
  );
}

export default App;
