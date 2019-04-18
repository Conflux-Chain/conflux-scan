import React from 'react';

function Media() {
  return (
    <div className="media-box">
      <ul className="me-ul">
        <li className="me-li">
          <a href="https://www.forbes.com/sites/darrynpollock/2018/12/04/notable-investors-pursuing-dapp-protocol-conflux-despite-market-concern/?from=singlemessage&isappinstalled=0#3418c0fe1a2c">
            <img className="me-img" src={require('../../assets/images/mediaImg/forbes.png')} alt="" />
            <div clas="me-right">
              <p className="me-title">我是1标题</p>
              <p className="me-con">我是内容</p>
            </div>
          </a>
        </li>
        <li className="me-li">
          <a href="http://fortune.com/2018/12/04/conflux-blockchain/?from=singlemessage&isappinstalled=0">
            <img className="me-img" src={require('../../assets/images/mediaImg/fortune.png')} alt="" />
            <div clas="me-right">
              <p className="me-title">我是1标题</p>
              <p className="me-con">我是内容</p>
            </div>
          </a>
        </li>
        <li className="me-li">
          <a href="http://www.mittrchina.com/news/%203376">
            <img className="me-img" src={require('../../assets/images/mediaImg/mit.png')} alt="" />
            <div clas="me-right">
              <p className="me-title">我是1标题</p>
              <p className="me-con">我是内容</p>
            </div>
          </a>
        </li>
        <li className="me-li">
          <a href="https://36kr.com/p/5164892">
            <img className="me-img" src={require('../../assets/images/mediaImg/36kr.png')} alt="" />
            <div clas="me-right">
              <p className="me-title">我是1标题</p>
              <p className="me-con">我是内容</p>
            </div>
          </a>
        </li>
      </ul>
    </div>
  );
}
export default Media;
