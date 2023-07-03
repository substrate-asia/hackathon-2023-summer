 import React from "react";

const Footer = () => {
  var d = new Date();
  return (
    <div className="footer">
      <div className="copyright">
        <p>
          {/* Copyright © Designed &amp; Developed by{" "} */}
          <a href="" target="_blank" rel="noreferrer">
          </a>{" "}
          {/* {d.getFullYear()} */}
        </p>
      </div>
    </div>
  );
};

export default Footer;
