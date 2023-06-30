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
  Select,
  message,
  Tabs,
  Empty,
} from "antd";
import React, { useState, useEffect } from "react";
import PolkadotLogo from "../statics/polkadot-logo.svg";
import { getAPI, getKeyring } from "../utils/polkadot";
import Identicon from "@polkadot/react-identicon";
import Img from "../components/Img";
import { nftMint } from "../services/nft";
import * as util from "../utils";
import { formatImgUrl, formatterSize, formatAddress } from "../utils/formatter";
import CessMiniLogo from "../statics/imgs/cess-mini-logo.png";
import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
} from "@polkadot/extension-dapp";
import { contractMint } from "../services/contract/index";
import CESSCoin from "../components/CESSCoin";
import {
  controlGetList,
  controlGetActivityList,
  controlMint,
  controlBuy,
  controlCancel,
} from "../controls/nft";

function Home({ className }) {
  document.title = "Profile";
  let navigate = useNavigate();

  const [addr, setAddr] = useState("");
  const [NFTlist, setNFTlist] = useState([]);
  const [colletedNFTlist, setColletedNFTlist] = useState([]);
  const [createdNFTlist, setCreatedNFTlist] = useState([]);
  const [tab, setTab] = useState(1);

  const [dataSourceListing, setDataSourceListing] = useState([]);
  const [dataSourceActivity, setDataSourceActivity] = useState([]);

  const getNftBox = (txt, item) => {
    return (
      <div
        onClick={() => navigate("/detail/" + item.fileHash)}
        className="pointer"
      >
        {item.coverImg ? (
          <div className="item-img">
            <Img
              src={formatImgUrl(item.coverImg)}
              width="100px"
              height="50px"
            />
          </div>
        ) : (
          ""
        )}
        <span className="item-txt">{txt}</span>
      </div>
    );
  };
  const columnsListing = [
    {
      title: "NFT",
      dataIndex: "fileName",
      render: getNftBox,
    },
    {
      title: "Price(CESS)",
      dataIndex: "price",
      render: (txt) => {
        if(!txt||txt=='--') return '';
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
      title: "Date",
      dataIndex: "date",
    },
  ];
  const columnsActivity = [
    {
      title: "Event",
      dataIndex: "eventType",
    },
    {
      title: "Item",
      dataIndex: "fileName",
      render: getNftBox,
    },
    {
      title: "Price(CESS)",
      dataIndex: "price",
      render: (txt) => {
        if(!txt||txt=='--') return '';
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

  const loadNftList = async (address) => {
    console.log("****************", address);
    if (!address) {
      address = addr;
    }
    let items = await controlGetList();
    let items2 = items.filter((t) => t.owner == address);
    setColletedNFTlist(items2);
    setNFTlist(items2);
    let items3 = items.filter((t) => t.creator == address);
    setCreatedNFTlist(items3);
  };
  const loadActivity = async (address) => {
    let items = await controlGetActivityList();
    items = items.filter((t) => t.from == address || t.to == address);
    let items1 = items;
    items1.forEach((t) => {
      if (t.eventType == "transaction") {
        // console.log('t.from==address',t.from,address)
        if (t.from == address) {
          t.eventType = "sale";
        } else if (t.to == address) {
          t.eventType = "buy";
        }
      }
    });
    setDataSourceActivity(items1);
    let items2 = items.filter(
      (t) => t.eventType == "list" || t.eventType == "unlist"
    );
    setDataSourceListing(items2);
  };
  const tabItems = [
    {
      label: `Colleted`,
      key: 1,
    },
    {
      label: `Created`,
      key: 2,
    },
    {
      label: `Listing`,
      key: 3,
    },
    {
      label: `Activity`,
      key: 4,
    },
  ];
  const onTabChange = (key) => {
    console.log(key);
    setTab(key);
    if (key == 1) {
      setNFTlist(colletedNFTlist);
    } else if (key == 2) {
      setNFTlist(createdNFTlist);
    }
  };
  const onMenuChange = (value, item) => {
    console.log(value, item);
    if (value == 2) {
      navigate("/sale/" + item.fileHash);
    } else if (value == 3) {
      Modal.confirm({
        title: "Mint NFT",
        content:
          "The NFT will be viewed by everyone.You will be asked to confirm this minting from your wallet.",
        okText: "Continue",
        cancelText: "Cancel",
        onOk: () => {
          mint(item);
        },
      });
    } else if (value == 5) {
      //transfer
      navigate("/transfer/" + item.fileHash);
    } else if (value == 6) {
      Modal.confirm({
        title: "Cancel Listing",
        content:
          "This will cancel your listing.You will also be asked to confirm this cancelation from your wallet.",
        okText: "Continue",
        cancelText: "Cancel",
        onOk: async () => {
          //Cancel
          await controlCancel(item.fileHash);
          load();
        },
      });
    }
  };
  const mint = async (item) => {
    //Mint
    util.loading(true);
    let txHash = await contractMint(item.fileHash, function (status) {
      util.loading(false);
      util.loading(true, status);
    });
    let data = {
      filehash: item.fileHash,
      txhash: txHash,
      token: item.fileHash,
    };
    let result = await nftMint(data);
    console.log(result);
    if (result.ok) {
      util.alert("Mint success.");
    } else {
      util.alert(result.error);
    }
    util.loading(false);
    load();
  };
  const load = () => {
    let a = localStorage.getItem("addr");
    setAddr(a);
    loadNftList(a);
    loadActivity(a);
  };
  useEffect(() => {
    load();
  }, []);
  const toDetail = (hash) => {
    console.log("fffffff");
    navigate("/detail/" + hash);
  };
  return (
    <div className={className}>
      <div className="top-banner block"></div>
      <Identicon
        value={addr}
        size={128}
        theme={"polkadot"}
        className="header-img"
        style={{ width: "10%" }}
        onCopy={() => {
          util.copy(addr);
        }}
      />
      <div className="header">
        <h1>VIDEOWNER</h1>
        <div
          onClick={() => {
            util.copy(addr);
          }}
          style={{ cursor: "copy" }}
        >
          <CESSCoin width={21} height={21} />
          <span>{addr}</span>
        </div>
      </div>
      <div className="content block">
        <Tabs
          defaultActiveKey="1"
          size="large"
          onChange={onTabChange}
          items={tabItems}
        />
        {tab < 3 ? (
          <div className="content-in block">
            {NFTlist.length == 0 ? (
              <div className="empty">
                <Empty />
              </div>
            ) : (
              ""
            )}
            {NFTlist &&
              NFTlist.map((t, index) => (
                <div className="item block" key={index}>
                  <div onClick={() => toDetail(t.fileHash)}>
                    <Img
                      className={"item-image"}
                      width={357}
                      height={202}
                      src={t.coverImg}
                    />
                  </div>
                  <div className="view-line block">
                    {t.views ? (
                      <span>{t.views} views</span>
                    ) : (
                      <span>{formatterSize(t.size)}</span>
                    )}
                    <label>{t.length}</label>
                  </div>
                  <div className="title-line block">{t.fileName}</div>
                  <div
                    className="icon-line block"
                    style={{ cursor: "copy" }}
                    onClick={() => {
                      util.copy(t.owner);
                    }}
                  >
                    <Identicon
                      value={t.owner}
                      size={28}
                      theme={"polkadot"}
                      style={{ width: "10%", cursor: "copy" }}
                      onClick={() => {
                        util.copy(t.owner);
                      }}
                    />
                    <span className="addr">{formatAddress(t.owner)}</span>
                    <span className="blance">
                      {t.price} <font>TCESS</font>
                    </span>
                  </div>
                  <div>
                    <Select
                      defaultValue="1"
                      style={{ width: 120 }}
                      bordered={false}
                      onChange={(v) => {
                        onMenuChange(v, t);
                        return false;
                      }}
                      options={[
                        {
                          value: "1",
                          label: "...",
                          disabled: true,
                        },
                        {
                          value: "2",
                          label: "List for sale",
                          disabled: t.nftStatus != "Mint",
                        },
                        {
                          value: "3",
                          label: "Mint",
                          disabled: t.nftStatus != "Create",
                        },
                        {
                          value: "5",
                          label: "Transfter",
                          disabled: t.nftStatus != "Mint",
                        },
                        {
                          value: "6",
                          label: "Cancel Listing",
                          disabled: t.nftStatus != "List",
                        },
                      ]}
                    />
                    {/* <SmallDashOutlined
                    style={{ fontSize: "30px", marginLeft: "10px" }}
                  /> */}
                  </div>
                </div>
              ))}
          </div>
        ) : tab == 3 ? (
          <div className="listing-box">
            <Table dataSource={dataSourceListing} columns={columnsListing} />
          </div>
        ) : (
          <div className="activity-box">
            <Table dataSource={dataSourceActivity} columns={columnsActivity} />
          </div>
        )}
      </div>
    </div>
  );
}

export default styled(Home)`
  .block {
    display: block;
    overflow: hidden;
  }
  .item-image {
    cursor: pointer;
  }
  .pointer {
    cursor: pointer;
  }
  .item-img {
    float: left;
  }
  .item-txt {
    float: left;
    line-height: 25px;
    padding-left: 4px;
    font-weight: bold;
    height: 50px;
    overflow: hidden;
    max-width: 500px;
  }
  .top-banner {
    background: linear-gradient(
      180deg,
      rgba(210, 243, 111, 1) 0%,
      rgba(201, 244, 177, 1) 51%,
      rgba(192, 245, 241, 1) 100%
    );
    width: 100%;
    height: 240px;
  }
  .header-img {
    position: absolute;
    top: 150px;
    left: 30px;
    z-index: 99;
  }
  .mini-logo {
    width: 20px;
    background-color: #d3f36c;
  }
  .header {
    padding: 60px 10px 30px;
    span {
      background-color: #000;
      color: #d3f36c;
      line-height: 30px;
      margin-left: 10px;
    }
  }
  .content {
    padding: 20px;
  }
  .item:hover {
    box-shadow: 1px 2px 7px 0px #0000007a;
    .play-icon {
      color: green;
    }
  }
  .empty {
    padding: 100px;
  }
  .search-show {
    padding: 0 10px;
  }
  .item {
    width: 350px;
    float: left;
    background-color: #ddd;
    position: relative;
    margin: 10px;
    .play-icon {
      position: absolute;
      top: 59px;
      left: 41%;
      z-index: 99;
      font-size: 59px;
      color: #ffffff37;
      border-radius: 100%;
      transition: all 1s;
    }
    .img {
      width: 357px;
      height: 202px;
      cursor: pointer;
    }
    .view-line {
      width: 100%;
      height: 22px;
      line-height: 22px;
      background-color: #000000bf;
      position: absolute;
      top: 181px;
      left: 0px;
      color: #fff;
      padding: 0 10px;
      span {
        float: left;
      }
      label {
        float: right;
      }
    }
    .title-line {
      padding: 4px 6px;
      font-size: 16px;
      line-height: 20px;
      height: 20px;
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
        font {
          color: #aaa;
        }
      }
    }
  }
`;
