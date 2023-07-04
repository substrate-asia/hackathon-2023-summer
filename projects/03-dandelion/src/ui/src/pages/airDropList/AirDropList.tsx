import { Outlet } from "react-router-dom";
import "./AirDropList.css";

function AirDropList() {
  return (
    <div className="mb-8">
      <div className="separator w-full h-1"></div>
      <Outlet />
    </div>
  );
}

export default AirDropList;
