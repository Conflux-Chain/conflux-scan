import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { injectIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import media from '../globalStyles/media';

const nfImg = require('../assets/images/404.gif');

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
class PageNotFound extends PureComponent {
  render() {
    const { location } = this.props;

    return (
      <NfWrapDiv>
        <img src={nfImg} className="img" />
        <div className="title">
          <FormattedHTMLMessage id="app.pages.pageNotFound.title" />
        </div>

        <div className="row2">
          <FormattedMessage id="app.pages.pageNotFound.row2" />
        </div>

        <div className="row5">
          <FormattedMessage id="app.pages.notFoundTx.ask" />
          <FormattedMessage id="app.pages.notFoundTx.concatus">
            {(txt) => (
              <a target="_blank" href="mailto:feedbacks@conflux-chain.org">
                {txt}
              </a>
            )}
          </FormattedMessage>
        </div>
      </NfWrapDiv>
    );
  }
}

PageNotFound.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
};

PageNotFound.defaultProps = {
  location: {
    search: '',
  },
};

export default injectIntl(PageNotFound);
