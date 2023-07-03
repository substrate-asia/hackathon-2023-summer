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

import React, { useState, useEffect } from "react";
import PolkadotLogo from "../statics/polkadot-logo.svg";
import { getAPI, getKeyring } from "../utils/polkadot";
import Identicon from "@polkadot/react-identicon";
import Img from "../components/Img";
import { formatBalance, formatterSize } from "../utils/formatter";
import { alist, transfer } from "../services/nft";
import * as util from "../utils";
import { encodeAddress } from "@polkadot/util-crypto";
import {
  formatImgUrl,
  formatVideoUrl,
  formatterSize2,
  formatAddress,
} from "../utils/formatter";
import {
  Upload,
  Input,
  message,
  Select,
  Empty,
  Button,
  Card,
  InputNumber,
  Modal,
  Alert,
  Progress,
} from "antd";
import {
  controlGetOneList,
  controlGetActivityList,
  controlTransfer,
  controlMint,
  controlBuy,
  controlCancel,
} from "../controls/nft";
import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
} from "@polkadot/extension-dapp";

let run = 0,
  timeout = "";

function Home({ className }) {
  document.title = "Buy NFT";
  let navigate = useNavigate();
  const { fileHash } = useParams();

  const [loading, setLoading] = useState(false);
  const [addr, setAddr] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [detail, setDetail] = useState({});
  const [api, setAPI] = useState("");
  const [space, setSpace] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myBalance, setMyBalance] = useState(0);
  const [spaceAuth, setSpaceAuth] = useState(false);
  const [spaceAuthing, setSpaceAuthing] = useState(false);
  const [authProgress, setAuthProgress] = useState(0);
  const [buySize, setBuySize] = useState(1);
  const [buySpacing, setBuySpacing] = useState(false);

  useEffect(() => {
    let addr = localStorage.getItem("addr");
    setAddr(addr);
    querySpace(addr);
    controlGetOneList(fileHash, setDetail);
  }, []);

  //get wallet address
  const getAddr = (ignoreAlert) => {
    console.log("******************************getAddr start", run);
    let a = localStorage.getItem("addr");
    if (!a) {
      run++;
      if (run != 3 && !ignoreAlert) {
        util.alert("Please connect your wallet first");
      }
      return false;
    }
    // let address = ("0x263158a10b39debac59bd1239bc64fb4bd678f507814d24f59efd46279111c71", 11330)
    setAddr(a);
    let p = encodeAddress(a, 11330);
    setPublicKey(p);
    console.log("******************************getAddr end");
    return true;
  };
  const startAuthProgress = (i) => {
    if (i > 100) i = 100;
    setAuthProgress(i);
    if (i >= 100) {
      clearTimeout(timeout);
      return;
    }
    timeout = setTimeout(() => {
      startAuthProgress(i + 1);
    }, 160);
  };
  //space authorize
  const onAuthorize = async () => {
    console.log("******************************onAuthorize start");
    let isOK = getAddr();
    if (!isOK) return;
    util.loading(true);
    setSpaceAuthing(true);
    //
    await web3Enable("my cool dapp");
    const injector = await web3FromAddress(addr);
    try {
      //space authorize
      let apiS = api;
      if (!api || !api.tx || !api.tx.oss) {
        apiS = await getAPI();
        setAPI(apiS);
      }
      let hasStartProgress = false;
      apiS.tx.oss
        .authorize("cXiKthh2dyY1taTydtdxiqQwXY1HKZcXvYGmjS2UmuPi2qNDS")
        .signAndSend(
          addr,
          { signer: injector.signer },
          (status) => {
            console.log("status****", status);
            if (!hasStartProgress) {
              hasStartProgress = true;
              startAuthProgress(1);
            }
            try {
              console.log("status.status.toJSON()", status.status.toJSON());
              console.log("isFinalized", status.isFinalized);
              if (status.isFinalized) {
                //ok
                startAuthProgress(100);
                util.loading(false);
                setSpaceAuthing(false);
                setSpaceAuth(true);
                querySpace();
              }
            } catch (e) {
              util.alert(e.message);
              util.loading(false);
              setSpaceAuthing(false);
              console.log(e);
            }
          },
          (e) => {
            console.log("===========", e);
          }
        );
      console.log("******************************onAuthorize end");
    } catch (e) {
      util.loading(false);
      setSpaceAuthing(false);
      util.alert(e.message);
      console.log("err***********");
      console.log(e);
    }
  };

  const queryMyBalance = async () => {
    let apiS = api;
    if (!api || !api.query || !api.query.system) {
      apiS = await getAPI();
      setAPI(apiS);
    }
    if (!addr) {
      getAddr();
    }
    const { nonce, data: balance } = await apiS.query.system.account(addr);
    console.log("balance", balance);
    console.log(`balance of ${balance.free} and a nonce of ${nonce}`);
    setMyBalance(formatBalance(balance));
  };

  const querySpace = async (addr) => {
    try {
      //space query
      if (!addr) {
        console.log("querySpace return by addr is null");
        return;
      }
      let apiS = await getAPI();
      setAPI(apiS);
      console.log("query userOwnedSpace", addr);
      let result = await apiS.query.fileBank.userOwnedSpace(addr);
      let spaceJson = result.toJSON();
      console.log("spaceJson", spaceJson);
      setSpace(spaceJson);
    } catch (e) {
      console.log(e);
    }
  };
  const onSubmit = async () => {
    if (!addr) {
      return util.alert("Relogin please.");
    }
    setLoading(true);
    let result = await controlBuy(fileHash, detail.price);
    setLoading(false);
    if (result) {
      navigate("/detail/" + fileHash);
    }
  };
  const onOpenBuySpaceModel = () => {
    setIsModalOpen(true);
    queryMyBalance();
  };
  // confirm tx
  const handleOk = async () => {
    if (buySize < 1) {
      return util.alert("Please fill quantity");
    }
    // setIsModalOpen(false);
    //buy space
    setBuySpacing(true);
    util.loading(true);
    await web3Enable("my cool dapp");
    const injector = await web3FromAddress(addr);
    let event =
      space && space.totalSpace > 0
        ? api.tx.fileBank.expansionSpace
        : api.tx.fileBank.buySpace;
    event(buySize).signAndSend(
      addr,
      { signer: injector.signer },
      (status) => {
        console.log("status****", status);
        try {
          console.log("status.status.toJSON()", status.status.toJSON());
          console.log("isFinalized", status.isFinalized);
          if (status.isFinalized) {
            //ok
            setBuySpacing(false);
            util.loading(false);
            util.showOK();
            setIsModalOpen(false);
            setInterval(() => {
              querySpace(addr);
              queryMyBalance();
            }, 1000);
          }
        } catch (e) {
          util.alert(e.message);
          util.loading(false);
          setBuySpacing(false);
        }
      },
      (e) => {
        console.log("===========", e);
      }
    );
    querySpace();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onNumberChange = (e) => {
    setBuySize(e);
  };

  return (
    <div className={className}>
      <Modal
        title="Buy Store Space"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={buySpacing}
            disabled={buySpacing}
            onClick={handleOk}
          >
            Submit
          </Button>,
        ]}
      >
        <div>
          <p style={{ marginTop: "20px", color: "#888" }}>
            Estimated 30 TCESS / GiB / 30 days
          </p>
          <div style={{ lineHeight: "20px" }}>
            Buy Size{" "}
            <InputNumber
              min={1}
              max={10000}
              defaultValue={1}
              onChange={onNumberChange}
            />{" "}
            GiB
          </div>
          <div style={{ lineHeight: "20px", marginTop: "30px", color: "#aaa" }}>
            Total{" "}
            <font style={{ fontSize: "30px", color: "#000" }}>
              {" "}
              {buySize * 30}{" "}
            </font>{" "}
            TCESS
          </div>
          <div style={{ lineHeight: "20px", marginTop: "30px", color: "#aaa" }}>
            Your balance{" "}
            <font style={{ fontSize: "30px", color: "#000" }}>
              {" "}
              {myBalance}{" "}
            </font>{" "}
            TCESS
          </div>
          <div>
            {myBalance < buySize * 30 ? (
              <Alert
                message="Sorry, your tcess is running low"
                type="error"
                showIcon
              />
            ) : (
              ""
            )}
          </div>
        </div>
      </Modal>
      <h1>Buy NFT</h1>
      <div className="player-box">
        {detail.fileHash ? (
          <video
            style={{ backgroundColor: "#000" }}
            autoPlay={true}
            width="100%"
            height="100%"
            controls
          >
            <source src={formatVideoUrl(detail.fileHash)} type="video/mp4" />
          </video>
        ) : (
          ""
        )}
      </div>
      <h4>{detail.fileName}</h4>
      <div className="hold"></div>
      <div>
        <div className="line">
          <h2>Price (CESS)</h2>
          <div>
            {detail.price} <font>CESS</font>
          </div>
        </div>
        <div className="line">
          <h2>File Size</h2>
          <div>
            {formatterSize2(detail.size).size}{" "}
            <font>{formatterSize2(detail.size).ext}</font>
          </div>
        </div>
        <div className="line">
          <h2>Available Size</h2>
          {space && space.remainingSpace ? (
            <div>
              {formatterSize2(space.remainingSpace).size}{" "}
              <font>{formatterSize2(space.remainingSpace).ext}</font>
            </div>
          ) : (
            <div>--</div>
          )}
        </div>
        <div className="line">
          <h2>Buy Space</h2>
          {space &&
          space.remainingSpace &&
          space.remainingSpace >= detail.size ? (
            <div style={{ color: "green" }}>Enough space</div>
          ) : (
            <div>
              <Button
                style={{
                  width: 140,
                  backgroundColor: "rgb(211,243,108)",
                  border: "none",
                }}
                onClick={onOpenBuySpaceModel}
              >
                Buy Store Space
              </Button>
            </div>
          )}
        </div>
        <div className="line">
          <h2 style={{ color: "red" }}>
            Total：{detail.price} <font>CESS</font>
          </h2>
          <div>
            {space &&
            space.remainingSpace &&
            space.remainingSpace >= detail.size ? (
              <div style={{ color: "green" }}>
                <Button
                  disabled={addr == detail.owner || loading}
                  loading={loading}
                  size="large"
                  type="primary"
                  onClick={onSubmit}
                >
                  {addr == detail.owner ? "You are owner" : "Buy Now"}
                </Button>
              </div>
            ) : (
              <span style={{ color: "red" }}>Not enough space</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default styled(Home)`
  width: 600px;
  display: block;
  overflow: hidden;
  margin: 0px auto;
  padding: 70px 20px 20px;
  h1 {
    font-size: 40px;
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
  .empty {
    padding: 100px;
  }
  .line {
    display: block;
    clear: both;
    overflow: hidden;
    width: 100%;
    line-height: 40px;
    border-bottom: 1px solid #eee;
    margin: 10px 0;
    h2 {
      width: 50%;
      float: left;
      font-size: 18px;
    }
    div {
      width: 50%;
      float: right;
      text-align: right;
      font-size: 18px;
      font {
        color: #999;
      }
    }
  }
`;
