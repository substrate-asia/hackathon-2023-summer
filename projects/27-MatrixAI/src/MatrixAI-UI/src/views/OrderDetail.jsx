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
import { Input, Alert, Button, message, Spin, Empty } from "antd";
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
import {
  formatArr,
  formatOne,
  formatDataSource,
} from "../utils/format-show-type";
import { getDetail } from "../dal/order";

function Home({ className }) {
  const { id } = useParams();
  document.title = "Order detail";
  let navigate = useNavigate();
  const [showMachineDetail, setShowMachineDetail] = useState(0);
  const [record, setRecord] = useState(null);
  useEffect(() => {
    getDetail(id).then((t) => {
      setRecord(t);
    }, console.log);
  }, [id]);

  return (
    <div className={className}>
      <div className="hold"></div>
      <div className="con">
        <h1 className="title">Details</h1>
        <div className="myform" style={{ width: "70%" }}>
          {record ? (
            <div className="detail-table">
              <div className="detail-row">
                <span className="detail-row-left">Task Name</span>
                <span className="detail-row-right">
                  {record.metadata.taskName}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-row-left">Start Time</span>
                <span className="detail-row-right">
                  {record.metadata.buyTime}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-row-left">Ending Time</span>
                <span className="detail-row-right">
                  {record.metadata.completeTime}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-row-left">Hashrate Provider</span>
                <span className="detail-row-right">{record.seller}</span>
              </div>
              <div className="detail-row">
                <span className="detail-row-left">Machine Details</span>
                <span className="detail-row-right" onClick={()=>setShowMachineDetail(record.machine)} style={{textDecoration:"underline",cursor:'pointer'}}>View</span>
              </div>
              <div className="detail-row">
                <span className="detail-row-left">Algorithm</span>
                <span className="detail-row-right">
                  {record.metadata.algorithm}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-row-left">Model Uploading Link</span>
                <span className="detail-row-right">
                  <a
                    href={record.metadata.dataUrl}
                    style={{ color: "#fff" }}
                    target="_blank"
                  >
                    {record.metadata.dataUrl}
                  </a>
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-row-left">TFLOPS</span>
                <span className="detail-row-right">
                  {record.machine.TFLOPS}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-row-left">Core</span>
                <span className="detail-row-right">
                  {record.machine.AvailableCore}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-row-left">Duration(h)</span>
                <span className="detail-row-right">
                  {record.metadata.duration}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-row-left">Price(MAT/ch)</span>
                <span className="detail-row-right">{record.metadata.price}</span>
              </div>
              <div className="detail-row">
                <span className="detail-row-left">Total(MAI)</span>
                <span className="detail-row-right">{record.total}</span>
              </div>
              <div className="detail-row">
                <span className="detail-row-left">Status</span>
                <span
                  className="detail-row-right"
                  style={{ color: "#00dd1e", fontWeight: "bold" }}
                >
                  {record.status}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-row-left">Result</span>
                <span className="detail-row-right">
                  {record.metadata.modelUrl ? (
                    <a
                      className="down-link"
                      href={record.metadata.modelUrl}
                      target="_blank"
                    >
                      Download
                    </a>
                  ) : (
                    ""
                  )}
                </span>
              </div>
            </div>
          ) : (
            <Spin />
          )}

          <div className="form-row">
            <Button
              type="primary"
              style={{ backgroundColor: "#fff", width: 130 }}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </div>
        </div>
      </div>

      {showMachineDetail ? (
        <div className="mymodal">
          <i
            className="btn-close fa fa-close"
            onClick={() => setShowMachineDetail(0)}
          ></i>
          <div className="mymodal-title">Machine Details</div>
          <div className="mymodal-body">
            <div className="detail-table">
              <div className="detail-row">
                <span className="detail-row-left">CPU</span>
                <span className="detail-row-right">
                  {showMachineDetail.CPU}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-row-left">CPU Speed</span>
                <span className="detail-row-right">
                  {showMachineDetail.CPUSpeed}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-row-left">Graphics Coprocessor</span>
                <span className="detail-row-right">
                  {showMachineDetail.GraphicsCoprocessor}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-row-left">TFLOPS</span>
                <span className="detail-row-right">
                  {showMachineDetail.TFLOPS}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-row-left">Hard Drive</span>
                <span className="detail-row-right">
                  {showMachineDetail.HardDrive}
                </span>
              </div>
            </div>
          </div>
          <div className="btn-row">
            <span
              className="btn btn-primay"
              onClick={() => setShowMachineDetail(0)}
            >
              Back
            </span>
          </div>
        </div>
      ) : (
        ""
      )}

    </div>
  );
}

export default styled(Home)`
  display: block;
  background-color: #000;
  color: #fff;
  .hold {
    display: block;
    overflow: hidden;
    width: 100%;
    height: 56px;
    clear: both;
  }
  .mini-btn {
    border: 1px solid #fff;
  }
  .con {
    width: 1210px;
    margin: 10px auto;
    display: block;
    overflow: hidden;
    .title {
      font-family: "Montserrat Bold", "Montserrat", sans-serif;
      font-weight: 700;
      font-style: normal;
      font-size: 28px;
      color: #ffffff;
      margin-top: 25px;
      line-height: 70px;
    }
  }
  .block {
    display: block;
    overflow: hidden;
  }
  .mini-btn {
    color: #fff;
    border: 1px solid #fff;
    border-radius: 4px;
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
  }
  .ant-btn-primary {
    background-color: rgba(148, 214, 226, 1) !important;
    color: #000;
    height: 50px;
    line-height: 40px;
  }
  .mytable {
    display: table;
    border: 1px solid #fff;
    border-radius: 10px;
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
    overflow: hidden;
    .link {
      color: #fff;
      cursor: pointer;
    }
    .btn-link {
      color: #fff;
      cursor: pointer;
      text-decoration: underline;
    }
    th {
      background-color: #92d5e1;
      color: #000;
      height: 40px;
      line-height: 40px;
      text-align: left;
      padding: 0 10px;
    }
    tr td {
      border-bottom: 1px solid #fff;
      border-collapse: collapse;
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
    }
    tr:last-children {
      td {
        border-bottom: none;
      }
    }
  }
  .down-link {
    width: 126px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    color: #000;
    background-color: #92d5e1;
    border-radius: 5px;
    display: block;
    margin-top: 10px;
  }
`;
