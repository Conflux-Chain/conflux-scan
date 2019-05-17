import React from 'react';
import { Link } from 'react-router-dom';
import sina from '../../assets/images/footImg/sina.png';
import twitter from '../../assets/images/footImg/twitter.png';
import hownet from '../../assets/images/footImg/hownet.png';
import wechat from '../../assets/images/footImg/wechat.png';
import github from '../../assets/images/footImg/github.png';
import medium from '../../assets/images/footImg/medium.png';
import telegram from '../../assets/images/footImg/telegram.png';
import email from '../../assets/images/footImg/email.png';

function Footer() {
  return (
    <div className="foot">
      <div className="link">
        <img className="code" alt="" />
        <div className="linkIcon">
          <a target="_blank" href="https://weibo.com/confluxchain">
            <img src={sina} />
          </a>
          <a target="_blank" href="https://twitter.com/ConfluxChain">
            <img src={twitter} />
          </a>
          <a target="_blank" href="https://www.zhihu.com/org/confluxzhong-wen-she-qu/">
            <img src={hownet} />
          </a>
          <a target="_blank" href="javascript:;">
            <img src={wechat} />
          </a>
          <a target="_blank" href="https://github.com/conflux-chain">
            <img src={github} />
          </a>
          <a target="_blank" href="https://medium.com/@Confluxchain">
            <img src={medium} />
          </a>
          <a target="_blank" href="http://t.me/Conflux_English">
            <img src={telegram} />
          </a>
          <a target="_blank" href="mailto:contact@conflux-chain.org">
            <img src={email} />
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
