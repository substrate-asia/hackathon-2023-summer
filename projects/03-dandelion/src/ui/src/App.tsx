import "./App.css";
import NavBar from "components/navbar/NavBar";
import { Outlet, useLocation } from "react-router-dom";
// import { Demo } from "./view/demo/Demo";

function App() {
  const location = useLocation();
  // TODO: navbar的固定
  // const navbarRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (navbarRef.current) {
  //     const navbarHeight = navbarRef.current.offsetHeight;
  //     const parentElement = navbarRef.current.parentElement;
  //     if (parentElement) {
  //       // parentElement.style.height = `${navbarHeight}px`;
  //     }
  //   }
  // }, []);
  return (
    <div className={`${location.pathname === "/" ? "home-bg" : "bg-primary"}`}>
      {/* <NavBar ref={navbarRef}></NavBar> */}
      <NavBar></NavBar>
      <Outlet />
    </div>
  );
}

export default App;
