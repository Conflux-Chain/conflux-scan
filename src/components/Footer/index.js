import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import sina from '../../assets/images/footImg/sina.png';
import twitter from '../../assets/images/footImg/twitter.png';
import hownet from '../../assets/images/footImg/hownet.png';
import wechat from '../../assets/images/footImg/wechat.png';
import github from '../../assets/images/footImg/github.png';
import medium from '../../assets/images/footImg/medium.png';
import telegram from '../../assets/images/footImg/telegram.png';
import email from '../../assets/images/footImg/email.png';

const Wrapper = styled.footer`
  width: 100%;
  padding: 30px 0;
  text-align: center;
  border-top: 1px solid #ccc;
`;

const ImgIcon = styled.img`
  width: 24px;
  height: 24px;
  margin: 10px;
`;

function Footer() {
  return (
    <Wrapper>
      <div className="link">
        <img className="code" alt="" />
        <div className="linkIcon">
          <a target="_blank" href="https://weibo.com/confluxchain">
            <ImgIcon src={sina} />
          </a>
          <a target="_blank" href="https://twitter.com/ConfluxChain">
            <ImgIcon src={twitter} />
          </a>
          <a target="_blank" href="https://www.zhihu.com/org/confluxzhong-wen-she-qu/">
            <ImgIcon src={hownet} />
          </a>
          <a target="_blank" href="javascript:;">
            <ImgIcon src={wechat} />
          </a>
          <a target="_blank" href="https://github.com/conflux-chain">
            <ImgIcon src={github} />
          </a>
          <a target="_blank" href="https://medium.com/@Confluxchain">
            <ImgIcon src={medium} />
          </a>
          <a target="_blank" href="http://t.me/Conflux_English">
            <ImgIcon src={telegram} />
          </a>
          <a target="_blank" href="mailto:contact@conflux-chain.org">
            <ImgIcon src={email} />
          </a>
        </div>
        <div className="Copyright">Copyright©2019 Conflux. All Rights Reserved</div>
      </div>
    </Wrapper>
  );
}

export default Footer;
