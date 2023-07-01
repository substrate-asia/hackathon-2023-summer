import "./AirDropList.css";
import { Outlet } from "react-router-dom";

function AirDropList() {
  return (
    <>
      <div className="separator w-full h-1"></div>
      <Outlet />
    </>
  );
}

export default AirDropList;
