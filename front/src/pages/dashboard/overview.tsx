import { Card, Col, Row, Statistic, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { Tiny } from "@ant-design/plots";

export default function Overview() {
  const [data, setData] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "http://localhost:8000/api/indexInfo/?symbol=QQQ"
      );
      const result = await response.json();
      //console.log("Result", result); 
      setData(result.close_price);
    }
    fetchData();
  }, []);

  const DemoArea = () => {
    const chartData = data.map((price, day) => ({ price, day }));

    const config = {
      data: chartData,
      autoFit: true,
      height: 120,
      padding: 8,
      shapeField: "smooth",
      xField: "day",
      yField: "price",
      style: {
        fill: "linear-gradient(-90deg, white 0%, darkblue 100%)",
        fillOpacity: 0.6,
      },
    };
    return <Tiny.Area {...config} />;
  };

  return (
    <>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
        {" "}
        Overview{" "}
      </h1>
      <Row gutter={16} style={{ padding: 24 }}>
        <Col span={6}  >
          <div >
            <p style={{textAlign:"center", padding: 0, fontWeight:"bold"}}>NASDQ QQQ Trend</p>
            <DemoArea />
          </div>
          
        </Col>
        <Col span={6}>
          <div style={{height: "120px"}}>
            <Statistic title="Current Assets" value={112893} />
            
          </div>
          
        </Col>
      </Row>
    </>
  );
}
