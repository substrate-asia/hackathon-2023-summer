import React, { useState, useEffect } from "react";
import axios from "axios";
import type { UploadProps } from "antd";
import { Table, Modal, Button, Spin } from "antd";
const props: UploadProps = {};

const Info: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState("");
  const [fid, setFid] = useState("");
  const [status, setStatus] = useState("");
  const columns = [
    {
      title: "File",
      dataIndex: "file",
      key: "file",
      render: (text: string, record: any, index: any) => (
        <span
          style={{ color: "#4f7dee" }}
          onClick={() => {
            openDownload(text, record.fid);
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Fid",
      dataIndex: "fid",
      key: "fid",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];
  const openDownload = (file: string, fid: string) => {
    setFile(file);
    setFid(fid);
    axios
      .get(`http://43.139.148.169:8080/${fid}`, {
        headers: { Operation: "view" },
      })
      .then((response) => {
        setStatus(response.data);
      })
      .catch((err) => {
        setStatus(err.response.data);
      });
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setLoading(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setStatus("");
    setLoading(false);
  };

  const uploaded = localStorage.getItem("uploaded");
  console.log(uploaded);
  let uploadedList: Array<any>;
  if (uploaded === null) {
    uploadedList = [];
  } else {
    uploadedList = JSON.parse(uploaded);
  }
  const dataSource = uploadedList;
  dataSource.map((e) => {
    console.log(e);
  });

  return (
    <div>
      {dataSource.length > 0 ? (
        <Table dataSource={dataSource} columns={columns} />
      ) : (
        "Empty"
      )}

      <Modal
        title="File Status"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button
            key="download"
            type="primary"
            loading={loading}
            onClick={handleOk}
            style={{ backgroundColor: "#4f7def" }}
          >
            Download
          </Button>,
        ]}
      >
        <div>
          <div>
            <ul>
              <li>
                <b>file name : </b>
                {file}
              </li>
              <li>
                <b>file fid : </b>
                {fid}
              </li>
              <li>
                <b>file status : {status === "" ? <Spin /> : status}</b>
                {}
              </li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Info;
