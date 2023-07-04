import styled from "styled-components";
import { Empty, Menu, message, Popconfirm, Button } from "antd";
import MinerLogo from "../statics/imgs/miner.svg";
import {
  formatImgUrl,
  formatterSize,
  formatAddress,
  formatAddressLong,
} from "../utils/formatter";

function Header({ className, items }) {
  return (
    <div className={className}>
      <div className="miner-list block">
        {items && items.length > 0 ? (
          items.map((t, i) => {
            return (
              <div className="minier" key={i}>
                <img src={MinerLogo} />
                <span>{t}</span>
              </div>
            );
          })
        ) : (
          <Empty style={{ padding: 30 }} description="No Data" />
        )}
      </div>
    </div>
  );
}

export default styled(Header)`
  overflow: hidden;
  display: block;
  .block {
    display: block;
    overflow: hidden;
    clear: both;
  }
  .minier {
    background-color: #000;
    border-radius: 50px;
    width: 319px;
    display: flex;
    padding: 15px 37px;
    overflow: hidden;
    margin-right: 10px;
    margin-bottom: 10px;
    float: left;
    img {
      width: 40px;
      height: 40px;
      overflow: hidden;
      margin-right: 1%;
    }
    span {
      width: 60%;
      word-wrap: break-word;
      flex-grow: 1;
      color: #d3f36c;
      font-size: 13px;
      line-height: 18px;
    }
  }
`;
