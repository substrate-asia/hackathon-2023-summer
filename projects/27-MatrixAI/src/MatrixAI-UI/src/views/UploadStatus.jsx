import styled from "styled-components";
import _ from "lodash";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import {
  PlayCircleOutlined,
  CloudUploadOutlined,
  WalletOutlined,
  ClockCircleOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import StoreMinerList from "../components/StoreMinerList";
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
import store from "../utils/store";
import {
  formatImgUrl,
  formatterSize,
  formatAddress,
  formatAddressLong,
} from "../utils/formatter";
import CessMiniLogo from "../statics/imgs/cess-mini-logo.png";
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
import { connectStart } from "../utils/ws";
import moment from "moment";
import { create } from "../services/nft";

let uploadInfo = {};

function Home({ className }) {
  document.title = "NFT Upload status";
  let navigate = useNavigate();

  const [isFinish, setIsFinish] = useState(false);
  const [progress, setProgress] = useState(0);
  const [state, setState] = useState(false);
  const [addr, setAddr] = useState("");
  const [fileHash, setFileHash] = useState("");
  const [miners, setMiners] = useState([]);
  const [logs, setLogs] = useState([]);

  const [stepId, setStepId] = useState(0);

  const stepList = [
    { id: 1, key: "sharding", name: "Processing file sharding" },
    {
      id: 2,
      key: "sharded",
      name: "Slice processing completed",
    },
    { id: 3, key: "stashing", name: "Processing file store" },
    { id: 4, key: "bucketing", name: "Processing OSS bucket" },
    { id: 5, key: "declaring", name: "Processing file declaring" },
    {
      id: 6,
      key: "thunder",
      name: "File thunder to the chain",
    },
    { id: 7, key: "uploading", name: "File uploading" },
    { id: 8, key: "storing", name: "Miners are processing" },
    {
      id: 9,
      key: "stored",
      name: "The file has saved by miner",
    },
    { id: 10, key: "finish", name: "Upload Completed." },
  ];

  const goOneStep = (step) => {
    logs.push({
      time: moment().format("YYYY-MM-DD HH:mm:ss"),
      step: step,
    });

    if (step == "finish") {
      setIsFinish(true);
    }
    let prog = 0;
    let tmp = stepList.find((t) => t.key == step);
    if (tmp && tmp.id) {
      prog = tmp.id;
    }
    setLogs(logs);
    setProgress(prog * 10);
    setStepId(prog);
    setState(step);
  };
  useEffect(() => {
    let addr = localStorage.getItem("addr");
    setAddr(addr);
    let obj = store.get("uploading");
    if (!obj) {
      return util.alert("Not found uploading video.");
    }
    if (!obj.filename) {
      console.log(obj);
      return util.alert("params error");
    }
    uploadInfo = obj;
    console.log("obj.filehash", obj);
    if (!obj.filehash) {
      return util.alert("Filehash not found.");
    }
    connectStart(
      obj.filehash,
      (data) => {
        if (data.type == 1) {
          goOneStep(data.msg.step);
          return;
        }
        if (data.msg.fileHash) {
          setFileHash(data.msg.fileHash);
          uploadInfo.filehash = data.msg.fileHash;
          save(data.msg.fileHash);
        }
        let finish = false,
          lastStep = "";
        if (data.msg.steps) {
          data.msg.steps.forEach((d, i) => {
            let step = d.step;
            lastStep = d.step;
            if (d.data) {
              step += " " + JSON.stringify(d.data);
            }
            if (d.msg) {
              step += " " + d.msg;
            }
            logs.push({
              time: moment().format("YYYY-MM-DD HH:mm:ss"),
              step: step,
            });
            if (d.step == "finish") {
              finish = true;
            }
          });
          setLogs(logs);

          let prog = 0;
          let tmp = stepList.find((t) => t.key == lastStep);
          if (tmp && tmp.id) {
            prog = tmp.id;
          } else {
            console.log("fffffffffffffffffffff", "[" + lastStep + "]");
          }
          setProgress(prog * 10);
          setStepId(prog);
          setState(lastStep);
        }
        setIsFinish(finish);

        if (finish) {
          setProgress(100);
        }
        setState(data.msg.steps[data.msg.steps.length - 1].step);
        if (data.msg.miners) {
          setMiners(data.msg.miners);
        }
      },
      () => {
        util.alert("Video upload Completed.", function () {
          navigate("/my");
        });
      }
    );
  }, []);
  const save = async (fileHash) => {
    util.loading(true);
    uploadInfo.filehash = fileHash;
    if (!uploadInfo.filename) {
      console.log("uploadInfo", uploadInfo);
      return util.alert("params error.");
    }
    let result = await create(uploadInfo);
    console.log("result", result);
    util.loading(false);
    if (result.ok) {
      util.showOK("Save Success");
    } else {
      // util.alert(result.error.msg);
      if (result.error.msg.indexOf("metadata is exist") != -1) {
        util.alert("The NFT video is exist.");
      } else {
        util.alert(result.error.msg);
      }
    }
  };
  return (
    <div className={className}>
      <div className="top block">
        <div className="top-left">
          <div className="top-left-1">
            <h2>Overview</h2>
            <div className="box-1">
              <div className="box-1-left">
                <label>{progress}%</label>
                <div>Upload Progress</div>
                <span>{state}</span>
              </div>
              <div className="box-1-right">
                {stepList.map((t) => {
                  return (
                    <div
                      className={
                        stepId < t.id - 1
                          ? "box-line-wait"
                          : stepId == t.id - 1
                          ? "box-ling-doing"
                          : "box-line-ok"
                      }
                      key={t.id}
                    >
                      <span className="box-line-left">
                        {t.id}. {t.name}
                      </span>
                      <label className="box-line-right">
                        {stepId < t.id - 1 ? (
                          <ClockCircleOutlined />
                        ) : stepId == t.id - 1 ? (
                          <LoadingOutlined />
                        ) : (
                          <CheckCircleOutlined />
                        )}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
            <div></div>
          </div>
          <div className="hold"></div>
          <div className="top-left-2">
            <div className="top-left-2-1">File Hash</div>
            <div className="top-left-2-2">
              {fileHash ? formatAddressLong(fileHash) : "--"}
            </div>
            {fileHash ? (
              <div className="top-left-2-3" onClick={() => util.copy(fileHash)}>
                Copy
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="top-right">
          <h2>Detail</h2>
          <div className="blackbord">
            {logs.map((t, i) => {
              return (
                <div key={i}>
                  <span>【{t.time}】</span>
                  <span>{t.step}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="hold"></div>
      <div className="hold"></div>
      <h2>File Storage Details</h2>
      <div>
        <StoreMinerList items={miners} />
      </div>
      <div className="hold"></div>
      <div className="hold"></div>
      <h2>Video</h2>
      <div className="player-box">
        {fileHash ? (
          <video
            autoPlay={true}
            style={{ backgroundColor: "#000" }}
            width="100%"
            height="100%"
            controls
          >
            <source src={formatVideoUrl(fileHash)} type="video/mp4" />
          </video>
        ) : (
          <Empty />
        )}
      </div>
    </div>
  );
}

export default styled(Home)`
  width: 1200px;
  display: block;
  overflow: hidden;
  margin: 0px auto;
  padding: 70px 20px 20px;
  h1 {
    font-size: 20px;
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
    clear: both;
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
  h2 {
    font-size: 16px;
  }
  .top-left {
    width: 48%;
    float: left;
    .top-left-1 {
      .box-1 {
        display: block;
        overflow: hidden;
        border: 1px solid #eee;
        .box-1-left {
          width: 30%;
          text-align: center;
          float: left;
          padding: 83px 0;
          background: linear-gradient(
            180deg,
            rgba(210, 243, 111, 1) 1%,
            rgba(201, 244, 177, 1) 51%,
            rgba(192, 245, 241, 1) 100%
          );
          label {
            font-size: 52px;
          }
          div {
            font-size: 12px;
          }
          span {
            width: 80%;
            height: 30px;
            line-height: 30px;
            display: block;
            overflow: hidden;
            clear: both;
            margin: 60px auto 0;
            background-color: #000;
            color: #fff;
            text-align: center;
            border-radius: 20px;
          }
        }
        .box-1-right {
          width: 70%;
          float: right;
          .box-line-wait {
            width: 100%;
            line-height: 32px;
            border-bottom: 1px solid #eee;
            display: block;
            overflow: hidden;
            clear: both;
            .box-line-left {
              width: 80%;
              float: left;
              color: #858585;
              padding: 0 7px;
            }
            .box-line-right {
              width: 11%;
              float: right;
              text-align: right;
              margin-right: 10px;
              color: #858585;
            }
          }
          .box-ling-doing {
            width: 100%;
            line-height: 32px;
            border-bottom: 1px solid #eee;
            display: block;
            overflow: hidden;
            clear: both;
            .box-line-left {
              width: 80%;
              float: left;
              color: #fcd600;
              padding: 0 7px;
            }
            .box-line-right {
              width: 11%;
              float: right;
              text-align: right;
              margin-right: 10px;
              color: #fcd600;
            }
          }
          .box-line-ok {
            width: 100%;
            line-height: 32px;
            border-bottom: 1px solid #eee;
            display: block;
            overflow: hidden;
            clear: both;
            .box-line-left {
              width: 80%;
              float: left;
              color: #19ce95;
              padding: 0 7px;
            }
            .box-line-right {
              width: 11%;
              float: right;
              text-align: right;
              margin-right: 10px;
              color: #19ce95;
            }
          }
        }
      }
    }
    .top-left-2 {
      background-color: #000;
      color: #fff;
      position: relative;
      line-height: 50px;
      height: 50px;
      font-size: 14px;
      .top-left-2-1 {
        width: 30%;
        float: left;
        text-align: center;
      }
      .top-left-2-2 {
        width: 60%;
        float: left;
        text-indent: 10px;
        border-left: 1px solid #eee;
      }
      .top-left-2-3 {
        width: 60px;
        height: 30px;
        line-height: 30px;
        background-color: rgba(211, 243, 108, 1);
        color: #000;
        text-align: center;
        position: absolute;
        top: 9px;
        right: 10px;
        cursor: pointer;
      }
    }
  }
  .top-right {
    width: 50%;
    float: right;
    .blackbord {
      display: block;
      height: 391px;
      background-color: #000;
      padding: 10px;
      border-radius: 6px;
      color: #00ff16;
      font-size: 16px;
      overflow-y: auto;
      word-break: break-all;
      overflow-x: hidden;
    }
  }
  .player-box {
    width: 48%;
  }
`;
