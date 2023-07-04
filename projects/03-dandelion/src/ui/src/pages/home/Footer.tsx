/* eslint-disable jsx-a11y/anchor-is-valid */
import { FaTwitter, FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-transparent text-white py-10 border-white border-opacity-30 border-t">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex mt-2">
            <a href="#" className="text-white mr-4">
              <FaTwitter className="text-2xl" />
            </a>
            <a href="#" className="text-white mr-4">
              <FaInstagram className="text-2xl" />
            </a>
            <a href="#" className="text-white mr-4">
              <FaFacebook className="text-2xl" />
            </a>
            <a href="#" className="text-white ">
              <FaLinkedin className="text-2xl" />
            </a>
          </div>
        </div>
        <p className="text-white">© 2023 Dondelion. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
