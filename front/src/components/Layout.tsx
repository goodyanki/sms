import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  InboxOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { TickerTape } from "react-ts-tradingview-widgets";

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout
      style={{
        minHeight: "100vh",
        top: 0,
        left: 0,
        position: "absolute",
        width: "100vw",
      }}
    >
      <Sider trigger={null} collapsible collapsed={collapsed} className="sider">
        <div className="logo-container">
          <img src="/cat_white_no_text.svg" alt="Cat Logo" className="logo" />
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: <Link to="/">Overview</Link>,
            },
            {
              key: "2",
              icon: <VideoCameraOutlined />,
              label: <Link to="/watch-list">Watch List</Link>,
            },
            {
              key: "3",
              icon: <UploadOutlined />,
              label: <Link to="/technical-index">Technical Index</Link>,
            },
            {
              key: "4",
              icon: <InboxOutlined />,
              label: <Link to="/system-alert">System Alert</Link>,
            },
          ]}
        />
      </Sider>
      <Layout
        style={{
          width: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            height: "64px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: "16px",
            paddingRight: "16px",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <TickerTape colorTheme="light"></TickerTape>
        </Header>
        <Content
          style={{
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            flex: 1,
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
