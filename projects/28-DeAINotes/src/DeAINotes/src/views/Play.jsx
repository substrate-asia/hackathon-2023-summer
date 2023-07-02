import styled from "styled-components";
import _ from "lodash";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import {
  PlayCircleOutlined,
  CloudUploadOutlined,
  WalletOutlined,
  SearchOutlined,
  EyeOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { Modal, Menu, message, Popconfirm, Button, Empty } from "antd";
import React, { useState, useEffect } from "react";
import {
  controlGetList,
  controlGetActivityList,
  controlTransfer,
  controlMint,
  controlBuy,
  controlCancel,
} from "../controls/nft";
import { addViews } from "../services/nft";
import { getFileState } from "../services/video-api";
import CessMiniLogo from "../statics/imgs/cess-mini-logo.png";
import { getAPI, getKeyring } from "../utils/polkadot";
import { formatAddress } from "../utils";
import { formatBalance } from "../utils/formatter";
import Identicon from "@polkadot/react-identicon";
import Img from "../components/Img";
import VideoList from "../components/VideoList";
import StoreMinerList from "../components/StoreMinerList";
import MinerLogo from "../statics/imgs/miner.svg";
import * as util from "../utils";
import { formatVideoUrl } from "../utils/formatter";
import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
} from "@polkadot/extension-dapp";
let myAddr = "";

function Home(props) {
  const { fileHash } = useParams();
  console.log("id", fileHash);
  document.title = "Play";
  let navigate = useNavigate();
  const [list, setList] = useState([]);
  const [detail, setDetail] = useState({});
  const [miners, setMiners] = useState([]);
  const [addr, setAddr] = useState("");
  useEffect(() => {
    async function main() {
      let items = await controlGetList(null,null,true);
      let d = items.find((t) => t.fileHash == fileHash);
      if (!d) {
        return util.alert("nft not found.");
      }
      setList(items.filter((t) => t.fileHash != fileHash));
      setDetail(d);
      let result = await getFileState(fileHash);
      console.log("result", result);
      if (result.ok && result.ok.blocks) {
        let arr = result.ok.blocks.map((t) => t.minerAcc);
        setMiners(arr);
        console.log("miners", arr);
      }
    }
    main();
    let a = localStorage.getItem("addr");
    setAddr(a);
    myAddr = a;
    setTimeout(async () => {
      await addViews(fileHash);
    }, 5000);
  }, [fileHash]);
  return (
    <div className={props.className}>
      <div className="con-left">
        <div className="player-box">
          {detail && detail.fileHash ? (
            <video
              autoPlay={true}
              style={{ backgroundColor: "#000" }}
              width="100%"
              height="100%"
              controls
              src={formatVideoUrl(detail.fileHash)}
            />
          ) : (
            <Empty />
          )}
        </div>
        <div className="player-state block">
          Connecting CESS Network. Data from {miners.length} miner.
          <div className="views-box">
            <EyeOutlined /> {detail.views} Views&nbsp;
          </div>
        </div>
        <h4 className="title">
          {detail.fileName}{" "}
          <font onClick={() => navigate("/detail/" + detail.fileHash)}>
            【View Detail】
          </font>
        </h4>
        <div className="user-hader block">
          <Identicon
            value={detail.owner}
            size={36}
            theme={"polkadot"}
            style={{ marginTop: 0 }}
          />
          <span className="addr-text">{detail.owner}</span>
        </div>
        <div className="detail-txt">{detail.description}</div>
        <div className="title2 block">File Storage Details</div>
        <StoreMinerList items={miners} />
      </div>
      <div className="con-right">
        {detail.nftStatus == "List" ? (
          <div className="pannel-1">
            <div className="p-1">Fixed Price</div>
            <div className="p-2">
              <img src={CessMiniLogo} />
              <span>{detail.price}</span>
              <label>CESS</label>
            </div>
            <div className="p-3">
              {addr == detail.owner ? (
                <Button
                  className="p-3-btn"
                  type="primary"
                  onClick={() => navigate("/detail/" + fileHash)}
                >
                  Cancel List
                </Button>
              ) : (
                <Button
                  className="p-3-btn"
                  type="primary"
                  onClick={() => navigate("/buy/" + fileHash)}
                >
                  Buy Now
                </Button>
              )}
            </div>
            <div
              className="p-4"
              onClick={() => navigate("/detail/" + fileHash)}
            >
              More NFT Details
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="pannel-2">
          <VideoList items={list} />
        </div>
      </div>
    </div>
  );
}

export default styled(Home)`
  display: block;
  overflow: hidden;
  margin: 0px auto;
  padding: 70px 3% 20px;
  .block {
    display: block;
    overflow: hidden;
    clear: both;
  }
  .views-box {
    float: right;
  }
  .con-left {
    width: 69%;
    float: left;
    .player-box {
      width: 100%;
      height: 600px;
      display: block;
      overflow: hidden;
    }
    .player-state {
      width: 100%;
      text-indent: 8px;
      height: 30px;
      line-height: 30px;
      background-color: #000;
      color: green;
    }
    .title {
      font-size: 18px;
      line-height: 24px;
      padding: 17px 0;
      font-weight: bold;
      font {
        color: blue;
        text-decoration: underline;
        cursor: pointer;
      }
    }
    .user-hader {
      position: relative;
      top: 0;
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
      padding: 10px 0;
      margin-bottom: 10px;
      .addr-text {
        position: absolute;
        top: 11px;
        left: 46px;
        line-height: 36px;
        font-size: 16px;
        font-weight: bold;
      }
    }
    .detail-txt {
      font-size: 15px;
    }
    .title2 {
      font-weight: bold;
      font-size: 16px;
      line-height: 58px;
    }
  }
  .con-right {
    width: 30%;
    float: right;
    .pannel-1 {
      display: block;
      overflow: hidden;
      padding: 10px;
      border-radius: 6px;
      background-color: #eee;
      text-align: center;
      margin-bottom: 20px;
      .p-1 {
      }
      .p-2 {
        img {
          width: 14px;
          background-color: #d3f36c;
        }
        span {
          font-weight: bold;
          font-size: 40px;
          padding: 0 25px;
        }
        label {
          font-size: 12px;
          color: #aaa;
        }
      }
      .p-3 {
        .p-3-btn {
          background-color: #d3f36c;
          color: #222;
          border: none;
          outline: none;
          width: 200px;
          margin-top: 20px;
        }
      }
      .p-4 {
        display: block;
        overflow: hidden;
        width: 100%;
        height: 27px;
        line-height: 30px;
        font-size: 12px;
        border-top: 1px solid #e5e5e5;
        margin-top: 35px;
        color: blue;
        cursor: pointer;
      }
    }
  }
`;
