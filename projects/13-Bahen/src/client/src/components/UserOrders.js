import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Typography, Table, Button } from 'antd';
import {
  getUserOrders,
  getOrderInfo,
  getUserAddress,
} from '../services/marketplaceService';
import styles from '../styles/UserOrders.module.css';
import { downloadFromAzure } from '../services/azureUpload';

const { Title, Paragraph } = Typography;
const handleDownload = async (orderId) => {
  try {
      await downloadFromAzure(orderId);
  } catch (error) {
      console.error('Download failed:', error);
  }
}
const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [userAddress, setUserAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAddress = async () => {
      const address = await getUserAddress();
      setUserAddress(address);
    };
    fetchUserAddress();
  }, []);

  useEffect(() => {
    if (userAddress) {
      const fetchOrders = async () => {
        try {
          const orderIds = await getUserOrders(userAddress);
          const orderDetailsPromises = orderIds.map((orderId) =>
            getOrderInfo(orderId)
          );
          const orders = await Promise.all(orderDetailsPromises);
          setOrders(orders);
        } catch (error) {
          console.error('Error fetching user orders:', error);
        }
      };
      fetchOrders();
    }
  }, [userAddress]);

  return (
    <div className={styles.container}>
      <div style={{ marginLeft: 20, marginBottom: 30 }}>
        <Title style={{ marginBottom: 10, color: '#fff' }} level={2}>
          Orders
        </Title>
        <Paragraph style={{ color: '#fff' }}>
          You can view all your train orders here
        </Paragraph>
      </div>

      {/* TODO mock records */}
      <Table
        dataSource={orders}
        columns={[
          {
            title: 'Order ID',
            dataIndex: 'orderId',
          },
          {
            title: 'Train Task ID',
            dataIndex: 'trainTaskId',
          },
          {
            title: 'Client',
            dataIndex: 'client',
          },
          {
            title: 'Payment Amount',
            dataIndex: 'paymentAmount',
          },
          {
            title: 'Order Status',
            dataIndex: 'orderStatus',
          },
          {
            title: 'Order Level',
            dataIndex: 'orderLevel',
          },
          {
            title: 'Operation',
            render: (text, record, index) => {
              return <Button onClick={() => handleDownload(record.folderUrl)}> Download Model</Button>;
            },
          },
        ]}
      />
    </div>
  );
};

export default UserOrders;
