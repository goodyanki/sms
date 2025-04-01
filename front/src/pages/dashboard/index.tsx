import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import {Col, Row, Carousel, Collapse } from "antd";
import { useState } from "react";
const text_ema = (
  <>
    <p style={{ paddingInlineStart: 24  }}>
      The Exponential Moving Average (EMA) is a technical indicator used in trading to smooth out price data and identify trends more quickly than a simple moving average. It gives more weight to recent prices, making it more responsive to new market information.
    </p>
    <p style={{ paddingInlineStart: 24 }}>
      <span style={{fontWeight:'bold'}}>Golden Cross =  </span>  The short-term EMA crosses above the long-term EMA → Bullish signal.
    </p>
    <p style={{ paddingInlineStart: 24 }}>
      <span style={{fontWeight:'bold'}}>Death Cross = </span> The short-term EMA crosses below the long-term EMA → Bearish signal.
    </p>
  </>
  

);

const text_macd = (
  <>
    <p style={{ paddingInlineStart: 24 }}>
      The Moving Average Convergence Divergence (MACD) is a momentum indicator that shows the relationship between two exponential moving averages (typically the 12-day and 26-day EMAs). It helps traders identify potential buy or sell signals based on trend strength and direction.
    </p>
    <p style={{ paddingInlineStart: 24 }}>
    <span style={{fontWeight:'bold'}}>Bullish Signal= </span> = When the MACD line crosses above the Signal line → Indicates upward momentum.
    </p>
    <p style={{ paddingInlineStart: 24 }}>
    <span style={{fontWeight:'bold'}}>Bearish Signal</span> = When the MACD line crosses below the Signal line → Indicates downward momentum.
    </p>
  </>
);


const text_boll = (
  <>
    <p style={{ paddingInlineStart: 24 }}>
      Bollinger Bands (BOLL) are a volatility indicator that consists of a middle band (usually a 20-day simple moving average) and two outer bands that are typically two standard deviations away from the middle band. The bands expand and contract based on market volatility.
    </p>
    <p style={{ paddingInlineStart: 24 }}>
    <span style={{fontWeight:'bold'}}>Bullish Signal= </span> = When the price touches or breaks the lower band and then moves upward → Potential rebound.
    </p>
    <p style={{ paddingInlineStart: 24 }}>
    <span style={{fontWeight:'bold'}}>Bearish Signal</span> = When the price touches or breaks the upper band and then moves downward → Potential pullback.
    </p>
  </>
);


const text_rsi = (
  <>
    <p style={{ paddingInlineStart: 24 }}>
      The Relative Strength Index (RSI) is a momentum oscillator that measures the speed and change of price movements, ranging from 0 to 100. It helps identify overbought or oversold conditions in the market.
    </p>
    <p style={{ paddingInlineStart: 24 }}>
    <span style={{fontWeight:'bold'}}>Bullish Signal= </span> = RSI rises above 30 from below → Market may be recovering from an oversold condition.
    </p>
    <p style={{ paddingInlineStart: 24 }}>
    <span style={{fontWeight:'bold'}}>Bearish Signal</span> = RSI falls below 70 from above → Market may be reversing from an overbought condition.
    </p>
  </>
);



const items = [
  {
    key: '1',
    label: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>EMA</span>,
    children: text_ema,
  },
  {
    key: '2',
    label: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>MACD</span>,
    children: text_macd,
  },
  {
    key: '3',
    label: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>BOLL</span>,
    children: text_boll,
  },
  {
    key:'4',
    label:<span style={{ fontSize: '18px', fontWeight: 'bold' }}>RSI</span>,
    children: text_rsi,
  }
];


export default function Index() {
  const [activeKey, setActiveKey] = useState<string>('1');

  const studyMap: { [key: string]: string[] } = {
    '1': ['STD;EMA'], // EMA
    '2': ['STD;MACD'],                        // MACD
    '3': ['STD;Bollinger_Bands'],              // BOLL
    '4': ['STD;Divergence%1Indicator'],                         // RSI
  };

  return (
    <>
      <h1>Technical Index Analysis</h1>

      <Row style={{ padding: 24 }}>
        <Col span={8}>
          <Collapse 
          items={items} 
          bordered={false} 
          defaultActiveKey={['1']} 
          accordion
          onChange={(key) => {
            if (typeof key === 'string') setActiveKey(key);
            else if (Array.isArray(key) && key.length > 0) setActiveKey(key[0]);
          }} 
          />
        </Col>
        <Col span={16}>
          <div style={{ width: "90%", height: "600px", marginLeft: "auto" }}>
            <AdvancedRealTimeChart autosize={true} studies={studyMap[activeKey]} />
          </div>
        </Col>
      </Row>
    </>
  );
}
