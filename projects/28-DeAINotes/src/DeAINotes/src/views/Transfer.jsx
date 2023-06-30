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
  Tabs,
  Empty,
} from "antd";
import React, { useState, useEffect } from "react";
import PolkadotLogo from "../statics/polkadot-logo.svg";
import { getAPI, getKeyring } from "../utils/polkadot";
import Identicon from "@polkadot/react-identicon";
import Img from "../components/Img";
import { alist, transfer } from "../services/nft";
import * as util from "../utils";
import { formatImgUrl, formatterSize, formatAddress } from "../utils/formatter";
import CessMiniLogo from "../statics/imgs/cess-mini-logo.png";
import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
} from "@polkadot/extension-dapp";
import { contractTransfer } from "../services/contract/index";

function Home({ className }) {
  document.title = "Transfer";
  let navigate = useNavigate();
  const { fileHash } = useParams();

  const [loading, setLoading] = useState(false);
  const [fromAddr, setFromAddr] = useState("");
  const [toAddr, setToAddr] = useState("");

  useEffect(() => {
    let addr = localStorage.getItem("addr");
    setFromAddr(addr);
  }, []);
  const onInput = (e) => {
    let v = e.target.value;
    console.log(v);
    setToAddr(v);
  };
  const onSubmit = async () => {
    if (!toAddr) {
      return util.alert("Recipient address is empty.");
    }
    if (fromAddr == toAddr) {
      return util.alert("You can't transfer it to yourself");
    }
    setLoading(true);
    let txHash = await contractTransfer(toAddr, fileHash, function (status) {
      util.loading(false);
      util.loading(true, "Curr status:" + status);
    });
    if(!txHash){
      return util.alert("Transfer contract return fail.");
    }
    let data = {
      filehash: fileHash,
      to: toAddr,
      txhash: txHash,
    };
    let result = await transfer(data);
    setLoading(false);
    if (result.ok) {
      util.alert("Transfer NFT success.", function () {
        navigate("/my");
      });
    } else {
      util.alert(result.error.message);
    }
  };

  return (
    <div className={className}>
      <h1>Transfer</h1>
      <h5>
        Please confirm that the receiving address has available storage space
      </h5>
      <div>
        <div className="hold"></div>
        <div className="hold"></div>
        <div className="hold"></div>
        <div className="hold"></div>
        <div className="hold"></div>
        <h2>Recipient Address</h2>
        <div className="hold"></div>
        <div>
          <Input
            placeholder="to address"
            onChange={onInput}
            onKeyUp={onInput}
            onInput={onInput}
          />
        </div>
        <div className="hold"></div>
        <div>
          <Button type="primary" onClick={onSubmit}>
            Transfer
          </Button>
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
    font-size: 50px;
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
`;
