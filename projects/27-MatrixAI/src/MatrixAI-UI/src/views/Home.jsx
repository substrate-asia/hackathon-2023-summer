import styled from "styled-components";
import _ from "lodash";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import {
  PlayCircleOutlined,
  CloudUploadOutlined,
  WalletOutlined,
  SearchOutlined,
  HomeOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { Modal, Alert, Menu, message, Popconfirm, Empty } from "antd";
import React, { useState, useEffect } from "react";
import PolkadotLogo from "../statics/polkadot-logo.svg";
import { getAPI, getKeyring } from "../utils/polkadot";
import { formatAddress } from "../utils";
import Identicon from "@polkadot/react-identicon";
import Img from "../components/Img";
import * as util from "../utils";
import { formatImgUrl, formatterSize } from "../utils/formatter";
import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
} from "@polkadot/extension-dapp";
import {
  controlGetList,
  controlGetActivityList,
  controlTransfer,
  controlMint,
  controlBuy,
  controlCancel,
} from "../controls/nft";

function Home({ className }) {
  const { keyword, cat } = useParams();
  document.title = "MatrixAI Home";
  let navigate = useNavigate();
  const [NFTlist, setNFTlist] = useState([]);
  useEffect(() => {
    if (cat) {
      controlGetList(null, null, true).then((list) => {
        setNFTlist(list.filter((t) => t.label == cat));
      });
    } else {
      controlGetList(setNFTlist, keyword, true);
    }
  }, [keyword, cat]);
  const onBackHome = () => {
    navigate("/");
  };
  return (
    <div className={className}>
      <div className="content">
        <div className="hold"></div>
        <div className="box1">
          <h1>Decentralized AI Hashrate Network</h1>
          <span className="play-btn"> Play Video</span>
        </div>
        <div className="box2">
          <div className="con">
            <h1>How to buy hashrate with wallet</h1>
            <div className="mini-boxs">
              <div>
                <img src="/img/home/box2-1.png" />
                <span>Create an account on polkadot.js</span>
              </div>
              <div>
                <img className="box-line" src="/img/home/box-2-line.svg" />
              </div>
              <div>
                <img src="/img/home/box2-2.png" />
                <span>Select a hashrate provider</span>
              </div>
              <div>
                <img className="box-line" src="/img/home/box-2-line.svg" />
              </div>
              <div>
                <img src="/img/home/box2-3.png" />
                <span>Buy the hashrate</span>
              </div>
            </div>
            <div className="mini-boxs2">
              <div className="left">
                <h2>What is MatrixAI</h2>
                <span>
                  MatrixAI is a user-friendly, efficient AI hashrate trading
                  platform. With the hashrate prove protocols, we aim to provide
                  a secure and simple trading experience. On MatrixAI, it
                  connects idle hashrate machines in global, and only takes you
                  a few minutes to buy hashrate from anywhere at any time, then
                  training your AI model.
                </span>
              </div>
              <div className="right"></div>
            </div>
          </div>
        </div>
        <div className="box3">
          <div className="con">
            <h3>Why buy hashrate with MatrixAI</h3>
            <div>
              <span>
                <img src="/img/home/box3-1.png" />
                <font>Fast</font>
                <label>
                  MatrixAI users can instantly buy hashrate with crypto and have
                  it used deployed algorithm to start traning the AI model in
                  minutes
                </label>
              </span>
              <span>
                <img src="/img/home/box3-2.png" />
                <font>Low Cost</font>
                <label>
                  MatrixAI uses idle resources to support user training AI
                  models
                </label>
              </span>
              <span>
                <img src="/img/home/box3-3.png" />
                <font>Proof of Hashrate</font>
                <label>
                  MatrixAI will provide a dynamic hashrate proof to ensure that
                  the provider's machine is truthful working
                </label>
              </span>
            </div>
          </div>
        </div>
        <div className="box4">
          <div>Powered by</div>
          <img src="/img/home/box4-1.png" />
        </div>
      </div>
    </div>
  );
}

export default styled(Home)`
  display: block;
  .con {
    width: 1210px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
  }
  .block {
    display: block;
    overflow: hidden;
  }
  .hold {
    display: block;
    overflow: hidden;
    width: 100%;
    height: 56px;
    clear: both;
  }
  .box1 {
    background-image: url(/img/home/u29.png);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 500px;
    display: block;
    overflow: hidden;
    h1 {
      width: 100%;
      line-height: 100px;
      text-align: center;
      color: #000;
      font-weight: bold;
      font-size: 48px;
      margin-top: 139px;
    }
    .play-btn {
      background-image: url(/img/home/u44.svg);
      background-repeat: no-repeat;
      background-size: 20px;
      background-position: 10px;
      width: 150px;
      height: 40px;
      line-height: 40px;
      text-indent: 49px;
      display: block;
      margin: 42px auto;
      background-color: rgba(0, 0, 0, 1);
      border-radius: 5px;
      font-family: "Montserrat", sans-serif;
      font-weight: 400;
      font-size: 14px;
      color: #ffffff;
    }
  }
  .box2 {
    text-align: center;
    background-color: #000;
    padding: 100px 0;
    color: #fff;
    h1 {
      text-align: center;
      display: block;
      width: 100%;
      font-size: 40px;
    }
    .mini-boxs {
      display: flex;
      flex-direction: row;
      width: 90%;
      margin: 100px auto;
      div {
        width: 20%;
        img {
          width: 70%;
        }
        .box-line {
          width: 75%;
          margin-top: 79px;
        }
        span {
          display: block;
          clear: both;
          height: 40px;
          line-height: 40px;
          font-size: 16px;
          color: #fff;
        }
      }
    }
    .mini-boxs2 {
      display: flex;
      flex-direction: row;
      padding: 100px 0 20px;
      .left {
        width: 50%;
        text-align: left;
        padding-top: 100px;
        h2 {
          margin-top: 0;
          margin-bottom: 0.5em;
          font-family: "Montserrat Bold", "Montserrat Regular", "Montserrat",
            sans-serif;
          font-weight: 700;
          font-style: normal;
          font-size: 40px;
        }
        span {
          font-family: "Montserrat", sans-serif;
          font-weight: 400;
          font-style: normal;
          font-size: 16px;
          color: #ffffff;
          line-height: 24px;
        }
      }
      .right {
        width: 50%;
        background-image: url(/img/home/box-2-4.png);
        background-repeat: no-repeat;
        background-size: 55%;
        background-position: right;
        height: 333px;
      }
    }
  }
  .box3 {
    background-color: rgba(218, 189, 169, 1);
    .con {
      display: block;
      padding: 100px 0;
      h3 {
        font-family: "Montserrat Bold", "Montserrat Regular", "Montserrat",
          sans-serif;
        font-weight: 700;
        font-style: normal;
        font-size: 40px;
        color: #000000;
        text-align: center;
      }
      div {
        display: flex;
        flex-direction: row;

        span {
          width: 27.33%;
          margin: 0 3%;
          display: flex;
          flex-direction: column;
          img {
            width: 31%;
            margin: 78px auto;
          }
          font {
            width: 100%;
            font-family: "Montserrat Bold", "Montserrat Regular", "Montserrat",
              sans-serif;
            font-weight: 700;
            font-style: normal;
            font-size: 18px;
            color: #000000;
            text-align: center;
            line-height: 50px;
          }
          label {
            font-family: "Montserrat", sans-serif;
            font-weight: 400;
            font-style: normal;
            font-size: 14px;
            color: #000000;
            text-align: center;
            line-height: 23px;
          }
        }
      }
    }
  }
  .box4 {
    display: block;
    width: 100%;
    padding: 100px 0;
    background-color: #000;
    div {
      width: 100%;
      height: 20px;
      line-height: 20px;
      text-align: center;
      color: #fff;
      font-size: 14px;
    }
    img {
      width: 272px;
      display: block;
      margin: 0 auto;
    }
  }
`;
