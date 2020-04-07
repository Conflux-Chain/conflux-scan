import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import PropTypes from 'prop-types';
import * as commonCss from '../../globalStyles/common';
import CopyButton from '../../components/CopyButton';
import QrcodeButton from '../../components/QrcodeButton';
import TableLoading from '../../components/TableLoading';
import { reqAccount } from '../../utils/api';
import { errorCodes } from '../../constants';
import media from '../../globalStyles/media';
import { convertToValueorFee, i18n, renderAny } from '../../utils';

const HeadBar = styled.div`
  margin-top: 24px;
  width: 100%;
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 24px;
  .sep {
    display: none;
  }
  .sep + div {
    margin-left: 10px;
  }
  ${media.pad`
    padding-left: 16px;
    .sep{display: block;}
    .sep + div {
      margin-left: 0;
    }
    p {
      word-break: break-all;
      padding-top: 5px;
      padding-bottom: 5px;
    }
  `}
  * {
    display: inline-block;
    margin: 0;
  }
  h1 {
    color: #000;
    font-size: 20px;
    font-weight: 700;
    margin-right: 24px;
  }
`;

const fullWidthMobile = media.pad`
  width: auto;
  margin-left: 0px;
  margin-right: 24px;
  padding-top: 16px;
  padding-bottom: 24px;
  border-left: 0;
`;

const Statistic = styled.div`
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  width: 100%;
  height: 100px;
  display: flex;
  ${media.pad`
    display: block;
    height: auto;
    margin-left: 16px;
    margin-right: 16px;
    width: auto;
  `}
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 34px;
  ${commonCss.lightBorder}

  .transaction {
    width: 22%;
    ${fullWidthMobile}
    ${media.pad`border-bottom: 1px solid rgba(0, 0, 0, 0.08);`}
  }
  .miner {
    width: 20%;
    border-left: 1px solid rgba(0, 0, 0, 0.08);
    ${fullWidthMobile}
    ${media.pad`border-bottom: 1px solid rgba(0, 0, 0, 0.08);`}
  }
  .balance {
    width: 24%;
    border-left: 1px solid rgba(0, 0, 0, 0.08);
    ${fullWidthMobile}
    ${media.pad`border-bottom: 1px solid rgba(0, 0, 0, 0.08);`}
  }
  .seen {
    width: 36%;
    border-left: 1px solid rgba(0, 0, 0, 0.08);
    ${fullWidthMobile}
  }
  .wrap {
    /* height: 68px; */
    width: 100%;
    display: flex;
    align-items: flex-start;
    * {
      font-size: 16px;
    }
    svg {
      width: 32px;
      height: 32px;
      opacity: 0.38;
      margin: 0 16px;
      margin-top: 5px;
    }
    h2 {
      margin-bottom: 7px;
    }
  }
  .balance .wrap svg {
    opacity: 1;
  }
  .sectionWrap {
    width: 100%;
    display: flex;
    ${media.pad`display: block;`}
    section {
      flex: 1;
      p {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.87);
      }
      &:nth-child(2) {
        ${media.pad`padding-top: 24px;`}
      }
    }
  }
`;

class AccountHead extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      isLoading: false,
      accountDetail: {},
    };

    document.addEventListener('update-blockcount', (event) => {
      const { accountDetail } = this.state;
      const { accountid: accountIdCur } = this.props;
      if (accountDetail.blockCount !== event.total) {
        this.fetchAccountDetail(accountIdCur);
      }
    });
  }

  componentDidMount() {
    const { accountid } = this.props;
    this.fetchAccountDetail(accountid);
  }

  componentDidUpdate(prevProps) {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.props.accountid !== prevProps.accountid) {
      // eslint-disable-next-line react/destructuring-assignment
      this.fetchAccountDetail(this.props.accountid);
    }
  }

  fetchAccountDetail(accountid) {
    const { history, onFetchErr } = this.props;
    this.setState({ isLoading: true });

    reqAccount({ address: accountid }).then((body) => {
      if (body.code === 0) {
        this.setState({
          accountDetail: body.result,
          isLoading: false,
        });
      } else if (body.code === errorCodes.ParameterError) {
        history.push(`/search-notfound?searchId=${accountid}`);
      } else {
        this.setState({
          isLoading: false,
        });
        onFetchErr();
      }
    });
  }

  render() {
    const { accountid } = this.props;
    const { isLoading, accountDetail } = this.state;

    return (
      <Fragment>
        <HeadBar>
          <h1>{i18n('Account')}</h1>
          <p>{accountid}</p>
          <br className="sep" />
          <CopyButton txtToCopy={accountid} toolTipId="Copy address to clipboard" />
          <QrcodeButton titleTxt={accountid} qrTxt={accountid} tooltipId="Click to view QR Code" />
        </HeadBar>
        {isLoading && <TableLoading />}
        <Statistic>
          <div className="transaction">
            <div className="wrap">
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#iconshiliangzhinengduixiang" />
              </svg>
              <div>
                <h2>{i18n('app.pages.account.detail.transactions')}</h2>
                <p>
                  <span>{accountDetail.transactionCount}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="miner">
            <div className="wrap">
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#iconwakuang" />
              </svg>
              <div>
                <h2>{i18n('Mined Blocks')}</h2>
                <p>{accountDetail.blockCount}</p>
              </div>
            </div>
          </div>
          <div className="balance">
            <div className="wrap">
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#iconEquilibrium-type" />
              </svg>
              <div>
                <h2>{i18n('Balance')}</h2>
                {convertToValueorFee(accountDetail.balance)}
                <span style={{ marginLeft: 5 }}>CFX</span>
                {/* <EllipsisLine unit="CFX" text={} /> */}
              </div>
            </div>
          </div>
          <div className="seen">
            <div className="wrap">
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#iconliulan" />
              </svg>
              <div className="sectionWrap">
                <section>
                  <h2>{i18n('First Seen')}</h2>
                  {renderAny(() => {
                    if (!accountDetail.firstTime) {
                      return i18n('No Record');
                    }
                    return <p>{moment(accountDetail.firstTime * 1000).format('YYYY-MM-DD HH:mm:ss')}</p>;
                  })}
                </section>
                <section>
                  <h2>{i18n('Last Seen')}</h2>
                  {renderAny(() => {
                    if (!accountDetail.lastTime) {
                      return i18n('No Record');
                    }
                    return <p>{moment(accountDetail.lastTime * 1000).format('YYYY-MM-DD HH:mm:ss')}</p>;
                  })}
                </section>
              </div>
            </div>
          </div>
        </Statistic>
      </Fragment>
    );
  }
}

AccountHead.propTypes = {
  accountid: PropTypes.string.isRequired,
  onFetchErr: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default AccountHead;
