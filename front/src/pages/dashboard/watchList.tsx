import { Button, Card, Col, Form, Input, Row, Space } from "antd";
import WatchlistTable from "../../components/watchlist/watchlistTable"
import { RedoOutlined } from "@ant-design/icons";

const onFinish = async (values: any) => {
  console.log("Received values of form: ", values);
  const response = await fetch("http://localhost:8000/api/add/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      symbol: values.symbol,
      user_id: localStorage.getItem("test"),
    }),
  });

  const result = await response.json();
  if (response.ok) {
    console.log("Success:", result);
  } else {
    console.log("Error:", result);
  }
};

export default function WatchList() {
  return (
    <div
          style={{
            background:
              "linear-gradient(to top right,rgb(227,204,241),rgb(197,218,236))",
            padding: "2rem",
            minHeight: "100vh",
          }}
        >
      <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "bold", color: "black" }}>WatchList</h1>
        <Form onFinish={onFinish}>
          <Space.Compact style={{ width: "300px", marginLeft: "275px" }}>
            <Form.Item name="symbol" style={{ marginBottom: "0" }}>
              <Input placeholder="Add by input the symbol!" />
            </Form.Item>
            <Form.Item style={{ marginBottom: "0" }}>
              <Button type="primary" htmlType="submit">
                Add!{" "}
              </Button>
            </Form.Item>
          </Space.Compact>
        </Form>
        <Button href="/dashboard/watch-list" type="primary" style={{ marginLeft: "auto" }}>  
          <RedoOutlined />
        </Button> 
      </div>

      <WatchlistTable />
    </div>
  );
}
