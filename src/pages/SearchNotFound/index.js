import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { injectIntl, FormattedMessage } from 'react-intl';
import querystring from 'querystring';
import media from '../../globalStyles/media';

const nfImg = require('../../assets/images/404.gif');

const NfWrapDiv = styled.div`
  margin-top: 103px;
  margin-left: 126px;
  ${media.pad`margin-left: 60px;`}
  img {
    width: 255px;
  }
  .title {
    font-size: 54px;
    strong {
      margin-left: 5px;
    }
  }
  .row2,
  .row3,
  .row4 {
    font-size: 20px;
  }
  .row3 {
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
    let { searchId, location } = this.props;
    if (!searchId) {
      const parsed = querystring.parse(location.search.replace(/^\?/, ''));
      if (parsed.searchId) {
        searchId = parsed.searchId;
      }
    }

    return (
      <NfWrapDiv>
        <img src={nfImg} className="img" />
        <div className="title">
          <FormattedMessage id="app.pages.SearchNotFound.title" />
        </div>

        <div className="row2">
          <FormattedMessage id="app.pages.SearchNotFound.row2" />
        </div>
        <div className="row3">{searchId}</div>
        <div className="row4">
          <FormattedMessage id="app.pages.SearchNotFound.row4" />
        </div>

        <div className="row5">
          <FormattedMessage id="app.pages.NotFoundTx.ask" />
          <FormattedMessage id="app.pages.NotFoundTx.concatus">{(txt) => <a href="mailto:hr@conflux-chain.org">{txt}</a>}</FormattedMessage>
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
};

SearchNotFound.defaultProps = {
  searchId: '',
  location: {
    search: '',
  },
};

export default injectIntl(SearchNotFound);
