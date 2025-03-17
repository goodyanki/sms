import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import {Card, Col, Row, Select} from "antd";
import {useState} from "react";



export default function Index() {

    const [current, setCurrent] = useState("EMA");
    const handleChange = (value: string) => {
    console.log(`selected ${value}`);
    setCurrent(value);
    };

  return(
      <>
        <h1>Technical Index Analysis</h1>

         <Row gutter={16} style={{ padding: 24 }}>
             <Col span={6}>
                 <h3>Indicators</h3>
                 <h4>Some indicators for you to learn!</h4>
                <Select
                      defaultValue="EMA"
                      style={{ width: "100%" }}
                      onChange={handleChange}
                      options={[
                        { value: 'EMA', label: 'EMA' },
                        { value: 'RSI', label: 'RSI' },
                        { value: 'MACD', label: 'MACD' },
                        { value: 'BOLL', label: 'BOLL' },
                        { value: 'disabled', label: 'Disabled', disabled: true },
                      ]}
                    />
                 <Card style={{ marginTop: 16 }}>
                      {current === "EMA" ? (
                          <p><a style={{fontWeight: "bold", fontSize:"20px"}}>EMA</a>：Exponential Moving Average<br/>
                              <a style={{fontWeight: "bold"}}>EMA(5)</a>: Short-term period, reflects short-term price trends.<br/>
                              <a style={{fontWeight: "bold"}}>EMA(20)</a>: Medium-term trend, widely used in trading.<br/>
                              <a style={{fontWeight: "bold"}}>EMA(50)</a>: Longer trend analysis.<br/>
                              <a style={{fontWeight: "bold"}}>EMA(200)</a>: Used for long-term trend determination, commonly applied in the stock market.<br/>

                          </p>
                          ) : current === "RSI" ? (
                          <p>RSI（相对强弱指数）用于衡量市场超买或超卖情况。</p>
                            ) : current === "MACD" ? (
                          <p>MACD（指数平滑异同移动平均线）用于分析趋势和动量。</p>
                            ) : current === "BOLL" ? (
                          <p>BOLL（布林带）用于判断市场波动范围。</p>
                            ) : (<p>请选择一个技术指标以查看介绍。</p>

                      )}
                 </Card>

             </Col>
             <Col span={18}>
            <Card style={{ width: "100%" }}>
              <div style={{ width: "100%", height: "600px" }}>
                <AdvancedRealTimeChart  autosize={true} />
              </div>
            </Card>
          </Col>
         </Row>


      </>

  );
}
