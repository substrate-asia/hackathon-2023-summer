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
import { alist, changeStatus } from "../services/nft";
import * as util from "../utils";
import { formatImgUrl, formatterSize, formatAddress } from "../utils/formatter";
import CessMiniLogo from "../statics/imgs/cess-mini-logo.png";
import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
} from "@polkadot/extension-dapp";
import { contractAsk } from "../services/contract/index";

function Home({ className }) {
  document.title = "List NFT for sale";
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
      return util.alert("Price is empty.");
    }
    util.loading(true);
    setLoading(true);
    let price = parseFloat(toAddr) * 1000000000000;
    try {
      let txHash = await contractAsk(fileHash, price, function (status) {
        util.loading(false);
        util.loading(true, "curr status:" + status);
      });
      util.loading(false);
      let data = {
        filehash: fileHash,
        txhash: txHash,
        status: "list",
        price: price.toString(),
      };
      util.loading(true, "curr status:update status");
      let result = await changeStatus(data);
      util.loading(false);
      setLoading(false);
      if (result.ok) {
        util.alert("List NFT for sale success.", function () {
          navigate("/my");
        });
      } else {
        util.alert(result.error.message);
      }
    } catch (e) {
      console.log(e);
      util.loading(false);
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <h1>List NFT for sale</h1>
      <h5>
        Please confirm that the receiving address has available storage space
      </h5>
      <div>
        <div className="hold"></div>
        <div className="hold"></div>
        <div className="hold"></div>
        <div className="hold"></div>
        <div className="hold"></div>
        <h2>Price (CESS)</h2>
        <div className="hold"></div>
        <div>
          <Input
            placeholder="enter a number"
            onChange={onInput}
            onKeyUp={onInput}
            onInput={onInput}
          />
        </div>
        <div className="hold"></div>
        <div>
          <Button
            type="primary"
            loading={loading}
            disabled={loading}
            onClick={onSubmit}
          >
            Complete Listing
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
