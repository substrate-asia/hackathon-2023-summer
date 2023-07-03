import "./App.css";
import Header from "./components/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import Play from "./views/Play";
import Upload from "./views/Upload";
import My from "./views/My";
import Transfer from "./views/Transfer";
import Sale from "./views/Sale";
import Buy from "./views/Buy";
import NFTDetail from "./views/NFTDetail";
import UploadStatus from "./views/UploadStatus";
import Upgrading from "./views/Upgrading";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import webconfig from "./webconfig";
import Market from "./views/Market";
import MakeOffer from "./views/MakeOffer";
import OrderDetail from "./views/OrderDetail";
import MyDevice from "./views/MyDevice";
import MyOrder from "./views/MyOrder";
import { ConfigProvider, theme } from "antd";

function App() {
  console.log("webconfig.isUpgrading", webconfig.isUpgrading);
  if (webconfig.isUpgrading) {
    console.log("isUpgrading");
    return <Upgrading className="upgrading" />;
  }
  return (
    <BrowserRouter>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
        }}
      >
        <Header className="page-header" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/market/" element={<Market />} />
          <Route path="/makeoffer/:id" element={<MakeOffer />} />
          <Route path="/order-detail/:id" element={<OrderDetail />} />
          <Route path="/buy/:id" element={<Buy />} />
          <Route path="/mydevice/" element={<MyDevice />} />
          <Route path="/myorder/" element={<MyOrder />} />
          {/* <Route path="/create" element={<Upload />} />
          <Route path="/my" element={<My />} />
          <Route path="/transfer/:fileHash" element={<Transfer />} />
          <Route path="/sale/:fileHash" element={<Sale />} />
          <Route path="/buy/:fileHash" element={<Buy />} />
          <Route path="/detail/:fileHash" element={<NFTDetail />} />
          <Route path="/uploading" element={<UploadStatus />} /> */}
        </Routes>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
