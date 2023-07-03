/**
 * 头部
 * @author fage
 * @Date: 2022-4-8
 */

import styled from "styled-components";
import _ from "lodash";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  MenuOutlined,
  CloudUploadOutlined,
  WalletOutlined,
  SearchOutlined,
  HomeOutlined,
  GlobalOutlined,
  LoginOutlined,
  CloseCircleOutlined,
  SwapOutlined,
  CheckOutlined,
  UserOutlined,
  UnorderedListOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import {
  Modal,
  Menu,
  message,
  Empty,
  Avatar,
  Button,
  List,
  Checkbox,
  Form,
  Input,
  Skeleton,
} from "antd";
import PolkadotLogo from "../statics/polkadot-logo.svg";
import { getAPI, getKeyring, toPublickKey } from "../utils/polkadot";
import { formatAddress, formatAddressLong } from "../utils/formatter";
import { formatBalance } from "../utils/formatter";
import Identicon from "@polkadot/react-identicon";
import store from "../utils/store";
import webconfig from "../webconfig";
import BuySpace from "../components/BuySpace";

import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
} from "@polkadot/extension-dapp";
import copy from "copy-to-clipboard";
import * as util from "../utils";
import logo from "../statics/imgs/logo.png";
import { encodeAddress } from "@polkadot/util-crypto";
let timeout = null;

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [
  getItem("Home", "/", <HomeOutlined />),
  getItem("Explore", "sub", <GlobalOutlined />, [
    getItem("Music", "/cat/Music"),
    getItem("Sports", "/cat/Sports"),
    getItem("News", "/cat/News"),
    getItem("Learning", "/cat/Learning"),
    getItem("Gaming", "/cat/Gaming"),
    getItem("Movie", "/cat/Movie"),
  ]),
];

let lockMenu = false;

function Header({ className }) {
  let navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [keyword, setKeyword] = useState();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSpaceModalOpen, setIsSpaceModalOpen] = useState(false);
  const [isAccountsModalOpen, setIsAccountsModalOpen] = useState(false);
  const [isModalConfig, setIsModalConfig] = useState(false);
  const [menuLeft, setMmenuLeft] = useState(null);
  const [menuTop, setMmenuTop] = useState("-200px");

  const [account, setAccount] = useState();
  const [accounts, setAccounts] = useState();

  const [config, setConfig] = useState({});
  let isHome = location.pathname == "/" ? true : false;
  console.log("navigate.pathname", location.pathname);

  const freshAccountBalance = async () => {
    let api = await getAPI();
    let addr = localStorage.getItem("addr");
    let acc=account;
    if(!acc){
      acc=store.get("account");
    }
    const { nonce, data: balance } = await api.query.system.account(addr);
    // console.log("balance", balance);
    // console.log(`balance of ${balance.free} and a nonce of ${nonce}`);
    acc.nonce = nonce;
    acc.balance = formatBalance(balance);
    acc.balance_str = acc.balance + " MAI";
    store.set("account", account);
    saveAccount(acc);
  };

  useEffect(() => {
    window.showLoginBox = function () {
      setModalOpen(true);
    };
    window.freshBalance = function () {
      freshAccountBalance();
    };
  }, []);

  useEffect(() => {
    getAPI().then((t) => {
      if (localStorage.getItem("addr")) {
        onLogin();
      }
    }, console.log);
    setConfig({
      videoApiUrl: webconfig.videoApiUrl,
      apiUrl: webconfig.apiUrl,
      contractAddress: webconfig.contractAddress,
      nodeURL: webconfig.wsnode.nodeURL,
    });
  }, []);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const onMenuClick = ({ item, key, keyPath, domEvent }) => {
    if (key == "sub") return;
    navigate(key);
    toggleCollapsed();
  };
  const onShowLoginBox = () => {
    setModalOpen(true);
  };  
  const onLogin = async () => {
    const allInjected = await web3Enable("my cool dapp");
    console.log("allInjected", allInjected);
    let accounts = await web3Accounts();
    console.log("accounts", accounts);
    if (accounts && accounts.length > 0) {
      // saveAccount(accounts[0]);
      setModalOpen(false);
      message.success("Login success!");
      try {
        let api = await getAPI();
        for (let a of accounts) {
          // a.base58=encodeAddress(a.address, 11330);
          const { nonce, data: balance } = await api.query.system.account(
            a.address
          );
          console.log("balance", balance);
          console.log(`balance of ${balance.free} and a nonce of ${nonce}`);
          a.nonce = nonce;
          a.balance = formatBalance(balance);
          a.balance_str = a.balance + " MAI";
        }
      } catch (e) {
        console.log("query balance error");
        console.error(e);
        let lastAccounts = store.get("accounts");
        accounts.forEach((a) => {
          let tmp = lastAccounts.find((l) => l.address == a.address);
          if (tmp) {
            a.nonce = tmp.nonce;
            a.balance = tmp.balance;
            a.balance_str = tmp.balance_str;
          }
        });
      }
      let lastAddr = localStorage.getItem("addr");
      accounts = accounts.sort((t1, t2) => t2.balance - t1.balance);
      let index = 0;
      if (lastAddr) {
        index = accounts.findIndex((t) => t.address == lastAddr);
        if (index == -1) {
          index = 0;
        }
      }
      setAccounts(accounts);
      store.set("accounts", accounts);
      saveAccount(accounts[index]);
      // openAccountBox(accounts);
    }
  };
  const saveAccount = async (account) => {
    setAccount(account);
    store.set("account", account);
    console.log("saveAccount", account);
    if (account) {
      let publicKey = toPublickKey(account.address);
      localStorage.setItem("publicKey", publicKey);
      localStorage.setItem("addr", account.address);
      // localStorage.setItem("base58",account.base58);
    } else {
      localStorage.removeItem("publicKey");
      localStorage.removeItem("addr");
      // localStorage.removeItem("base58");
    }
  };
  const openAccountBox = (list) => {
    if (!list) {
      list = accounts;
    }
    if (!list || list.length == 0) {
      return util.alert("account not found");
    }
    setIsAccountsModalOpen(true);
  };
  const onLogout = () => {
    store.remove("accounts");
    store.remove("account");
    saveAccount(null);
    setAccounts(null);
    setIsAccountsModalOpen(false);
  };
  const onSwitchAccount = (item) => {
    saveAccount(item);
    window.location.reload();
  };

  const onFinish = (values) => {
    console.log("Success:", values);
    store.set("webconfig", values);
    util.alert("Save Success!", () => {
      window.location.reload();
    });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onShowMenu = (e) => {
    if (lockMenu) return;
    let ele = document.querySelector("#headerContent");
    let x = 1000 + ele.getBoundingClientRect().left;
    console.log("x", x);
    setMmenuTop("67px");
    if (!menuLeft) {
      setMmenuLeft(x + "px");
    }
    clearTimeout(timeout);
  };
  const onHideMenu = () => {
    timeout = setTimeout(function () {
      setMmenuTop("-200px");
    }, 1000);
  };
  const onMenuItemClick = (url) => {
    lockMenu = true;
    setTimeout(function () {
      lockMenu = false;
    }, 500);
    setMmenuTop("-200px");
    navigate(url);
  };

  return (
    <div className={className}>
      <div className="abs-header">
        <div className="header-content" id="headerContent">
          <span className="h-col h-col-1 menu-btn">
            {/* <label onClick={toggleCollapsed}>
              <MenuOutlined
                style={{
                  color: "#FFF",
                  fontSize: 30,
                  position: "absolute",
                  top: "13px",
                  left: "0px",
                }}
              />
            </label> */}
            <NavLink to="/">
              <img
                src={logo}
                style={{
                  width: "120px",
                  position: "absolute",
                  top: "15px",
                  left: "0px",
                }}
              />
            </NavLink>
          </span>
          {/* <span className="h-col h-col-3 search-box">
            <input
              type="text"
              onKeyUp={onInput}
              placeholder="Search"
              className="search-txt"
            />
            <SearchOutlined className="search-btn" onClick={onSearch} />
          </span> */}
          {!isHome && account ? (
            <span
              className="h-col h-col-4 upload-btn"
              onClick={openAccountBox}
              onMouseOver={onShowMenu}
              onMouseOut={onHideMenu}
            >
              <span className="h-account">
                <Identicon
                  value={account.address}
                  size={36}
                  theme={"polkadot"}
                  style={{ marginTop: 0 }}
                />
                <span className="addr-text">
                  {formatAddress(account.address)}
                </span>
                <span className="balance-text">
                  {account.balance_str || "**"}
                </span>
              </span>
              {/* <span
                className="h-btn"
                onClick={() => setIsSpaceModalOpen(true)}
                style={{ backgroundColor: "#b8e6ff" }}
              >
                <DatabaseOutlined /> My Space
              </span>
              <span className="h-btn" onClick={() => navigate("/create")}>
                <CloudUploadOutlined /> Upload Video
              </span> */}
            </span>
          ) : (
            <span className="h-col h-col-4 upload-btn">
              {isHome ? (
                <span className="h-btn" onClick={() => navigate("/market/")}>
                  Launch APP
                </span>
              ) : (
                <span className="h-btn" onClick={onShowLoginBox}>
                  <WalletOutlined /> Connect Wallet
                </span>
              )}
            </span>
          )}
        </div>
      </div>
      <div
        className="top-menu"
        style={{ top: menuTop, left: menuLeft }}
        onMouseOver={onShowMenu}
        onMouseOut={onHideMenu}
      >
        <div onClick={() => onMenuItemClick("/market")}>Market</div>
        <div onClick={() => onMenuItemClick("/mydevice")}>Share Hashrate</div>
        <div onClick={() => onMenuItemClick("/myorder")}>My Order</div>
        <div
          onClick={() => {
            onLogout();
            onMenuItemClick("/market/");
          }}
        >
          Logout
        </div>
      </div>
      {collapsed ? (
        <div className="menu-box">
          <Menu
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub"]}
            mode="inline"
            theme="dark"
            items={items}
            className="nav-menu"
            onClick={onMenuClick}
          />
          <div
            className="h-bottom-btn"
            onClick={() => {
              setIsModalConfig(true);
              toggleCollapsed();
            }}
          >
            <UnorderedListOutlined /> Config API URL
          </div>
        </div>
      ) : (
        ""
      )}
      <Modal
        width={800}
        title="Config API URL"
        open={isModalConfig}
        onOk={() => setIsModalConfig(false)}
        onCancel={() => setIsModalConfig(false)}
        footer={null}
      >
        <div>
          <Form
            name="basic"
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 20,
            }}
            initialValues={config}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Video API"
              name="videoApiUrl"
              rules={[
                {
                  required: true,
                  message: "Please input video API!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="NFT API"
              name="apiUrl"
              rules={[
                {
                  required: true,
                  message: "Please input NFT API!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Contract Address"
              name="contractAddress"
              rules={[
                {
                  required: true,
                  message: "Contract Address!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Node RPC"
              name="nodeURL"
              rules={[
                {
                  required: true,
                  message: "Please input Node RPC!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 4,
                span: 20,
              }}
            >
              <Button className="btn-bg" type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
      <Modal
        className="login-modal"
        width={1000}
        open={isModalOpen}
        onOk={() => setModalOpen(false)}
        onCancel={() => {
          setModalOpen(false);
          if (!localStorage.getItem("addr")) {
            navigate("/market/");
          }
        }}
        footer={null}
      >
        <div className="login-box">
          <p className="big-title">Connect Your Wallet</p>
          <p className="con-title">
            If you don't have a wallet yet, you can select a provider and create
            one now
          </p>
          <p></p>
          <div className="login-line" onClick={onLogin}>
            <img src={PolkadotLogo} />
            <span>polkadot{"{.js}"} extension</span>
            <label>Polkadot</label>
          </div>
        </div>
      </Modal>
      <Modal
        width={800}
        title="Switch Account"
        open={isAccountsModalOpen}
        onCancel={() => setIsAccountsModalOpen(false)}
        footer={null}
      >
        {accounts && accounts.length > 0 ? (
          <div className="block">
            <List
              className="demo-loadmore-list"
              itemLayout="horizontal"
              dataSource={accounts}
              pagination={{ position: "bottom", pageSize: 5 }}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    account.address == item.address ? (
                      <Button disabled={true} icon={<CheckOutlined />}>
                        Current
                      </Button>
                    ) : (
                      <Button
                        icon={<SwapOutlined />}
                        disabled={account.address == item.address}
                        onClick={() => onSwitchAccount(item)}
                      >
                        Switch
                      </Button>
                    ),
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Identicon
                        value={item.address}
                        size={36}
                        theme={"polkadot"}
                        style={{ marginTop: 0 }}
                        onCopy={() => copy(item.address)}
                      />
                    }
                    title={item.meta.name || formatAddress(item.address)}
                    description={formatAddressLong(item.address)}
                  />
                  <div>{item.balance_str}</div>
                </List.Item>
              )}
            />
            <div className="block">
              <Button
                onClick={onLogout}
                style={{ width: "32%", marginTop: "20px" }}
                size="large"
                danger
                icon={<LoginOutlined />}
              >
                Logout
              </Button>
              <Button
                onClick={() => {
                  navigate("/myorder");
                  setIsAccountsModalOpen(false);
                }}
                style={{
                  width: "32%",
                  marginLeft: "10px",
                  marginTop: "20px",
                }}
                type="default"
                size="large"
                icon={<UserOutlined />}
              >
                My Order
              </Button>
              <Button
                onClick={() => setIsAccountsModalOpen(false)}
                style={{
                  width: "32%",
                  marginLeft: "10px",
                  marginTop: "20px",
                  backgroundColor: "#a4cb29",
                }}
                type="primary"
                size="large"
                icon={<CloseCircleOutlined />}
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <Empty />
        )}
      </Modal>
      {isSpaceModalOpen ? (
        <Modal
          width={700}
          title="My Space"
          open={true}
          onCancel={() => setIsSpaceModalOpen(false)}
          footer={null}
        >
          <BuySpace />
        </Modal>
      ) : (
        ""
      )}
    </div>
  );
}

export default styled(Header)`
  display: block;
  position: relative;
  top: 0;
  .block {
    display: block;
    overflow: hidden;
    clear: both;
    width: 100%;
  }
  .top-menu {
    position: absolute;
    top: -200px;
    width: 200px;
    display: block;
    overflow: hidden;
    background-color: #000;
    -webkit-transition: top 0.2s;
    transition: top 0.2s;
    color: #fff;
    border: 1px solid #eee;
    border-radius: 4px;
    border-bottom: none;
    div {
      width: 100%;
      height: 50px;
      line-height: 50px;
      display: block;
      overflow: hidden;
      clear: both;
      text-align: center;
      border-bottom: 1px solid #eee;
      cursor: pointer;
    }
  }
  .abs-header .header-content .search-box .search-btn {
    padding-left: 10px;
  }
  .abs-header {
    overflow: hidden;
    width: 100%;
    height: 56px;
    line-height: 56px;
    background-color: #000;
    position: fixed;
    color: #fff;
    clear: both;
    z-index: 1;
    border-bottom: 1px solid #fff;
    .header-content {
      width: 1210px;
      display: block;
      overflow: hidden;
      margin: 0 auto;
      text-align: left;
      color: #fff;
      position: relative;
      top: 0;
      left: 0;
      .h-col {
        line-height: 50px;
        height: 50px;
        display: block;
        overflow: hidden;
        float: left;
        .h-btn {
          color: #94d6e2;
          line-height: 38px;
          height: 38px;
          text-align: center;
          display: block;
          overflow: hidden;
          float: right;
          margin-left: 10px;
          border: 1px solid #94d6e2;
          border-radius: 6px;
          padding: 0 39px;
        }
      }
      .h-col-4 {
        float: right;
        margin-top: 9px;
      }
      .menu-btn {
        width: 250px;
        margin-top: 1px;
        cursor: pointer;
        z-index: 99;
      }
      .logo-txt {
        width: 20%;
        font-size: 30px;
        text-decoration: none;
        a {
          text-decoration: none;
        }
      }
      .search-box {
        width: 300px;
        position: absolute;
        left: 35%;
        top: 3px;
        .search-txt {
          width: calc(90% - 38px);
          max-width: 300px;
          background-color: #fff;
          color: #fff;
          border: 0px solid #000;
          outline: none;
          height: 38px;
          line-height: 38px;
          text-indent: 10px;
        }
        .search-btn {
          width: 31px;
          height: 38px;
          border: 1px solid #fff;
          line-height: 38px;
          border-left: none;
          font-size: 15px;
          font-weight: bold;
          color: #9d9d9d;
          background-color: #e9e9e9;
          cursor: pointer;
        }
      }
      .upload-btn {
        width: 480px;
        cursor: pointer;
      }
      .login-btn {
        width: 200px;
        float: right;
        cursor: pointer;
      }
      .h-account {
        font-size: 16px;
        color: #fff;
        position: relative;
        display: block;
        line-height: 38px;
        float: right;
        width: 200px;
        margin-left: 10px;
        .addr-text {
          position: absolute;
          top: 0px;
          left: 40px;
          font-size: 14px;
          line-height: 18px;
          color: green;
        }
        .balance-text {
          position: absolute;
          top: 22px;
          left: 40px;
          font-size: 14px;
          line-height: 7px;
          color: #999;
        }
      }
    }
  }
  .hold {
    width: 100%;
    height: 65px;
    display: block;
    overflow: hidden;
    clear: both;
  }
  .menu-box {
    position: fixed;
    width: 240px;
    left: 0;
    top: 55px;
    z-index: 9999;
    background-color: #000;
    height: calc(100vh - 55px);
    .nav-menu {
      background-color: #000;
    }
    .h-bottom-btn {
      color: #fff;
      position: absolute;
      left: 20px;
      bottom: 20px;
      cursor: pointer;
    }
  }
`;
