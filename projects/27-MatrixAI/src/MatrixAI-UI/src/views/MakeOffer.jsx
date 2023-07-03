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
import { refreshBalance } from "../dal/account";

function Home({ className }) {
  const { id } = useParams();
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState();

  useEffect(() => {
    document.title = "Make Offer";
    let addr = localStorage.getItem("addr");
    if(!addr){
      window.showLoginBox();
    }
  }, [id]);
  const onInput = (e) => {
    let v = parseFloat(e.target.value);
    if(!e.target.value||isNaN(e.target.value)){
      v=0;
    }
    if (v <= 0) {
      setPrice(0);
      return util.showError("The price must be an integer greater than 0");
    }
    setPrice(v);
  };
  const onSubmit = async () => {
    if(!price) return;
    util.loading(true);
    setLoading(true);    
    let tprice=price*1000000000000;
    let api = await getAPI();
    let addr = localStorage.getItem("addr");
    await web3Enable("my cool dapp");
    const injector = await web3FromAddress(addr);
    api.tx.hashrateMarket
      .makeOffer(id, tprice)
      .signAndSend(
        addr,
        { signer: injector.signer },
        (status) => {
          console.log("status****", status);
          try {
            console.log("status.status.toJSON()", status.status.toJSON());
            console.log("isFinalized", status.isFinalized);
            if (status.isFinalized) {
              //ok
              util.loading(false);
              setLoading(false);
              util.showOK("Make offer success!");
              refreshBalance();
              window.freshBalance();
              navigate("/mydevice/");
            }
          } catch (e) {
            util.alert(e.message);
            util.loading(false);
            setLoading(false);
          }
        },
        (e) => {
          console.log("===========", e);
        }
      )
      .then(
        (t) => console.log,
        (ee) => {
          util.loading(false);
          setLoading(false);
          // setBuySpacing(false);
        }
      );
  };

  return (
    <div className={className}>
      <div className="hold"></div>
      <div className="con">
        <h1 className="title">Make Offer</h1>
        <div className="myform">
          <div className="form-row">
            <div className="row-txt">Price (per Core hour)</div>
            <Input
              onChange={onInput}
              type="number"
              className="my-input"
              placeholder="Enter an integer"
              max={99999}
            />
          </div>
          <div className="form-row">
            <div className="row-txt drow">
              <img src="/img/dot.svg" />
              <span className="num">{price}</span>
              <label>MAI</label>
            </div>
          </div>
          <div className="form-row">
            <Button
              loading={loading}
              disabled={loading}
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
