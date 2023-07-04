import styled from "styled-components";
import _ from "lodash";
import { NavLink, useNavigate } from "react-router-dom";
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
  web3FromSource,
} from "@polkadot/extension-dapp";
import copy from "copy-to-clipboard";
import * as util from "../utils";
import logo from "../statics/logo.png";
import { encodeAddress } from "@polkadot/util-crypto";
import { stringToHex } from "@polkadot/util";

function Header({ className }) {
  let navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSpaceModalOpen, setIsSpaceModalOpen] = useState(false);
  const [isAccountsModalOpen, setIsAccountsModalOpen] = useState(false);
  const [isModalConfig, setIsModalConfig] = useState(false);

  const [account, setAccount] = useState();
  const [accounts, setAccounts] = useState();

  const [config, setConfig] = useState({});
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    getAPI().then((api) => {
      if (!localStorage.getItem("addr")) {
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

  const sendMsg = (data) => {
    document.getElementById("main").contentWindow.postMessage(data, "*");
  };

  const onShowLoginBox = () => {
    setModalOpen(true);
  };
  const signMsg = async (address, msg) => {
    if (!address) {
      address = localStorage.getItem("addr");
    }
    await web3Enable("my cool dapp");
    const injector = await web3FromAddress(address);
    const signRaw = injector?.signer?.signRaw;
    if (!!signRaw) {
      const { signature } = await signRaw({
        address: address,
        data: stringToHex(msg),
        type: "bytes",
      });
      return signature;
    }
    return null;
  };
  const onLogin = async () => {
    const allInjected = await web3Enable("my cool dapp");
    console.log("allInjected", allInjected);
    let accounts = await web3Accounts();
    console.log("accounts", accounts);
    if (accounts && accounts.length > 0) {
      // saveAccount(accounts[0]);
      setModalOpen(false);
      // message.success("Login success!");
      setIsLogin(true);
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
          a.balance_str = a.balance + " TCESS";
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
      let result = await signMsg(lastAddr, "cess-cloud-notebook");
      sendMsg( { way: "login", msg: "ok", data: result });
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
    setIsLogin(false);
  };
  const onSwitchAccount = (item) => {
    saveAccount(item);
    window.location.reload();
  };
  // Create a text file using JavaScript
  const createBucket =async (name) => {
    let api = await getAPI();
    util.loading(true);
    let addr = localStorage.getItem("addr");
    await web3Enable("my cool dapp");
    const injector = await web3FromAddress(addr);
    api.tx.fileBank.createBucket(addr,name)
      .signAndSend(
        addr,
        { signer: injector.signer },
        (status) => {
          console.log("status****", status);
          if(status.dispatchError){
            util.loading(false);
            console.log(status.dispatchError.toHuman());
            util.alert('An extrinsic failed!');
            return;
          }
          try {
            console.log("status.status.toJSON()", status.status.toJSON());
            console.log("isFinalized", status.isFinalized);
            if (status.isFinalized) {
              //ok
              util.loading(false);
              util.showOK('Success!');
            }
          } catch (e) {
            util.alert(e.message);
            util.loading(false);
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
        }
      );
  };
  const deleteBucket =async (name) => {};
  const myBuckets =async () => {
    let api = await getAPI();
    let lastAddr = localStorage.getItem("addr");
    let arr=await api.query.fileBank.userBucketList(lastAddr);
    return arr.toHuman();
  };
  const checkLogin = () => {
    return isLogin;
  };

  window.onShowLoginBox = onShowLoginBox;
  window.openAccountBox = openAccountBox;
  window.signMsg = signMsg;
  window.createBucket = createBucket;
  window.deleteBucket = deleteBucket;
  window.myBuckets = myBuckets;
  window.checkLogin = checkLogin;
  window.onSwitchAccount=onSwitchAccount;
  window.getAccounts=()=>{
    return store.get("accounts");
  };


  return (
    <div className={className}>
      <iframe
        id="main"
        title="main"
        name="main"
        scrolling-y="auto"
        scrolling-x="no"
        src="/notebook/index.html"
      ></iframe>
      <div className="top-content">
        <Modal
          width={800}
          title="Connect Your Wallet"
          open={isModalOpen}
          onOk={() => setModalOpen(false)}
          onCancel={() => setModalOpen(false)}
          footer={null}
        >
          <p>
            If you don't have a wallet yet, you can select a provider and create
            one now
          </p>
          <p></p>
          <div className="login-line" onClick={onLogin}>
            <img src={PolkadotLogo} />
            <span>polkadot{"{.js}"} extension</span>
            <label>Polkadot</label>
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
                    navigate("/my");
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
                  Profile cllected
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
    </div>
  );
}

export default styled(Header)`
  display: block;
  overflow: hidden;
  position: relative;
  top: 0;
  #main {
    display: block;
    overflow: hidden;
    width: 100%;
    height: 100vh;
    border: none;
    outline: none;
  }
  .block {
    display: block;
    overflow: hidden;
    clear: both;
    width: 100%;
  }
  .abs-header .header-content .search-box .search-btn {
    padding-left: 10px;
  }
  .abs-header {
    overflow: hidden;
    width: 100%;
    padding: 0 3%;
    height: 56px;
    line-height: 56px;
    background-color: #000;
    position: fixed;
    color: #fff;
    clear: both;
    z-index: 999999;
    .header-content {
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
          background-color: rgb(211, 243, 108);
          color: #000;
          padding: 0 10px;
          line-height: 38px;
          height: 38px;
          text-align: center;
          display: block;
          overflow: hidden;
          float: right;
          margin-left: 10px;
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
          background-color: #545454;
          color: #fff;
          border: 1px solid #000;
          outline: none;
          height: 38px;
          line-height: 38px;
          text-indent: 10px;
        }
        .search-btn {
          width: 38px;
          height: 38px;
          border: 1px solid #000;
          line-height: 38px;
          border-left: none;
          font-size: 15px;
          font-weight: bold;
          color: #fdff8f;
          background-color: #545454;
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
        }
        .balance-text {
          position: absolute;
          top: 22px;
          left: 40px;
          font-size: 14px;
          line-height: 7px;
          color: #d3f36c;
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
