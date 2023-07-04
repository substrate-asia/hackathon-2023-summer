import React, { useState } from "react";
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Menu } from "antd";
import Info from "./Info";
import CloudOSS from "./CloudOSS";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Info", "info", <DesktopOutlined rev={undefined} />),
  getItem("Cloud", "cloud", <PieChartOutlined rev={undefined} />),
  getItem(
    "MessageBoard",
    "messageBoard",
    <ContainerOutlined rev={undefined} />
  ),
];

const SliderBar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [pageKey, setPageKey] = useState("info");

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <div
        className="SliderBar"
        style={{ width: 256, borderRight: "solid 1px rgb(229, 231, 235)" }}
      >
        <Button
          type="primary"
          onClick={toggleCollapsed}
          style={{ marginBottom: 16, backgroundColor: "#3f7ef7" }}
        >
          {collapsed ? (
            <MenuUnfoldOutlined rev={undefined} />
          ) : (
            <MenuFoldOutlined rev={undefined} />
          )}
        </Button>

        <Menu
          defaultSelectedKeys={["info"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          theme="light"
          inlineCollapsed={collapsed}
          items={items}
          style={{ borderRight: "none" }}
          onClick={({ key }) => {
            setPageKey(key);
            return 1;
          }}
        />
      </div>
      <div className="DeMap-Main">{switchPage(pageKey)}</div>
    </div>
  );
};

function switchPage(key: string) {
  switch (key) {
    case "info":
      return <Info />;
    case "Upload":
      localStorage.getItem("upload") === null
        ? localStorage.setItem("upload", "[]")
        : "";
      return <CloudOSS />;
    case "messageBoard":
      localStorage.getItem("upload") === null
        ? localStorage.setItem("upload", "[]")
        : "";
      return <CloudOSS />;

    default:
      return <CloudOSS />;
  }
}
export default SliderBar;
