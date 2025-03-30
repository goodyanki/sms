import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  InboxOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  SunOutlined,
  MoonOutlined,
  StockOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, ConfigProvider } from "antd";
import { TickerTape } from "react-ts-tradingview-widgets";

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  return (
    <ConfigProvider
      theme={{
        algorithm:
          themeMode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Layout
        style={{
          minHeight: "100vh",
          top: 0,
          left: 0,
          position: "absolute",
          width: "100vw",
        }}
      >
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          theme={themeMode}
        >
          <div className="logo-container">
            <img src="/unicorn.svg" alt="Unicorn Logo" className="logo" />
          </div>

          <Menu
            theme={themeMode}
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: "1",
                icon: <UserOutlined />,
                label: <Link to="/dashboard">Overview</Link>,
              },
              {
                key: "2",
                icon: <VideoCameraOutlined />,
                label: <Link to="/dashboard/watch-list">Watch List</Link>,
              },
              {
                key: "3",
                icon: <UploadOutlined />,
                label: <Link to="/dashboard/technical-index">Technical Index</Link>,
              },
              {
                key: "4",
                icon: <InboxOutlined />,
                label: <Link to="/dashboard/system-alert">System Alert</Link>,
              },
              {
                key: "5",
                icon:<StockOutlined />,
                label: <Link to="/dashboard/paper_trading">Paper_Trading</Link>,
              }
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
              background: themeMode === "dark" ? "#141414" : "#ffffff", //slider
              height: "64px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingLeft: "16px",
              paddingRight: "16px",
              borderBottom:
                themeMode === "dark"
                  ? "1px solid #f70227"
                  : "1px solid #e0e0e0",
            }}
          >
            {/* btn_fold*/}
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

            <TickerTape colorTheme={themeMode} />

            {/* btn_changeTheme */}
            <Button
              type="text"
              icon={
                themeMode === "light" ? (
                  <MoonOutlined
                    style={{ fontSize: "18px", color: "#333000" }}
                  />
                ) : (
                  <SunOutlined style={{ fontSize: "18px", color: "#ffcc00" }} />
                )
              }
              onClick={() =>
                setThemeMode(themeMode === "light" ? "dark" : "light")
              }
              style={{
                fontSize: "16px",
              }}
            />
          </Header>
          <Content
            style={{
              padding: 24,
              background: "linear-gradient(to top right,rgb(227, 204, 241),rgb(197, 218, 236))", 
              borderRadius: 8,
              flex: 1,
              overflow: "auto",
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
