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
import { Modal, Alert, Menu, message, Table, Empty } from "antd";
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
import { getList } from "../dal/machine";
import { getOrderList } from "../dal/order";
import { formatBalance } from "../utils/formatter";

let addr = localStorage.getItem("addr");

function Home({ className }) {
  document.title = "My Order";
  let navigate = useNavigate();
  const [list, setList] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMachineDetail, setShowMachineDetail] = useState(0);

  const onItemBtnClick = (text, record, index) => {
    navigate('/order-detail/'+record.id);
  };
  let columnsS = [
    {
      title: "Started Time",
      width: "24%",
      key: "addr",
      render: (text, record, index) => {
        return record.metadata?.buyTime;
      },
    },
    {
      title: "Task Name",
      width: "10%",
      key: "taskName",
      render: (text, record, index) => {
        return record.metadata?.taskName;
      },
    },
    {
      title: "TFLOPS",
      width: "12%",
      key: "TFLOPS",
      render: (text, record, index) => {
        return record.machine?.TFLOPS;
      },
    },
    {
      title: "Price(MAI/ch)",
      width: "14%",
      key: "price",
      render: (text, record, index) => {
        return formatBalance(record.machine?.price);
      },
    },
    {
      title: "Duration(h)",
      width: "12%",
      key: "AvailableCore",
      render: (text, record, index) => {
        return record.metadata?.duration;
      },
    },
    {
      title: "Total(MAI)",
      width: "14%",
      key: "totalStr"
    },
    {
      title: "Status",
      width: "24%",
      key: "status",
      render: (text, record, index) => {
        if (record.status == "Completed") {
          return (
            <span style={{ color: "#00d32e", fontWeight: "bold" }}>
              {record.status}
            </span>
          );
        } else {
          return (
            <span style={{ color: "#fff", fontWeight: "bold" }}>
              {record.status}
            </span>
          );
        }
      },
    },
    {
      title: "Operation",
      width: "24%",
      key: "id",
      render: (text, record, index) => {
        return (
          <span
            className="mini-btn"
            onClick={() => onItemBtnClick(text, record, index)}
          >
            Details
          </span>
        );
      },
    },
  ];

  const myinit = async () => {
    setLoading(true);
    let addr = localStorage.getItem("addr");
    let list2 = await getOrderList(addr);
    // console.log('************order list',list2);
    formatDataSource(columnsS, list2);
    setColumns(columnsS);
    setList(list2);
    console.log("list2", list2);
    setLoading(false);
  };

  useEffect(() => {
    let addr = localStorage.getItem("addr");
    if(!addr){
      window.showLoginBox();
    }
  }, []);

  useEffect(() => {
    myinit();
  }, []);

  return (
    <div className={className}>
      <div className="hold"></div>
      <div className="con">
        <h1 className="title">My Order</h1>
        <div className="con-table">
          <table className="mytable">
            <thead className="table-thead">
              <tr>
                {columns.map((c) => {
                  return (
                    <th key={c.title} style={{ width: c.width }}>
                      {c.title}
                    </th>
                  );
                })}
              </tr>
            </thead>
            {list.length == 0 ? (
              <tbody>
                <tr>
                  <td colSpan={columns.length} style={{ textAlign: "center" }}>
                    <Empty
                      description={"No orders yet"}
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {list.map((d, index) => {
                  return (
                    <tr key={index}>
                      {columns.map((c, i) => {
                        if (c.render) {
                          return (
                            <td style={{ width: c.width }} key={i}>
                              {c.render(d[c.key], d, i)}
                            </td>
                          );
                        } else {
                          return (
                            <td key={i} style={{ width: c.width }}>
                              {d[c.key]}
                            </td>
                          );
                        }
                      })}
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
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
  overflow: hidden;
  width: 100%;
  height: 100vh;
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
      padding-left: 36px;
      background-image: url(/img/market/2.png);
      background-repeat: no-repeat;
      background-size: 26px;
      background-position: left;
      margin-top: 25px;
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
      overflow: hidden;
    }
    tr:last-children {
      td {
        border-bottom: none;
      }
    }
  }
`;
