import React, { useState } from 'react';
import { Link } from "react-router-dom";
import {
    InboxOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined, UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();


    return (
        <Layout style={{ minHeight: '100vh', top: 0, left: 0, position: 'absolute'  }}>
            <Sider trigger={null} collapsible collapsed={collapsed} className="sider">
                <div className="logo-container">
                    <img src="/cat_white_no_text.svg" alt="Cat Logo" className="logo" />
                </div>

                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <UserOutlined />,
                            label: <Link to="/">Overview</Link>,

                        },
                        {
                            key: '2',
                            icon: <VideoCameraOutlined />,
                            label: <Link to="/watch-list">Watch List</Link>,
                        },
                        {
                            key: '3',
                            icon: <UploadOutlined />,
                            label: <Link to="/technical-index">Technical Index</Link>,
                        },
                        {
                            key: '4',
                            icon: <InboxOutlined />,
                            label: <Link to="/system-alert">System Alert</Link>,
                        }
                    ]}
                />
            </Sider>
            <Layout style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Header style={{ padding: 0, background: colorBgContainer, height:'64', width: '100vw' }}>

                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Content
                    style={{
                        padding: 24,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        width: '100vw',
                        overflow: 'auto',
                        height: '100vh',


                    }}
                >

                </Content>
            </Layout>
        </Layout>
    );
};

export default App;