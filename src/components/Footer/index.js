import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

const Wrapper = styled.footer`
  width: calc(100% - 20px);
  margin: 30px auto 0;
  padding: 28px 0 20px;
  display: flex;
  justify-content: space-around;
  text-align: left;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
`;

const Content = styled.div`
  width: 100%;
  line-height: 1;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.56);
  margin-bottom: 13px;
`;

const Info = styled.div`
  color: rgba(0, 0, 0, 0.87);

  span {
    display: inline-block;
    margin-right: 14px;
    margin-bottom: 16px;
  }

  .icon {
    display: inline-block;
    width: 12px;
    height: 14px;
    fill: rgba(0, 0, 0, 0.38);
    overflow: hidden;
    margin-right: 10px;
  }
`;

const Copyright = styled.div`
  color: rgba(0, 0, 0, 0.38);
`;

const Links = styled.div`
  width: 120px;
  a {
    margin-left: 8px;
    margin-right: 8px;

    &:first-child {
      margin-left: 0;
    }

    &:last-child {
      margin-right: 0;
    }
    .icon {
      width: 24px;
      height: 24px;
      fill: #727272;
      overflow: hidden;
      transition: 0.3s fill;

      &:hover {
        fill: #000;
      }
    }
  }
`;

function Footer() {
  return (
    <Wrapper>
      <Content>
        <Title>
          <FormattedMessage id="app.footer.title" />
        </Title>
        <Info>
          <span>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#iconcall" />
            </svg>
            010-62662688
          </span>
          <span>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#iconemail" />
            </svg>
            <a href="mailto:hr@conflux-chain.org">hr@conflux-chain.org</a>
          </span>
          {/* <span> */}
          {/*  <svg className="icon" aria-hidden="true"> */}
          {/*    <use xlinkHref="#iconiclocationonpx" /> */}
          {/*  </svg> */}
          {/*  <FormattedMessage id="app.footer.address" /> */}
          {/* </span> */}
        </Info>
        <Copyright>Copyright © 2019 Conflux. All Rights Reserved</Copyright>
      </Content>
      <Links>
        <a href="https://twitter.com/ConfluxChain" target="_blank" title="Twitter">
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icontuite" />
          </svg>
        </a>
        <a href="https://github.com/conflux-chain" target="_blank" title="Github">
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icongithub" />
          </svg>
        </a>
        <a href="https://medium.com/@Confluxchain" target="_blank" title="Blog">
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#iconmedium" />
          </svg>
        </a>
      </Links>
    </Wrapper>
  );
}

export default Footer;
