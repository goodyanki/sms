import AlertTable from "../../components/alert/AlertTable";
import {
  Button,
  Col,
  Form,
  Input,
  Radio,
  Row,
} from "antd";

const onFinish = async (values: any) => {
  console.log("Received values of form: ", values);
  const response = await fetch("http://localhost:8000/api/addPriceAlert", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      symbol: values.symbol,
      user_id: localStorage.getItem("userid"),
      price: values.price,
      alert_type:values.alert_type
    }),
  });

  const result = await response.json();
  if (response.ok) {
    console.log("Success:", result);
  } else {
    console.log("Error:", result);
  }
};


export default function Alert() {

  return (
    <div
      style={{
        background:
          "linear-gradient(to top right,rgb(227,204,241),rgb(197,218,236))",
        padding: "2rem",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: "48px", fontWeight: "bold", color: "black" }}>System Alert</h1>
      <Row style={{ padding: 24 }}>
        <Col span={24}>
          <div style={{ height: "60px" }}>
            <Form layout={"inline"} onFinish={onFinish}>
              <Form.Item
                label="Symbol"
                name="symbol"
                rules={[{ required: true, message: "Please input symbol!" }]}
                style={{ width: "300px" }}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Target Price"
                name="price"
                rules={[
                  { required: true, message: "Please input target price!" },
                ]}
                style={{ width: "300px" }}
              >
                <Input />
              </Form.Item>


              <Form.Item
                name="alert_type"
                rules={[
                  { required: true, message: "Please select alert type!" },
                ]}
              >
                <Radio.Group>
                  <Radio value="long">Long</Radio>
                  <Radio value="short">Short</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
      <AlertTable />
    </div>
  );
}
