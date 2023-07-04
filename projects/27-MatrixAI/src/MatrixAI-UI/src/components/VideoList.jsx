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
import { Modal, Alert, Menu, message, Popconfirm, Empty } from "antd";
import React, { useState, useEffect } from "react";
import PolkadotLogo from "../statics/polkadot-logo.svg";
import { getAPI, getKeyring } from "../utils/polkadot";
import { formatAddress } from "../utils";
import Identicon from "@polkadot/react-identicon";
import Img from "../components/Img";
import { alist } from "../services/nft";
import * as util from "../utils";
import { formatImgUrl, formatterSize } from "../utils/formatter";
import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
} from "@polkadot/extension-dapp";

function Header({ className, items }) {
  let navigate = useNavigate();
  return (
    <div className={className}>
      {items && items.length > 0 ? (
        items.map((t, i) => {
          return (
            <div
              className="video-item"
              key={i}
              onClick={() => {
                navigate("/play/" + t.fileHash);
              }}
            >
              <div className="img-box">
                {t.length ? <span>{t.length}</span> : ""}
                <Img src={t.coverImg} width="100%" height="110px" />
              </div>
              <div className="info-box">
                <h4>{t.fileName}</h4>
                <span>{t.description}</span>
                <label>{t.views} views</label>
              </div>
            </div>
          );
        })
      ) : (
        <Empty style={{ padding: 30 }} description="No Data" />
      )}
    </div>
  );
}

export default styled(Header)`
  overflow: hidden;
  display: block;
  .video-item {
    margin-bottom: 28px;
    display: flex;
    overflow: hidden;
    clear: both;
    cursor: pointer;
    .img-box {
      width: 40%;
      position: relative;
      top: 0;
      overflow: hidden;
      span {
        position: absolute;
        right: 10px;
        bottom: 10px;
        z-index: 2;
        background-color: #000000a8;
        color: #fff;
        width: 40px;
        height: 20px;
        line-height: 20px;
        text-align: center;
      }
      img {
        width: 100%;
      }
    }
    .info-box {
      width: 52%;
      padding: 0 4%;
      h4 {
        font-weight: bold;
        font-size: 13px;
        line-height: 20px;
        height: 40px;
        overflow: hidden;
        width: 100%;
      }
      span {
        color: #7a7a7a;
        font-size: 14px;
        display: block;
        clear: both;
        line-height: 20px;
        height: 43px;
        overflow: hidden;
      }
      label {
        font-size: 14px;
        color: green;
      }
    }
  }
`;
