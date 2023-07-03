import styled from "styled-components";
function Header({ className, width, height,src }) {
  return <div className={className} style={{backgroundImage:"url("+src+")",width:width,height:height}}></div>;
}

export default styled(Header)`
    display: block;
    overflow: hidden;
    background-repeat: no-repeat;
    background-size: 100%;
    background-color:#aaa;
`;
