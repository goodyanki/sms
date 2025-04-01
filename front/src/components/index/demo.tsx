import React, { useState, useRef } from 'react';
import BannerAnim, { Element } from 'rc-banner-anim';
import QueueAnim from 'rc-queue-anim';
import { TweenOneGroup } from 'rc-tween-one';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import 'rc-banner-anim/assets/index.css';
import 'rc-queue-anim/assets/index.css';

const textData = {
  content:
    'Taiwan called motorcycle, motor bike [1] or a motorcycle,' +
    ' the motorcycle referred to in the mainland, ' +
    'Hong Kong and Southeast Asia known as motorcycles [2], ' +
    'is a driven by the engine, ' +
    'operated by a hand or two directions three-wheeled vehicles, is a means of transport. ' +
    'In some military or police applications, will add a side compartment and a secondary wheel, ' +
    'become a special three-wheeled motorcycle, mobility Zheyi common plug-in auxiliary wheels.',
  title: 'Motorcycle',
};

const dataArray = [
  {
    pic: 'https://zos.alipayobjects.com/rmsportal/ogXcvssYXpECqKG.png',
    map: 'https://zos.alipayobjects.com/rmsportal/HfBaRfhTkeXFwHJ.png',
    color: '#FFF43D',
    background: '#F6B429',
  },
  {
    pic: 'https://zos.alipayobjects.com/rmsportal/iCVhrDRFOAJnJgy.png',
    map: 'https://zos.alipayobjects.com/rmsportal/XRfQxYENhzbfZXt.png',
    color: '#FF4058',
    background: '#FC1E4F',
  },
  {
    pic: 'https://zos.alipayobjects.com/rmsportal/zMswSbPBiQKvARY.png',
    map: 'https://zos.alipayobjects.com/rmsportal/syuaaBOvttVcNks.png',
    color: '#9FDA7F',
    background: '#64D487',
  },
].map((item) => ({ ...item, ...textData }));

const DetailSwitchDemo: React.FC<{ className?: string }> = ({ className = 'details-switch-demo' }) => {
  const [showInt, setShowInt] = useState(0);
  const [delay, setDelay] = useState(0);
  const [imgAnim, setImgAnim] = useState([
    { translateX: [0, 300], opacity: [1, 0] },
    { translateX: [0, -300], opacity: [1, 0] },
  ]);

  const bannerImgRef = useRef<any>(null);
  const bannerTextRef = useRef<any>(null);
  const hasEntered = useRef(false);

  const onChange = () => {
    if (!hasEntered.current) {
      setDelay(300);
      hasEntered.current = true;
    }
  };

  const onLeft = () => {
    const newShowInt = Math.max(showInt - 1, 0);
    setImgAnim([
      { translateX: [0, -300], opacity: [1, 0] },
      { translateX: [0, 300], opacity: [1, 0] },
    ]);
    setShowInt(newShowInt);
    bannerImgRef.current?.prev();
    bannerTextRef.current?.prev();
  };

  const onRight = () => {
    const newShowInt = Math.min(showInt + 1, dataArray.length - 1);
    setImgAnim([
      { translateX: [0, 300], opacity: [1, 0] },
      { translateX: [0, -300], opacity: [1, 0] },
    ]);
    setShowInt(newShowInt);
    bannerImgRef.current?.next();
    bannerTextRef.current?.next();
  };

  const getDuration = (e: any) => (e.key === 'map' ? 800 : 1000);

  return (
    <div
      className={`${className}-wrapper`}
      style={{ background: dataArray[showInt].background }}
    >
      <div className={className}>
        <BannerAnim
          prefixCls={`${className}-img-wrapper`}
          sync
          type="across"
          duration={1000}
          ease="easeInOutExpo"
          arrow={false}
          thumb={false}
          ref={bannerImgRef}
          onChange={onChange}
          dragPlay={false}
        >
          {dataArray.map((item, i) => (
            <Element key={i} style={{ background: item.color, height: '100%' }} leaveChildHide>
              <QueueAnim
                animConfig={imgAnim}
                duration={getDuration}
                delay={[!i ? delay : 300, 0]}
                ease={['easeOutCubic', 'easeInQuad']}
                key="img-wrapper"
              >
                <div className={`${className}-map map${i}`} key="map">
                  <img src={item.map} width="100%" />
                </div>
                <div className={`${className}-pic pic${i}`} key="pic">
                  <img src={item.pic} width="100%" />
                </div>
              </QueueAnim>
            </Element>
          ))}
        </BannerAnim>

        <BannerAnim
          prefixCls={`${className}-text-wrapper`}
          sync
          type="across"
          duration={1000}
          arrow={false}
          thumb={false}
          ease="easeInOutExpo"
          ref={bannerTextRef}
          dragPlay={false}
        >
          {dataArray.map((item, i) => (
            <Element key={i}>
              <QueueAnim
                type="bottom"
                duration={1000}
                delay={[!i ? delay + 500 : 800, 0]}
              >
                <h1 key="h1">{item.title}</h1>
                <em key="em" style={{ background: item.background }} />
                <p key="p">{item.content}</p>
              </QueueAnim>
            </Element>
          ))}
        </BannerAnim>

        <TweenOneGroup enter={{ opacity: 0, type: 'from' }} leave={{ opacity: 0 }}>
          {showInt > 0 && <LeftOutlined key="left" onClick={onLeft} />}
          {showInt < dataArray.length - 1 && <RightOutlined key="right" onClick={onRight} />}
        </TweenOneGroup>
      </div>
    </div>
  );
};

export default DetailSwitchDemo;
