import React from "react";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import {Button, Checkbox, Form, Input, Flex, Row, Col} from "antd";
import {useNavigate} from "react-router-dom";


const App: React.FC = () => {
  const navigate = useNavigate();
  const onFinish = async (values: any) => {
    console.log("Received values of form: ", values);

    const response = await fetch("http://localhost:8000/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: values.username,
        password: values.password,
        email: values.email,
      }),

    });


    const data = await response.json();
    if (response.ok) {
      if (data.error) {
        console.log("Error:", data.error);
      }
      console.log("Success:");
      setTimeout(() => {
        navigate("/auth");
      }, 1500);
    }

      else{
        console.log("Error:", data);
    }


  };

  return (
    <Row justify="center" style={{ height: "100vh"}}>
      <Col>

        <Form
          name="login"
          initialValues={{ remember: true }}
          style={{ maxWidth: 360 }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your Email Address!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="email" />
          </Form.Item>
          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Sign Up
            </Button>
            or <a href="">Register now!</a>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default App;
