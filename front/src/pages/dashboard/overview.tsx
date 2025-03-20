import { Card, Col, Row } from "antd";
import ReactECharts from "echarts-for-react";//https://github.com/hustcc/echarts-for-react
import {useEffect, useState } from "react";

export default function Overview() {
  const [data, setData] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("http://localhost:8000/api/indexInfo/?symbol=QQQ");
      const result = await response.json();
      setData(result.close_price); 
    }
    fetchData();

},[]);


  const xAxisData = []
  for(let i = 0; i < data.length; i++){
    xAxisData.push("day"+i)
  }


  const options = {
    title: { text: "NASDQ" },
    grid: { top: 30, right: 8, bottom: 24, left: 8 },
    xAxis: {
      type: "category",
      data: xAxisData,
      axisLine: { show: false }, 
      axisTick: { show: false },
      axisLabel: { show: false }, 
    },
    yAxis: { type: "value", show: false, scale: true },
    series: [
      {
        data: data, 
        type: "line",
        smooth: true,
        symbol: "none", 
        lineStyle: { width: 2, color: "#5470C6" },
      },
    ],
    tooltip: { trigger: "axis" },
  };


  return (
    <>
      
      <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}> Overview </h1>
      <Row gutter={16} style={{ padding: 24 }}>
        <Col span={6}>
          <Card style={{ height: 160, padding: 0, border: "none" }}>
             <ReactECharts option={options} style={{ height: "120px" }} />
          </Card>
        </Col>
      </Row>

    </>


)
}
