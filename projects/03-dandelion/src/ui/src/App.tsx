import AirDropList from "pages/airDropList/AirDropList";
import "./App.css";
import Home from "pages/home/Home";
// import { Demo } from "./view/demo/Demo";

function App() {
  return (
    <>
      <div className="w-full  overflow-hidden">
        {/* <Home></Home> */}
        <AirDropList />
      </div>
      {/* <Demo /> */}
    </>
  );
}

export default App;
