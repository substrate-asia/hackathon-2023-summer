import styled from "styled-components";
import CessMiniLogo from "../statics/imgs/cess-mini-logo.png";

function Header({ className, width, height }) {
  if (!width) width = 20;
  if (!height) height = 20;
  return (
    <img
      className={className}
      style={{ width: width + "px", height: height + "px" }}
      src={CessMiniLogo}
    />
  );
}

export default styled(Header)`
  background-color: #d3f36c;
  border-radius: 100%;
  padding: 4px;
`;
