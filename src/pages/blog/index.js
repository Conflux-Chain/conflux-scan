import React, { Component } from 'react';

class Blog extends Component {
  render() {
    return (
      <div className="blog-box">
        <div className="bl-banner">{/* <img  src={require('../../assets/blogImg/conflux_1366.png')} alt=""/> */}</div>
        <ul className="bl-ul">
          <li className="bl-li">
            <a href="https://www.forbes.com/sites/darrynpollock/2018/12/04/notable-investors-pursuing-dapp-protocol-conflux-despite-market-concern/?from=singlemessage&isappinstalled=0#3418c0fe1a2c">
              <img className="bl-img" src={require('../../assets/images/blogImg/pic_1.png')} alt="" />
              <div clas="bl-right">
                <p className="bl-title">我是1标题</p>
                <p className="bl-con">我是内容</p>
              </div>
            </a>
          </li>
        </ul>
      </div>
    );
  }
}
export default Blog;
