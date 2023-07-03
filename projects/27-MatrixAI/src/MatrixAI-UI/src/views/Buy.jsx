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
import { Input, Alert, Button, message, notification, Empty } from "antd";
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
import { getDetail } from "../dal/machine";
import { placeOrder } from "../dal/order";
import store from "../utils/store";

let formData = {};

function Home({ className }) {
  const { id } = useParams();
  document.title = "Edit model";
  let addr = localStorage.getItem("addr");
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [entity, setEntity] = useState({});
  const [balance, setBalance] = useState(0);
  const onInput = (e) => {
    let v = e.target.value;
    let n = e.target.dataset.name;
    formData[n] = v;
    if (n == "duration" && v) {
      let price = parseInt(entity.price);
      console.log("entity", entity);
      v = parseInt(v);
      if (v <= 0) {
        setAmount(0);
        return util.showError("The duration must be an integer greater than 0");
      }
      formData[n] = v;
      setAmount(v * price*entity.AvailableCore);
    }
  };
  useEffect(() => {
    let addr = localStorage.getItem("addr");
    if (!addr) {
      window.showLoginBox();
    }
  }, []);
  useEffect(() => {
    let account = store.get("account");
    setBalance(account.balance);
    getDetail(id).then((t) => {
      setEntity(t);
      if (t.addr == addr) {
        util.alert("Unable to purchase one's own machine");
        navigate("/market/");
      }
    });
  }, [id]);
  const valit = () => {
    if (!formData.taskName) {
      return "Task name is required.";
    }
    if (!formData.duration) {
      return "Duration is required.";
    }
    if (!formData.algorithm) {
      return "Algorithm is required.";
    }
    if (!formData.dataUrl) {
      return "DATA uploading link is required.";
    }
    if ( amount == 0) {
      return "Payment token greater than 0.";
    }
    if (amount / 1000000000000 > balance) {
      return "Payment token greater than balance.";
    }
    return null;
  };
  const onSubmit = async () => {
    let vmsg = valit();
    if (vmsg) {
      return util.alert(vmsg);
    }
    setLoading(true);
    console.log({ formData });
    await placeOrder(entity, formData, amount, function (isOk) {
      setLoading(false);
      navigate("/myorder");
      window.freshBalance();
      if (isOk) {
      } else {
      }
    });
  };

  return (
    <div className={className}>
      <div className="hold"></div>
      <div className="con">
        <h1 className="title">Edit model</h1>
        <div className="myform">
          <div className="form-row">
            <div className="row-txt">Task Name *</div>
            <Input
              className="my-input"
              data-name="taskName"
              onChange={onInput}
              onKeyUp={onInput}
              placeholder="Must be 4--45 characters"
            />
          </div>
          <div className="form-row">
            <div className="row-txt">Duration *</div>
            <Input
              type="number"
              className="my-input"
              data-name="duration"
              onChange={onInput}
              style={{ width: "90%" }}
              placeholder="Enter an integer"
            />{" "}
            Hour
          </div>
          <div className="form-row">
            <div className="row-txt">Core  *</div>
            <Input
              className="my-input"
              data-name="taskName"
              readOnly={true}
              value={entity?.AvailableCore}
            />
          </div>
          <div className="form-row">
            <div className="row-txt">Algorithm *</div>
            <select
              className="my-select"
              data-name="algorithm"
              onChange={onInput}
            >
              <option value="">-select algorithm-</option>
              {entity?.metadata?.AIModel?.map((t, i) => {
                return (
                  <option value={t.ModelName + t.Version} key={i}>
                    {t.ModelName}-{t.Version}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-row">
            <div className="row-txt">
              DATA Uploading Link *{" "}
              <a
                href="https://cess.cloud/deshare.html"
                className="right-link"
                target="_blank"
              >
                Use CESS to Save the Data
              </a>
            </div>
            <Input
              onChange={onInput}
              data-name="dataUrl"
              onKeyUp={onInput}
              className="my-input"
              placeholder="Basic usage"
            />
          </div>
          <div className="form-row">
            <div className="row-txt">Total</div>
            <div className="row-txt drow">
              <img src="/img/dot.svg" />
              <span className="num">{parseInt(amount / 1000000000000)}</span>
              <label>MAI</label>
            </div>
            <div
              className="row-txt"
              style={{ fontSize: "13px", color: "#454545" }}
            >
              Available Amount: {balance} MAI
            </div>
          </div>
          <div className="form-row">
            <Button
              loading={loading}
              disabled={loading}
              style={{ width: 130 }}
              type="primary"
              onClick={onSubmit}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
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
`;
