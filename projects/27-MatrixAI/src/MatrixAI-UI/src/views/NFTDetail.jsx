import styled from "styled-components";
import _ from "lodash";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import {
  PlayCircleOutlined,
  CloudUploadOutlined,
  WalletOutlined,
  SearchOutlined,
  HomeOutlined,
  SmallDashOutlined,
} from "@ant-design/icons";
import {
  Modal,
  Button,
  Alert,
  Table,
  Input,
  Select,
  message,
  List,
  Empty,
} from "antd";
import React, { useState, useEffect } from "react";
import PolkadotLogo from "../statics/polkadot-logo.svg";
import { getAPI, getKeyring } from "../utils/polkadot";
import Identicon from "@polkadot/react-identicon";
import Img from "../components/Img";
import * as util from "../utils";
import { formatImgUrl, formatterSize, formatAddress } from "../utils/formatter";
import CESSCoin from "../components/CESSCoin";
import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
} from "@polkadot/extension-dapp";
import { formatVideoUrl, formatBalance } from "../utils/formatter";
import {
  controlGetOneList,
  controlGetActivityList,
  controlTransfer,
  controlMint,
  controlBuy,
  controlCancel,
} from "../controls/nft";
import webconfig from "../webconfig";

let myAddr = "";

function Home({ className }) {
  const { fileHash } = useParams();
  document.title = "NFT Detail";
  let navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [addr, setAddr] = useState("");
  const [toAddr, setToAddr] = useState("");
  const [detail, setDetail] = useState({});
  const [dataSourceActivity, setDataSourceActivity] = useState([]);
  const columnsActivity = [
    {
      title: "Event",
      dataIndex: "eventType",
    },
    {
      title: "Price(CESS)",
      dataIndex: "price",
      render: (txt) => {
        if (!txt || txt == "--") return "";
        return (
          <div>
            <CESSCoin width={21} height={21} /> {txt}
          </div>
        );
      },
    },
    {
      title: "From",
      dataIndex: "fromSort",
    },
    {
      title: "To",
      dataIndex: "toSort",
    },
    {
      title: "Time",
      dataIndex: "date",
    },
  ];
  const load = async () => {
    controlGetOneList(fileHash, setDetail);
    let list = await controlGetActivityList();
    console.log("list", fileHash, list);
    list = list.filter((t) => t.fileHash == fileHash);
    list.forEach((t) => {
      if (t.eventType == "transaction") {
        // console.log('t.from==address',t.from,address)
        if (t.from == myAddr) {
          t.eventType = "sale";
        } else if (t.to == myAddr) {
          t.eventType = "buy";
        }
      }
    });
    setDataSourceActivity(list);
  };
  useEffect(() => {
    let addr = localStorage.getItem("addr");
    setAddr(addr);
    myAddr = addr;
    load();
  }, []);
  const onCancelListing = async () => {
    setLoading(true);
    let isOK = await controlCancel(fileHash);
    setLoading(false);
    if (isOK) {
      load();
    }
  };
  const onBuy = async () => {
    return navigate("/buy/" + fileHash);
  };
  const onSale = () => {
    return navigate("/sale/" + fileHash);
  };
  const onMint = async () => {
    //upload chain
    setLoading(true);
    await controlMint(fileHash);
    await load();
    setLoading(false);
  };
  return (
    <div className={className}>
      <div className="top">
        <div className="top-left">
          <div className="top-left-1">
            <div className="player-box">
              {detail && detail.fileHash ? (
                <video
                  style={{ backgroundColor: "#000" }}
                  autoPlay={true}
                  width="100%"
                  height="100%"
                  controls
                >
                  <source
                    src={formatVideoUrl(detail.fileHash)}
                    type="video/mp4"
                  />
                </video>
              ) : (
                <Empty />
              )}
            </div>
          </div>
        </div>
        <div className="top-right">
          <h1>{detail.fileName}</h1>
          <div className="hold"></div>
          <div className="hold"></div>
          <h5>{detail.description}</h5>
          <div>
            <div className="hold"></div>
            <div className="hold"></div>
            <div className="hold"></div>
            <div className="hold"></div>
            <div className="hold"></div>
            <h4>Owned by</h4>
            <div className="icon-line block">
              <Identicon
                value={detail.owner}
                size={28}
                theme={"polkadot"}
                style={{ width: "10%" }}
              />
              <span className="addr">{detail.owner}</span>
            </div>
            <div className="hold"></div>
            <div className="hold"></div>
            <div className="hold"></div>
            {detail.nftStatus == "List" && detail.owner == addr ? (
              <div className="btn-box">
                <span className="left-txt">
                  Fixed Price
                  <font>{detail.price}</font> TCESS
                </span>
                <Button
                  loading={loading}
                  disabled={loading}
                  size="large"
                  type="primary"
                  onClick={onCancelListing}
                >
                  Cancel Listing
                </Button>
              </div>
            ) : detail.nftStatus == "List" && detail.owner != addr ? (
              <div className="btn-box">
                <span className="left-txt">
                  Fixed Price <font>{detail.price}</font> CESS
                </span>
                <Button
                  loading={loading}
                  disabled={loading}
                  size="large"
                  type="primary"
                  onClick={onBuy}
                >
                  Buy Now
                </Button>
              </div>
            ) : detail.nftStatus == "Mint" && detail.owner == addr ? (
              <div className="btn-box">
                <Button
                  loading={loading}
                  disabled={loading}
                  size="large"
                  type="primary"
                  onClick={onSale}
                >
                  List for sale
                </Button>
              </div>
            ) : detail.nftStatus == "Create" && detail.owner == addr ? (
              <div className="btn-box">
                <Button
                  loading={loading}
                  disabled={loading}
                  size="large"
                  type="primary"
                  onClick={onMint}
                >
                  Mint
                </Button>
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="hold"></div>
          <div className="top-left-2">
            <div className="line">
              <label className="line-left">Creator</label>
              <span className="line-right">
                <div
                  className="addr copy"
                  onClick={() => {
                    util.copy(detail.creator);
                  }}
                >
                  {formatAddress(detail.creator)}
                </div>
                <div className="icon-box">
                  <Identicon
                    value={detail.creator}
                    size={28}
                    theme={"polkadot"}
                  />
                </div>
              </span>
            </div>
            <div className="line">
              <label className="line-left">Owner</label>
              <span className="line-right">
                <div
                  className="addr copy"
                  onClick={() => {
                    util.copy(detail.owner);
                  }}
                >
                  {detail.owner == addr ? "You" : formatAddress(detail.owner)}
                </div>
                <div className="icon-box">
                  <Identicon
                    value={detail.owner}
                    size={28}
                    theme={"polkadot"}
                  />
                </div>
              </span>
            </div>

            <div className="line">
              <label className="line-left">Contract Address</label>
              <span className="line-right">
                <div
                  className="addr copy"
                  onClick={() => {
                    util.copy(webconfig.contractAddress);
                  }}
                >
                  {formatAddress(webconfig.contractAddress)}
                </div>
              </span>
            </div>

            <div className="line">
              <label className="line-left">NFT Status</label>
              <span className="line-right">{detail.nftStatus}</span>
            </div>

            <div className="line">
              <label className="line-left">Video Status</label>
              <span className="line-right">{detail.fileStatus}</span>
            </div>

            <div className="line">
              <label className="line-left">Blockchain</label>
              <span className="line-right">CESS</span>
            </div>

            <div className="line">
              <label className="line-left">File Storage Onchain</label>
              <span className="line-right">CESS</span>
            </div>

            <div className="line">
              <label className="line-left">File Size</label>
              <span className="line-right">{detail.size_str}</span>
            </div>

            <div className="line">
              <label className="line-left">Views</label>
              <span className="line-right">{detail.views} </span>
            </div>

            <div className="line">
              <label className="line-left">File Hash</label>
              <span className="line-right">
                <div
                  className="addr copy"
                  onClick={() => {
                    util.copy(detail.fileHash);
                  }}
                >
                  {formatAddress(detail.fileHash)}
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="hold"></div>
      <div className="hold"></div>
      <div className="bottom">
        <div className="activity-box">
          <Table dataSource={dataSourceActivity} columns={columnsActivity} />
        </div>
      </div>
    </div>
  );
}

export default styled(Home)`
  min-width: 1200px;
  display: block;
  overflow: hidden;
  margin: 0px auto;
  padding: 70px 3% 20px;
  h1 {
    font-size: 20px;
  }
  .copy {
    cursor: copy;
  }
  .hold {
    display: block;
    overflow: hidden;
    clear: both;
    width: 100%;
    height: 10px;
  }
  .block {
    display: block;
    overflow: hidden;
  }
  .fr {
    float: right;
  }
  .fl {
    float: left;
  }
  .empty {
    padding: 100px;
  }
  .top-left {
    width: 48%;
    float: left;
  }
  .top-right {
    width: 50%;
    float: right;
    .top-left-2 {
      background-color: #eee;
      border-radius: 6px;
      padding: 20px;
      display: block;
      overflow: hidden;
      .line {
        height: 29px;
        line-height: 29px;
        display: block;
        overflow: hidden;
        clear: both;
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 14px;
        .line-left {
          float: left;
          width: 30%;
          display: block;
          overflow: hidden;
          font-size: 16px;
        }
        .line-right {
          float: right;
          width: 70%;
          display: block;
          overflow: hidden;
          text-align: right;
          .icon-box {
            display: block;
            width: 60px;
            float: right;
            overflow: hidden;
            margin-right: 10px;
          }
          .addr {
            display: block;
            width: 150px;
            text-align: center;
            float: right;
            background-color: #000;
            color: yellowgreen;
            font-size: 14px;
            font-weight: lighter;
            overflow: hidden;
          }
        }
      }
    }
    .btn-box {
      display: block;
      background-color: #000;
      text-align: center;
      padding: 20px 0;
      border-radius: 6px;
      margin-top: 10px;
      .left-txt {
        width: 60%;
        text-align: left;
        color: #fff;
        float: left;
        line-height: 40px;
        padding-left: 20px;
        font {
          color: #d3f36c;
          font-size: 40px;
        }
      }
      button {
        background-color: #a4cb29 !important;
      }
    }
    .icon-line {
      display: flex;
      padding: 4px 6px;
      line-height: 26px;
      .addr {
        color: #888;
        width: 60%;
      }
      .blance {
        width: 30%;
        text-align: right;
      }
    }
  }
  .bottom {
    background-color: #eee;
    border-radius: 6px;
    padding: 10px;
  }
`;
