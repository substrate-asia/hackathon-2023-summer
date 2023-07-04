import React from 'react';
import { Link } from 'react-router-dom';

const downloadResult = async (orderId) => {
  // 在此处添加实际的下载结果函数，该函数应从智能合约中获取结果URL
  // 示例：
  // const resultUrl = await contract.methods.getResultUrl(orderId).call();
  // return resultUrl;
  return 'https://example.com/result-file-url';
};

const DownloadResult = ({ orderId }) => {
  const handleDownloadResult = async () => {
    const resultUrl = await downloadResult(orderId);
    console.log(`Result URL: ${resultUrl}`);
    window.open(resultUrl, '_blank');
  };

  return (
    <div>
      <h2>Download Result</h2>
      <p>Order ID: {orderId}</p>
      <button onClick={handleDownloadResult}>Download Result</button>
    </div>
  );
};

export default DownloadResult;
