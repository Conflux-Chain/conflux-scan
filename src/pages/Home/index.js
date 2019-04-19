import React from 'react';

function Home() {
  return (
    <div className="home">
      <div className="banner">
        <p>banner</p>
      </div>
      <section className="ourselves">
        <div className="our-left">
          <img src={require('../../assets/images/homeImg/tps.png')} />
        </div>
        <div className="our-right">
          <p className="our-title">我是标题2</p>
          <p className="our-con">我是副标题</p>
          <a href="" className="button">
            我是按钮
          </a>
        </div>
      </section>
      <section className="property">
        <p className="pro-title">我是标题</p>
        <div className="pro-top">
          <div className="top-left">
            <p className="pro-subhead">我是小标题</p>
            <p className="pro-con">我是内容</p>
          </div>
          <div className="top-right" />
        </div>
        <div className="pro-bottom">
          <div className="bottom-left" />
          <div className="bottom-right">
            <p className="pro-subhead">我是小标题</p>
            <p className="pro-con">我是内容</p>
          </div>
        </div>
      </section>
      <section className="product">
        <p className="product-title">我是标题</p>
        <div className="product-left">
          <img className="product-img" src={require('../../assets/images/homeImg/scalability.png')} />
          <p className="product-subhead">扩容性</p>
          <p className="product-con">我是扩容内容</p>
        </div>
        <div className="product-center">
          <img className="product-img" src={require('../../assets/images/homeImg/security.png')} />
          <p className="product-subhead">扩容性</p>
          <p className="product-con">我是扩容内容</p>
        </div>
        <div className="product-right">
          <img className="product-img" src={require('../../assets/images/homeImg/extensibility.png')} />
          <p className="product-subhead">扩容性</p>
          <p className="product-con">我是扩容内容</p>
        </div>
      </section>
      <section className="roadMap">
        <div className="road-title">我是标题</div>
        <div className="line-top">
          <div className="top-title">
            <span className="title1">我是我</span>
            <span className="title2">我是我</span>
            <span className="title3">我是我</span>
          </div>
          <div className="top-time">
            <span className="time1">2018.1</span>
            <span className="time2">2018.1</span>
            <span className="time3">2018.1</span>
          </div>
        </div>
        <div className="line" />
        <div className="line-bottom">
          <div className="bot-title">
            <span className="bot-title1">我是我</span>
            <span className="bot-title2">我是我</span>
            <span className="bot-title3">我是我</span>
          </div>
          <div className="bot-time">
            <span className="bot-time1">2018.1</span>
            <span className="bot-time2">2018.1</span>
            <span className="bot-time3">2018.1</span>
          </div>
        </div>
      </section>
      <section className="tea">
        <a
          href="https://www.forbes.com/sites/darrynpollock/2018/12/04/notable-investors-pursuing-dapp-protocol-conflux-despite-market-concern/?from=singlemessage&isappinstalled=0#404e338b1a2c"
          target="_blank"
        >
          <div className="tea-a">
            <img src={require('../../assets/images/homeImg/forbes.jpg')} />
          </div>
        </a>
        <a href="http://fortune.com/2018/12/04/conflux-blockchain/?from=singlemessage&isappinstalled=0" target="_blank">
          <div className="tea-a">
            <img src={require('../../assets/images/homeImg/fortune.jpg')} />
          </div>
        </a>
        <a href="http://www.mittrchina.com/news/%203376" target="_blank">
          <div className="tea-a">
            <img src={require('../../assets/images/homeImg/36kr.jpg')} />
          </div>
        </a>
        <a href="https://36kr.com/p/5164892.html" target="_blank">
          <div className="tea-a">
            <img src={require('../../assets/images/homeImg/mit.jpg')} />
          </div>
        </a>
      </section>
    </div>
  );
}
export default Home;
