import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Statistic,
  Switch,
} from "antd";

import type { InputNumberProps, StatisticProps } from "antd";
import Userpage from "../../components/paperTrading/userpage";
import React, { useEffect, useState } from "react";
import CountUp from "react-countup";

const formatter: StatisticProps["formatter"] = (value) => (
  <CountUp end={value as number} separator="," decimals={2} />
);

const onChange: InputNumberProps["onChange"] = (value) => {
  console.log("changed", value);
};

export default function Sim() {
  const onFinish = async (values: any) => {
    console.log("Received values of form: ", values);

    const response = await fetch("http://localhost:8000/api/handleOrder/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symbol: values.symbol,
        order_side: values.orderSide,
        order_type: values.orderType,
        quantity: values.quantity,
        price: values.price,
        stop_loss: values.stopLossEnabled ? values.stopLoss : null,
        take_profit: values.takeProfitEnabled ? values.takeProfit : null,
        user_id: localStorage.getItem("userid"),
      }),
    });

    const result = await response.json();
    if (response.ok) {
      console.log("Success:", result);
      fetchBalance();
      fetchmarketValue();
      fetchurpl();
      fetchnlv();
    } else {
      console.log("Error:", result);
    }
  };

  const [balance, setBalance] = useState<number>(0);
  const fetchBalance = async () => {
    const response = await fetch("http://localhost:8000/api/getBalance/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: localStorage.getItem("userid"),
      }),
    });

    const data = await response.json();
    if (response.ok) {
      setBalance(data.balance);
    } else {
      console.error("Failed to fetch balance", data);
    }
  };

  const [marketValue, setmarketValue] = useState<number>(0);
  const fetchmarketValue = async () => {
    const response = await fetch("http://localhost:8000/api/getmarketValue/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: localStorage.getItem("userid"),
      }),
    });

    const data = await response.json();
    if (response.ok) {
      setmarketValue(data.marketValue);
    } else {
      console.error("Failed to fetch market Value", data);
    }
  };

  const [urpl, seturpl] = useState<number>(0);
  const fetchurpl = async () => {
    const response = await fetch("http://localhost:8000/api/geturpl/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: localStorage.getItem("userid"),
      }),
    });

    const data = await response.json();
    if (response.ok) {
      seturpl(data.unrealizedPL);
    } else {
      console.error("Failed to fetch market Value", data);
    }
  };

  const [nlv, setnlv] = useState<number>(0);
  const fetchnlv = async () => {
    const response = await fetch("http://localhost:8000/api/getnlv/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: localStorage.getItem("userid"),
      }),
    });

    const data = await response.json();
    if (response.ok) {
      setnlv(data.nlv);
    } else {
      console.error("Failed to fetch market Value", data);
    }
  };

  useEffect(() => {
    fetchmarketValue();
    fetchBalance();
    fetchurpl();
    fetchnlv();
  }, []);

  return (
    <>
      <h1>Paper Trading</h1>
      <Row gutter={16} style={{ padding: 24, }}>
        <Col span={6}>
          <Form  onFinish={onFinish}>
            <Form.Item style={{ fontWeight: "bold" }} name="orderSide">
              <Radio.Group>
                <Radio.Button value="BUY" style={{ width: "100px" }}>
                  BUY
                </Radio.Button>
                <Radio.Button value="SELL" style={{ width: "100px" }}>
                  SELL
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="Order Type"
              style={{ fontWeight: "bold" }}
              name="orderType"
            >
              <Radio.Group>
                <Radio.Button value="Market" style={{ width: "100px" }}>
                  Market
                </Radio.Button>
                <Radio.Button value="Limit" style={{ width: "100px" }}>
                  Limit
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="Symbol"
              style={{ fontWeight: "bold" }}
              layout="horizontal"
              name="symbol"
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Quantity"
              style={{ fontWeight: "bold" }}
              layout="horizontal"
              name="quantity"
              initialValue={1}
            >
              <InputNumber min={1} defaultValue={3} onChange={onChange} />
            </Form.Item>

            <Form.Item
              label="Price"
              style={{ fontWeight: "bold" }}
              layout="horizontal"
              name="price"
              initialValue={100}
            >
              <InputNumber<number>
                defaultValue={1000}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) =>
                  value?.replace(/\$\s?|(,*)/g, "") as unknown as number
                }
                onChange={onChange}
              />
            </Form.Item>

            <Form.Item
              label="Stop Loss"
              style={{ fontWeight: "bold", marginBottom: 0 }}
            >
              <Row>
                <Col span={12}>
                  <Form.Item name="stopLoss" initialValue={100}>
                    <InputNumber<number>
                      defaultValue={1000}
                      formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) =>
                        value?.replace(/\$\s?|(,*)/g, "") as unknown as number
                      }
                      onChange={onChange}
                      style={{ width: "150px" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="stopLossEnabled"
                    valuePropName="checked"
                    noStyle
                  >
                    <Switch style={{marginLeft:'52px'}}/>
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item label="Take Profit" style={{ fontWeight: "bold" }}>
              <Row>
                <Col span={12}>
                  <Form.Item name="takeProfit" initialValue={100}>
                    <InputNumber<number>
                      formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) =>
                        value?.replace(/\$\s?|(,*)/g, "") as unknown as number
                      }
                      onChange={onChange}
                      style={{ width: "150px" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="takeProfitEnabled"
                    valuePropName="checked"
                    noStyle
                  >
                    <Switch style={{marginLeft:'50px'}}/>
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                style={{ width: "100px" }}
                htmlType="submit"
              >
                Send
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={18}>
          <div
            style={{
              height: "120px",
              backgroundColor: "lightblue",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <div style={{ height: "60px", width: "50%" }}>
              <Statistic
                style={{ marginLeft: "38%", fontWeight: "bold" }}
                title="Current Balance"
                value={balance}
                formatter={formatter}
              />
            </div>

            <div
              style={{ height: "60px", width: "50%", backgroundColor: "green" }}
            >
              <Statistic
                style={{ marginLeft: "38%", fontWeight: "bold" }}
                title="Market Value"
                value={marketValue}
                formatter={formatter}
              />
            </div>

            <div
              style={{ height: "60px", width: "50%", backgroundColor: "blue" }}
            >
              <Statistic
                style={{ marginLeft: "38%", fontWeight: "bold" }}
                title="Unrealized P/L"
                value={urpl}
                formatter={formatter}
              />
            </div>

            <div
              style={{
                height: "60px",
                width: "50%",
                backgroundColor: "yellow",
              }}
            >
              <Statistic
                style={{ marginLeft: "38%", fontWeight: "bold" }}
                title="Net Liquidation Value"
                value={nlv}
              />
            </div>
          </div>

          <div style={{ height: "400px" }}>
            <Userpage />
          </div>
        </Col>
      </Row>
    </>
  );
}
