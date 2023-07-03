import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import { randomString } from "../../utils/random";
const { Dragger } = Upload;

const props: UploadProps = {
  name: "file",
  multiple: true,
  action: `http://43.139.148.169:8080/${randomString(7)}`,
  method: "PUT",
  headers: {
    Authorization:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoiY1hoUHFFQzNjNUdtdnQxSEh6TVVNaHg4WDVBVWpiQ1dUdTU5ZllHR0M3aXJ5eThMNSIsImV4cCI6MTY5MDkxNTA4MCwibmJmIjoxNjg4MzIzMDIwfQ.g4YNKI9OP04xWu43_2j_jxh2W_pchCHd_x5tMQuxPe0",
    BucketName: "btest",
  },
  onChange(info) {
    const { status, response, name } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);

      console.log(info);

      const uploaded = localStorage.getItem("uploaded");
      let newUploadedList = [
        {
          file: name,
          fid: info.file.response,
          date: info.file.lastModifiedDate,
        },
      ];

      if (uploaded !== null) {
        const uploadedList = JSON.parse(uploaded);
        newUploadedList = [...uploadedList, ...newUploadedList];
      }
      localStorage.setItem("uploaded", JSON.stringify(newUploadedList));

      info.file.name = name + " : " + response;
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

const CloudOSS: React.FC = () => (
  <div
    style={{
      height: "auto",
      padding: "10px",
    }}
  >
    {" "}
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined rev={undefined} />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibited from uploading
        company data or other banned files.
      </p>
    </Dragger>
  </div>
);

export default CloudOSS;
