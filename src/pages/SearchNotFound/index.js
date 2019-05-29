import React, { PureComponent } from 'react';
import styled from 'styled-components';
import media from '../../globalStyles/media';
import CopyButton from '../../components/CopyButton';

const nfImg = require('../../assets/images/box3.gif');

const NfWrapDiv = styled.div`
  margin-top: 150px;
  ${media.pad`margin-top: 120px`}
  ${media.tablet`margin-top: 100px`}
  ${media.mobile`margin-top: 0`}
  overflow: hidden;
  .img {
    float: left;
    margin-left: 80px;
    margin-right: 72px;
    margin-bottom: 100px;
    ${media.pad`
      margin-left: 20px;
      margin-right: 30px;
    `}
    ${media.tablet`
      width: 150px;
      margin-left: 20px;
      margin-right: 30px;
    `}
    ${media.mobile`
      display: none;
    `}
  }
  .right {

  }
  .title {
    font-size: 54px;
    ${media.pad`font-size: 40px`}
    ${media.tablet`font-size: 32px`}
    ${media.mobile`font-size: 24px; margin-top: 20px`}
  }
  .row2 {
    font-size: 20px;
    margin-top: 20px;
  }
  .row3 {
    font-size: 20px;
  }
  .packing {
    margin-left: 4px;
  }
`;
class SearchNotFound extends PureComponent {
  render() {
    const copyId = '0x8a0df7cca3b4310x8a0df7cca3b4310x8a0df7cca3b4310x8a0df7cca3b431';
    return (
      <NfWrapDiv>
        <img src={nfImg} className="img" />
        <div className="right">
          <div className="title">
            <span>Sorry your </span>
            <strong> Transaction</strong>
          </div>

          <div className="row2">
            <span>0x8a0df7cca3b431…</span>
            <CopyButton style={{ marginLeft: 5 }} txtToCopy={copyId} btnType="two" toolTipId="app.pages.searchNotFound.tooltip" />
            <span className="packing">is packing, please w</span>
          </div>

          <div className="row3">
            <span> If you think there is someting wrong, please</span>
            <a> contact us</a>
          </div>
        </div>
      </NfWrapDiv>
    );
  }
}
export default SearchNotFound;
