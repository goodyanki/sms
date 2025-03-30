import AlertTable from "../../components/alert/AlertTable";
import {Button, Col, Form, Input, Row} from "antd";

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
    <>
      <h1>System Alert</h1>
        <Row style={{ padding: 24, }}>
            <Col span={24}>
                <div style={{height:'60px'}}>
                    <Form layout={"inline"} onFinish={onFinish}>
                        <Form.Item label="Symbol" name="symbol"  rules={[{ required: true, message: 'Please input symbol!' }]} style={{width:'300px'}}>
                            <Input />
                        </Form.Item>

                        <Form.Item label="Target Price" name="price"  rules={[{ required: true, message: 'Please input target price!' }]} style={{width:'300px'}} >
                            <Input />
                        </Form.Item>

                        <Form.Item label={null}>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Col>
        </Row>
      <AlertTable />
    </>
  );
}
