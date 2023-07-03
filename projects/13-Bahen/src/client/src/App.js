import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Button, ConfigProvider, Layout, theme } from 'antd';

import { ConnectButton } from '@rainbow-me/rainbowkit';

import CreateOrder from './components/CreateOrder';
import OrderPreview from './components/OrderPreview';
import Home from './components/Home';
import UserOrders from './components/UserOrders';
import { uploadToAzure } from './services/azureUpload';
import WorkerList from './components/WorkerList';

const { Header, Content, Footer } = Layout;

function MenuLink({ href, children }) {
  return (
    <a
      style={{
        color: '#fff',
        textDecoration: 'none',
        display: 'block',
        height: 88,
        lineHeight: '88px',
        padding: '0 33px',
      }}
      href={href}
    >
      {children}
    </a>
  );
}

function App() {
  const handleUpload = async (files, orderID) => {
    try {
      const path = await uploadToAzure(files, orderID);
      alert('Files uploaded successfully');
      return path;
    } catch (error) {
      console.error(error);
      alert('Failed to upload files');
    }
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#6558F5' } }}>
      <Layout style={{ backgroundColor: '#000', color: '#fff' }}>
        <Header
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            height: 88,
            background: '#000',
            borderBottom: '2px solid #1F1F1F',
          }}
        >
          <div>
            <a href="/">
              <img style={{ width: 86 }} src="/logo.png" alt="" />
            </a>
          </div>
          <div style={{ display: 'flex' }}>
            <MenuLink href="/">Demo</MenuLink>
            <MenuLink href="/">About</MenuLink>
            <MenuLink href="/user-orders">My Order</MenuLink>
            <MenuLink href="/worker-list">Worker list</MenuLink>
          </div>
          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div>
              <a href="/create-order">
                <Button size="large" type="primary" style={{ marginRight: 20 }}>
                  Train
                </Button>
              </a>
            </div>
            <div>
              <ConnectButton></ConnectButton>
            </div>
          </div>
        </Header>
        <Content>
          <Router>
            <div>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/create-order"
                  element={<CreateOrder onUpload={handleUpload} />}
                />
                <Route
                  path="/order-preview/:orderId"
                  element={<OrderPreview />}
                />
                <Route path="/user-orders" element={<UserOrders />} />
                <Route path="/worker-list" element={<WorkerList />} />
              </Routes>
            </div>
          </Router>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
            backgroundColor: '#000',
            color: '#fff',
            borderTop: '2px solid #1F1F1F',
          }}
        >
          © 2023 All Rights Reserved by Lab Apex
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
