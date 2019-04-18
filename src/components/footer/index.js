import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className="foot">
      <div className="link">
        <img className="code" alt="" />
        <div className="linkIcon">
          <a target="_blank" href="https://weibo.com/confluxchain">
            <img src={require('../../assets/images/footImg/sina.png')} />
          </a>
          <a target="_blank" href="https://twitter.com/ConfluxChain">
            <img src={require('../../assets/images/footImg/twitter.png')} />
          </a>
          <a target="_blank" href="https://www.zhihu.com/org/confluxzhong-wen-she-qu/">
            <img src={require('../../assets/images/footImg/hownet.png')} />
          </a>
          <a target="_blank" href="javascript:;">
            <img src={require('../../assets/images/footImg/wechat.png')} />
          </a>
          <a target="_blank" href="https://github.com/conflux-chain">
            <img src={require('../../assets/images/footImg/github.png')} />
          </a>
          <a target="_blank" href="https://medium.com/@Confluxchain">
            <img src={require('../../assets/images/footImg/medium.png')} />
          </a>
          <a target="_blank" href="http://t.me/Conflux_English">
            <img src={require('../../assets/images/footImg/telegram.png')} />
          </a>
          <a target="_blank" href="mailto:contact@conflux-chain.org">
            <img src={require('../../assets/images/footImg/email.png')} />
          </a>
        </div>
        <div className="Copyright">Copyright©2019 Conflux. All Rights Reserved</div>
        <div className="clause">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/faqs">FAQs</Link>
        </div>
      </div>
    </div>
  );
}
export default Footer;
