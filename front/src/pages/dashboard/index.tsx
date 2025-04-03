import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import { Card, Col, Row } from "antd";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const indicators = [
  {
    key: "STD;EMA",
    title: "EMA",
    description:
      "EMA (Exponential Moving Average): A weighted moving average that reacts more significantly to recent price changes.",

  },
  {
    key: "STD;Divergence%1Indicator",
    title: "RSI",
    description:
      "RSI (Relative Strength Index): Measures the speed and change of price movements, indicating overbought or oversold conditions.",
  },
  {
    key: "STD;MACD",
    title: "MACD",
    description:
      "MACD (Moving Average Convergence Divergence): A trend-following momentum indicator showing the relationship between two EMAs.",
  },
  {
    key: "STD;Bollinger_Bands",
    title: "BOLL",
    description:
      "BOLL (Bollinger Bands): A volatility indicator based on a moving average with upper and lower bands.",
  },
];

export default function Index() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div
      style={{
        background:
          "linear-gradient(to top right,rgb(227,204,241),rgb(197,218,236))",
        padding: "2rem",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: "48px", fontWeight: "bold", color: "black" }}>Technical Index Analysis</h1>

      <Row style={{ padding: 24 }}>
        <Col span={8}>
          <Row gutter={[8, 8]}>
            {indicators.map((indicator) => (
              <Col span={24} key={indicator.key}>
                <motion.div
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setSelected(
                      selected === indicator.key ? null : indicator.key
                    )
                  }
                >
                  <AnimatePresence mode="wait">
                    {selected === indicator.key ? (
                      <motion.div
                        key="expanded"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card
                          style={{
                            backgroundColor: "#f6ffed",
                            borderRadius: 12,
                          }}
                          bodyStyle={{ fontSize: 16 }}
                        >
                          {indicator.description }
                        </Card>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="collapsed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Card
                          hoverable
                          style={{ borderRadius: 12, textAlign: "center" }}
                        >
                          {indicator.title}
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Col>
        <Col span={16}>
          <div style={{ width: "90%", height: "500px", marginLeft: "auto" }}>
            <AdvancedRealTimeChart autosize={true} studies={selected ? [selected] : []}/>
          </div>
        </Col>
      </Row>
    </div>
  );
}
