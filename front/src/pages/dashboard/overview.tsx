import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createChart } from "lightweight-charts";
import { MiniChart } from "react-ts-tradingview-widgets";
import { TechnicalAnalysis } from "react-ts-tradingview-widgets";
import { RightOutlined } from "@ant-design/icons";

//卡内可编辑文字
const EditableText = ({ text, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(text);

  const handleSave = () => {
    setEditing(false);
    onSave(value);
  };
  //是否编辑文字：click or enter to confirm
  return editing ? (
    <input
      value={value}
      autoFocus
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleSave}
      onKeyDown={(e) => e.key === "Enter" && handleSave()}
      style={{
        fontSize: "14px",
        padding: "2px 6px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        width: "100%",
      }}
    />
  ) : (
    <span onClick={() => setEditing(true)} style={{ cursor: "pointer" }}>
      {text}
    </span>
  );
};

const SmallChart = ({ width = 300, height = 120 }) => {
  const chartContainerRef = useRef();

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      layout: {
        textColor: "black",
        background: { type: "solid", color: "white" },
      },
      width,
      height,
      grid: { vertLines: { visible: false }, horzLines: { visible: false } },
      crosshair: { horzLine: { visible: false } },
      rightPriceScale: {
        scaleMargins: { top: 0.3, bottom: 0.25 },
      },
    });

    const areaSeries = chart.addAreaSeries({
      topColor: "#2962FF",
      bottomColor: "rgba(41, 98, 255, 0.28)",
      lineColor: "#2962FF",
      lineWidth: 2,
      //crossHairMarkerVisible: false,  //交叉线
    });

    areaSeries.setData([
      { time: "2024-01-01", value: 100 },
      { time: "2024-01-02", value: 105 },
      { time: "2024-01-03", value: 103 },
      { time: "2024-01-04", value: 110 },
      { time: "2024-01-05", value: 108 },
    ]);

    chart.timeScale().fitContent();

    return () => chart.remove();
  }, [width, height]);

  return (
    <div
      ref={chartContainerRef}
      style={{ borderRadius: "10px", overflow: "hidden" }}
    />
  );
};

const StocksBlock = () => {
  const [symbol, setSymbol] = useState("AAPL");

  return (
    <div
      style={{
        background: "#ddf", //stock background
        padding: "2rem",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        marginTop: "2rem",
      }}
    >
      <div style={{ marginBottom: "1rem" }}>
        <span style={{ fontWeight: "bold", marginRight: "0.5rem" }}>
          CLICK HERE TO CHANGE SYMBOL{" "}
          <span>
            <RightOutlined />
          </span>
        </span>
        <EditableText
          text={symbol}
          onSave={(val) => setSymbol(val.toUpperCase())}
        />
      </div>

      <TechnicalAnalysis
        colorTheme="light"
        width="100%"
        isTransparent={true}
        symbol={symbol}
      ></TechnicalAnalysis>
    </div>
  );
};

const TodayPopular = () => {
  const [gainers, setGainers] = useState([]);
  const [weekly, setweekly] = useState([]);

  useEffect(() => {
    const fetchGainers = async () => {
      const response = await fetch("http://localhost:8000/api/getTop3Gainer", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (response.ok) {
        const formatted = result.stock.map((stock, index) => {
          let color = "#000000";
          if (index === 0) color = "#FFD700";
          else if (index === 1) color = "#C0C0C0";
          else if (index === 2) color = "#CD7F32";

          return {
            name: stock.symbol,
            full: stock.short_name,
            percent: `+${stock.change_percent.toFixed(2)}%`,
            color: color,
          };
        });
        setGainers(formatted);
        console.log(formatted);
      } else {
        console.error("Failed to fetch gainers:", result);
      }
    };

    fetchGainers();

    const fetchPopular = async () => {
      const response = await fetch("http://localhost:8000/api/getWeeklyTrend", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const Trend = await response.json();

      if (response.ok) {
        const formatted = Trend.stock.slice(0, 3).map((stock, index) => {
          let color = "#000000";
          if (index === 0) color = "#FFD700";
          else if (index === 1) color = "#C0C0C0";
          else if (index === 2) color = "#CD7F32";

          return {
            name: stock.symbol,
            full: stock.short_name,
            percent: `+${stock.change_percent.toFixed(2)}%`,
            color: color,
          };
        });
        setweekly(formatted);
        console.log(formatted);
      } else {
        console.error("Failed to fetch gainers:", Trend);
      }
    };

    fetchPopular();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        gap: "3rem",
        flexWrap: "wrap",
        marginTop: "2rem",
      }}
    >
      {[
        { title: "Today Gainers", data: gainers },
        { title: "Popular this week", data: weekly },
      ].map((section) => (
        <div style={{ flex: 1 }} key={section.title}>
          <h3
            style={{ color: "#1a237e", fontSize: "16px", marginBottom: "1rem" }}
          >
            {section.title}
          </h3>
          {section.data.map((stock) => (
            <div
              key={stock.name}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  backgroundColor: stock.color,
                  borderRadius: "20px",
                  marginRight: "1rem",
                }}
              ></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "bold", fontSize: "15px" }}>
                  {stock.name}
                </div>
                <div style={{ fontSize: "13px", color: "#888" }}>
                  {stock.full}
                </div>
              </div>
              <div style={{ fontWeight: "bold", color: "#00c853" }}>
                {stock.percent}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const Overview = () => {
  //设置顶部卡片信息： abcd
  const [cards, setCards] = useState([
    {
      id: "1",
      title: "AAPL",
      gradient: "#8ab4f8",
      color: "#00c853",
      todo: "todo: add some text (editable)",
      symbol: "AAPL",
    },
    {
      id: "2",
      title: "NVDA",
      gradient: "#fbc02d",
      color: "#f5051d",
      todo: "todo: add text",
      symbol: "NVDA",
    },
    {
      id: "3",
      title: "MSFT",
      gradient: "#983682",
      color: "#123456",
      todo: "todo: add text",
      symbol: "MSFT",
    },
    {
      id: "4",
      title: "GOOGL",
      gradient: "#515169",
      color: "#777666",
      todo: "todo: add text",
      symbol: "GOOGL",
    },
    {
      id: "5",
      title: "AMZN",
      gradient: "#735935",
      color: "#112233",
      todo: "todo: add text",
      symbol: "AMZN",
    },
    {
      id: "6",
      title: "META",
      gradient: "#325483",
      color: "#444555",
      todo: "todo: add text",
      symbol: "META",
    },
    {
      id: "7",
      title: "TSLA",
      gradient: "#893858",
      color: "#999888",
      todo: "todo: add text",
      symbol: "TSLA",
    },
  ]);

  //设置expande卡片方法 set its attribute
  const [expandedCardId, setExpandedCardId] = useState(null);
  //新增卡片
  const handleAddCard = () => {
    const newId = (cards.length + 1).toString();
    const newCard = {
      id: newId,
      title: `CARD ${newId}`,
      gradient: "#607d8b",
      color: "#009688",
      todo: "todo: add text",
    };
    setCards([...cards, newCard]); //newcard插入到所有cards
  };

  return (
    <div
      style={{
        background:
          "linear-gradient(to top right,rgb(227,204,241),rgb(197,218,236))",
        padding: "4rem",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "bold", color: "black" }}>
          Market
        </h1>
        <p style={{ marginBottom: "1rem", color: "#888", fontSize: "16px" }}>
          Browse stocks that are always available
        </p>

        <div
          style={{
            display: "flex",
            gap: "2rem",
            marginBottom: "3rem",
            overflowX: "auto",
          }}
        >
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              layoutId={card.id}
              onClick={(e) => {
                const tag = e.target.tagName.toLowerCase();
                const isInputOrSpan =
                  tag === "input" || tag === "textarea" || tag === "span";
                if (!isInputOrSpan) {
                  setExpandedCardId(card.id);
                }
              }}
              style={{
                flex: "0 0 auto",
                minWidth: "320px",
                background: "#fff",
                borderRadius: "20px",
                padding: "1.5rem",
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  marginBottom: "1rem",
                  borderRadius: "10px",
                  position: "relative",
                }}
              >
                <MiniChart
                  colorTheme="light"
                  width="100%"
                  symbol={card.symbol}
                  isTransparent={true}
                ></MiniChart>

                <div
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "10px",
                    color: card.color,
                    fontWeight: "bold",
                  }}
                ></div>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: `linear-gradient(to top right, ${card.gradient}, #a0f0ff)`,
                    transform: "rotate(45deg)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "12px",
                  }}
                >
                  <div
                    style={{
                      transform: "rotate(-45deg)",
                      color: "white",
                      fontSize: "14px",
                    }}
                  >
                    Icon
                  </div>
                </div>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <EditableText
                    text={card.title}
                    onSave={(val) => {
                      const updated = [...cards];
                      updated[index].title = val;
                      setCards(updated);
                    }}
                  />
                  <EditableText
                    text={card.todo}
                    onSave={(val) => {
                      const updated = [...cards];
                      updated[index].todo = val;
                      setCards(updated);
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}

          <div
            onClick={handleAddCard}
            style={{
              flex: "0 0 auto",
              minWidth: "300px",
              background: "#fff",
              borderRadius: "20px",
              padding: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              border: "2px dashed #aaa",
              color: "#777",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            + Add Card
          </div>
        </div>

        <StocksBlock />
        <TodayPopular />

        <AnimatePresence>
          {expandedCardId && (
            <motion.div
              layoutId={expandedCardId}
              onClick={() => setExpandedCardId(null)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 999,
                background: "rgba(14, 13, 13, 0.39)", //放大后的背景色
              }}
            >
              <motion.div
                style={{
                  background: "#fff",
                  borderRadius: "20px",
                  padding: "2rem",
                  width: "600px",
                  maxWidth: "90vw",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
                }}
              >
                <h2 style={{ marginBottom: "1rem" }}>
                  {cards.find((c) => c.id === expandedCardId)?.title}
                </h2>
                <SmallChart width={560} height={200} />
                <p>{cards.find((c) => c.id === expandedCardId)?.todo}</p>
                <p
                  style={{ color: "#888", fontSize: "14px", marginTop: "1rem" }}
                >
                  Click anywhere to close
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Overview;
