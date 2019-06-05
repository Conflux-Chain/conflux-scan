import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { injectIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import querystring from 'querystring';
import media from '../../globalStyles/media';

const nfImg = require('../../assets/images/404.gif');

const NfWrapDiv = styled.div`
  background: #fff;
  padding-top: 103px;
  padding-left: 126px;
  padding-bottom: 20px;
  ${media.pad`padding-left: 60px;`}
  ${media.mobile`
    padding-top: 85px;
    padding-left: 16px;
  `}
  img {
    width: 255px;
    ${media.mobile`
      margin-bottom: 60px;
    `}
  }
  .title {
    font-size: 54px;
    strong {
      margin-left: 5px;
    }
    ${media.mobile`
      font-size: 34px;
      line-height: 41px;
    `}
  }
  .row2,
  .row3,
  .row4 {
    font-size: 20px;
  }
  .row3 {
    font-weight: bold;
    color: rgba(0, 0, 0, 0.54);
  }
  .row5 {
    font-size: 20px;
    a {
      text-decoration: underline;
      cursor: pointer;
      color: rgba(0, 0, 0, 0.87);
    }
  }
`;
class SearchNotFound extends PureComponent {
  render() {
    let { searchId, location, errMsg = '' } = this.props;
    if (!searchId) {
      const parsed = querystring.parse(location.search.replace(/^\?/, ''));
      if (parsed.searchId) {
        searchId = parsed.searchId;
        errMsg = parsed.errMsg;
      }
    }

    return (
      <NfWrapDiv>
        <img src={nfImg} className="img" />
        <div className="title">
          <FormattedHTMLMessage id="app.pages.searchNotFound.title" />
        </div>

        <div className="row2">
          <FormattedMessage id="app.pages.searchNotFound.row2" />
        </div>
        <div className="row3">{searchId}</div>
        <div className="row4">
          <FormattedMessage id={errMsg || 'app.pages.searchNotFound.row4'} />
        </div>

        <div className="row5">
          <FormattedMessage id="app.pages.notFoundTx.ask" />
          <FormattedMessage id="app.pages.notFoundTx.concatus">
            {(txt) => <a href="mailto:conflux-dev@conflux-chain.org">{txt}</a>}
          </FormattedMessage>
        </div>
      </NfWrapDiv>
    );
  }
}

SearchNotFound.propTypes = {
  searchId: PropTypes.string,
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
  errMsg: PropTypes.string,
};

SearchNotFound.defaultProps = {
  searchId: '',
  location: {
    search: '',
  },
  errMsg: '',
};

export default injectIntl(SearchNotFound);
