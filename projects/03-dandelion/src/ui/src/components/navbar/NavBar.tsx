import { ReactNode, useState } from "react";

import { Logo } from "../../assets";
import { NavLinks } from "../../constants";
import Button from "components/Button";

const Navbar = ({ children }: { children: ReactNode }) => {
  const [active, setActive] = useState("Home");
  // const [toggle, setToggle] = useState(false);

  return (
    <nav className="w-full flex pt-6 justify-between items-center">
      <div className="flex items-center">
        <img src={Logo} alt="dandelion" className="w-[60px] h-[60px]" />
        <span className="text-white text-xl font-bold px-4">Dandelion</span>
      </div>

      <ul className="list-none sm:flex hidden  items-center px-5">
        {NavLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-poppins  cursor-pointer text-[20px]   text-white  hover:text-space-cyan-light ${
              active === nav.title ? "font-extrabold" : ""
            } ${index === NavLinks.length - 1 ? "mr-0" : "mr-10"}`}
            onClick={() => setActive(nav.title)}
          >
            <a href={`#${nav.id}`}>{nav.title}</a>
          </li>
        ))}
      </ul>
      <div>
        {/* <Button></Button> */}
        {children}
      </div>
    </nav>
  );
};

export default Navbar;
