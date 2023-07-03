import styled from "styled-components";

function Home({ className }) {
  return (
    <div className={className}>
      <div>
        <svg
          t="1674006862421"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="6396"
          width="100"
          height="100"
        >
          <path
            d="M512 68.571429a441.897143 441.897143 0 1 1-172.571429 34.822857A440.514286 440.514286 0 0 1 512 68.571429m0-68.571429C229.234286 0 0 229.234286 0 512s229.234286 512 512 512 512-229.234286 512-512S794.765714 0 512 0z"
            p-id="6397"
            fill="#ffffff"
          ></path>
          <path
            d="M709.291429 409.142857L541.394286 230.137143a34.205714 34.205714 0 0 0-29.108572-16.102857h-0.708571a34.285714 34.285714 0 0 0-29.234286 16.125714L314.685714 409.142857a34.285714 34.285714 0 0 0 50.057143 46.857143L477.714286 335.462857v440.228572a34.285714 34.285714 0 0 0 68.571428 0V335.508571L659.28 456a34.285714 34.285714 0 0 0 50.011429-46.857143z"
            fill="#ffffff"
            p-id="6398"
          ></path>
        </svg>
        <br />
        <span>We are upgrading and a new experience is coming.</span>
      </div>
    </div>
  );
}

export default styled(Home)`
  background-color: rgb(167 205 43);
  width: 100%;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  div {
    width: 80%;
    line-height: 100px;
    display: block;
    overflow: hidden;
    margin: 200px auto;
    text-align: center;
    color: #fff;
    font-size: 40px;
    font-family: fantasy;
  }
`;
