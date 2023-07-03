import React, { useState, useRef } from 'react';
import { createOrderPreview, calculateCostPay } from '../services/marketplaceService';
import { useNavigate } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import {
  Button,
  ConfigProvider,
  Upload,
  Select,
  Steps,
  Typography,
} from 'antd';

import Section from './Section';

const { Title, Paragraph } = Typography;

const CreateOrder = ({ onUpload }) => {
  const scriptInputRef = useRef();
  const dataInputRef = useRef();
  const [folderUrl, setFolderUrl] = useState('');
  const [requiredPower, setRequiredPower] = useState(null);
  const navigate = useNavigate();
  const [orderLevel, setOrderLevel] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (requiredPower !== null) {
      setOrderLevel(orderLevel);
      const orderId = await createOrderPreview(
        folderUrl,
        requiredPower,
        requiredPower * 1,
        orderLevel
      );
      navigate(`/order-preview/${orderId}`, { state: { requiredPower } });
    }
  };

  const handleScriptUploadChange = handleUploadChange(scriptInputRef);
  const handleDataUploadChange = handleUploadChange(dataInputRef);

  function handleUploadChange(inputRef) {
    return async (e) => {
      if (e.target.files.length > 0) {
        if (folderUrl.length > 0) {
          await onUpload(Array.from(e.target.files), folderUrl);
        }
        else{
          const folderUrl = await onUpload(Array.from(e.target.files), "");
          setFolderUrl(folderUrl);
        }
      }
    };
  }

  const calculateCost = async () => {
    await calculateCostPay(
      10000
    );
    
    setLoading(true);
    try {
      const azureFunctionUrl =
        'https://calc-cost.azurewebsites.net/api/HttpTrigger2?code=hTRlWthKKGKDAZ2F4NbpRIOXF688VIEa7ulSV8uWIeGGAzFuA14rkQ==';
      const container = folderUrl.split('/').pop();
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ container: container }),
      };
      const response = await fetch(azureFunctionUrl, requestOptions);
      const data = await response.json();
      setRequiredPower(data.result_unit);
    } catch (error) {
      setRequiredPower(999);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex' }}>
      
      <div
        style={{
          width: '50%',
          paddingTop: 36,
          paddingBottom: 36,
          paddingRight: 64,
          borderRight: '2px solid #1F1F1F',
        }}
      >
        <div style={{ marginLeft: 20, marginBottom: 30 }}>
          <Title style={{ marginBottom: 10, color: '#fff' }} level={2}>
            Create Order
          </Title>
          <Paragraph style={{ color: '#fff' }}>Create your AI today</Paragraph>
        </div>
        <form onSubmit={handleSubmit}>
        <Section title="Upload Training Files and Data">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <div style={{ fontSize: '14px' }}>Data Set</div>
            <div>
              <FileInputGroup
              ref={scriptInputRef}
              onChange={handleDataUploadChange}
            />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <div style={{ fontSize: '14px' }}>
              <div>Train Script</div>
              <div style={{ color: '#666', fontSize: 12, fontStyle: 'italic' }}>
              </div>
            </div>
            <div>
              <FileInputGroup
              ref={scriptInputRef}
              onChange={handleScriptUploadChange}
            />
            </div>
          </div>
          <div style={{ display: 'flex', fontStyle: 'italic' }}>
          <div style={{ fontSize: 14 }}> Folder Url</div>
          <input
              type="text"
              className="form-control"
              id="folderUrl"
              value={folderUrl}
              onChange={(e) => setFolderUrl(e.target.value)}
            />
          </div>
        </Section>
        <Section title="Pretrain Settings">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <div style={{ fontSize: '14px' }}>Version of PyTorch</div>
            <div>
              <Select
                defaultValue="PyTorch"
                style={{ width: 210 }}
                onChange={(value) => {
                  console.log(`selected ${value}`);
                }}
                options={[
                  { value: 'Tensorflow', label: 'Tensorflow' },
                  { value: 'PyTorch', label: 'PyTorch' },
                  { value: 'Others', label: 'Others', disabled: true },
                ]}
              />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <div style={{ fontSize: '14px' }}>Service Class</div>
            <div>
              <Select
                defaultValue="Flat"
                style={{ width: 210 }}
                onChange={(value) => {
                  console.log(`selected ${value}`);
                }}
                options={[
                  { value: 'Flat', label: 'Flat' },
                  { value: 'Economy', label: 'Economy' },
                  { value: 'Business', label: 'Business' },
                ]}
              />
            </div>
          </div>
        </Section>
        <Section title="Cost Estimation">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <div style={{ fontSize: '14px' }}>Required Power: {requiredPower} (wei)</div>
            <div>
            <Button type="primary" loading={loading} onClick={calculateCost}>Calculate</Button>

            </div>
          </div>
          {requiredPower !== null && (
            <>
              <Button 
                type="primary" 
                loading={loading} 
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'We are processing your order, please wait...' : 'Create Order Preview (need to pay gas cost)'}
              </Button>
              {loading && <Progress percent={50} status="active" />}
            </>
          )}


        </Section>
        <div
          style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}
        >
        </div>
        </form>
      </div>

      <div style={{ width: 380, paddingTop: 36, paddingLeft: 64 }}>
        <ConfigProvider theme={{ token: { colorTextBase: '#fff' } }}>
          <Steps
            progressDot
            direction="vertical"
            items={[
              {
                title: 'Step 1',
                description: 'Upload your training files.',
              },
              {
                title: 'Step 2',
                description:
                  'Choose the corresponding PyTorch version you were using when developing your model.',
              },
              {
                title: 'Step 3',
                description:
                  'Choose the service class that’s suitable for your training.',
              },
              {
                title: 'Step 4',
                description:
                  'Click calculate the cost to get a fee estimation.',
              },
            ]}
          />
        </ConfigProvider>
      </div>
    </div>
  );
};

const FileInputGroup = React.forwardRef(({ label, onChange }, ref) => (
  <div className="mb-3">
    <label>
      {label}
      <input
        type="file"
        ref={ref}
        onChange={onChange}
        directory=""
        webkitdirectory=""
        multiple
        style={{ display: 'none' }}
      />
      <Button onClick={() => ref.current.click()} icon={<UploadOutlined />}>
        Upload Directory
      </Button>
    </label>
  </div>
));

export default CreateOrder;
