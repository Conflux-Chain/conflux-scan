/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import * as commonCss from '../../globalStyles/common';
import CopyButton from '../../components/CopyButton';
import QrcodeButton from '../../components/QrcodeButton';
import TableLoading from '../../components/TableLoading';
import EllipsisLine from '../../components/EllipsisLine';
import { reqContract, reqAccount, reqTokenList } from '../../utils/api';
import { errorCodes } from '../../constants';
import media from '../../globalStyles/media';
import { convertToValueorFee, i18n, renderAny, isContract } from '../../utils';
import TokenSelect from '../../components/TokenSelect';
import imgtokenIcon from '../../assets/images/icons/token-icon.svg';
import contractNameIcon from '../../assets/images/icons/contract-nameicon.svg';
import iconEdit from '../../assets/images/icons/icon-edit.svg';
import iconEditHover from '../../assets/images/icons/icon-edit-hover.svg';
import iconOpen from '../../assets/images/icons/icon-open.svg';
import iconOpenHover from '../../assets/images/icons/icon-open-hover.svg';

const HeadBar = styled.div`
  margin-top: 24px;
  width: 100%;
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

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

  .address-righticon {
    margin-left: 10px;
    width: 32px;
    height: 32px;
    background: rgba(0, 0, 0, 0.08);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      cursor: pointer;
      background: rgba(0, 0, 0, 0.54);
    }
    .open-icon {
      cursor: pointer;
      width: 32px;
      height: 32px;
      display: block;
      background-image: url("${iconOpen}");
      &:hover {
        background-image: url("${iconOpenHover}");
      }
    }
    .edit-icon {
      cursor: pointer;
      width: 32px;
      height: 32px;
      display: block;
      background-image: url("${iconEdit}");
      &:hover {
        background-image: url("${iconEditHover}");
      }
    }
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
  .token {
    width: 15%;
    border-left: 1px solid rgba(0, 0, 0, 0.08);
    ${fullWidthMobile}
    ${media.pad`border-bottom: 1px solid rgba(0, 0, 0, 0.08);`}
  }
  .token-select {
    width: 346px;
    margin-top: -10px;
    ${media.mobile`
      width: auto;
      margin-left: 20px;
      margin-right: 20px;
    `}
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
    ${media.mobile`
      margin-right: 0px;
    `}
  }
  .wrap {
    /* height: 68px; */
    width: 100%;
    display: flex;
    align-items: flex-start;
    * {
      font-size: 16px;
    }
    svg,
    img {
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
  .token .wrap img {
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

const ContractInfoPanel = styled.div`
  display: flex;
  flex-wrap: wrap;
  border-radius: 4px;
  margin-bottom: 35px;

  > div {
    box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px 1px;
    margin-left: 24px;
    flex: 1;
    ${media.pad`
      margin-left: 17px;
      margin-top: 20px;
      margin-right: 15px;
    `}
    &:first-child {
      margin-left: 0;
      ${media.pad`
        margin-left: 17px;
        margin-top: 0px;
      `}
    }
  }
  .contract-info-row {
    display: flex;
    &:first-of-type .contract-left-info {
      padding-top: 24px;
    }
    &:first-of-type .contract-right-val {
      padding-top: 24px;
    }
    img {
      width: 21px;
      height: 21px;
      margin-right: 8px;
    }
  }
  .contract-left-info {
    width: 202px;
    padding-left: 17px;
    background: rgba(237, 242, 249, 1);
    padding-bottom: 24px;
    font-size: 16px;
    line-height: 19px;
    font-weight: bold;
    color: rgba(33, 33, 33, 1);
    flex-shrink: 0;
    ${media.pad`
     width: 120px;
   `}
  }

  .contract-right-val {
    flex: 1;
    background: #fff;
    padding-left: 17px;
    padding-bottom: 24px;
    font-size: 16px;
    line-height: 16px;
    color: rgba(33, 33, 33, 1);
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    > span {
      margin-right: 5px;
    }
  }
  .info-right-col .contract-info-row {
    background: #fff;
    height: 100%;
  }
`;

class AccountHead extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      isLoading: false,
      accountDetail: {},

      // contract 部分
      creatorTransaction: {
        hash: '',
        from: '',
      },
    };
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
    const { history, onFetchErr, updateBlockCount } = this.props;
    this.setState({ isLoading: true });

    reqAccount({ address: accountid }).then((body) => {
      if (body.code === 0) {
        this.setState({
          accountDetail: body.result,
          creatorTransaction: body.result.creatorTransaction || {},
          isLoading: false,
        });
        updateBlockCount(body.result.blockCount);
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

  renderContractToken() {
    const { accountid, contractInfo = {} } = this.props;
    if (!isContract(accountid)) {
      return null;
    }

    const { creatorTransaction } = this.state;

    return (
      <ContractInfoPanel>
        <div>
          <div className="contract-info-row">
            <div className="contract-left-info">{i18n('app.pages.contract.nameTag')}</div>
            <div className="contract-right-val">
              {contractInfo.icon && <img src={contractInfo.icon} />}
              {contractInfo.name || i18n('app.pages.account.notfound')}
            </div>
          </div>
          <div className="contract-info-row">
            <div className="contract-left-info">{i18n('Token Tracker')}</div>
            <div className="contract-right-val">
              {contractInfo.tokenIcon && <img src={contractInfo.tokenIcon} />}
              {contractInfo.tokenName ? <a>{contractInfo.tokenName}</a> : i18n('app.pages.account.notfound.tokenTracker')}
            </div>
          </div>
        </div>

        <div className="info-right-col">
          <div className="contract-info-row">
            <div className="contract-left-info">{i18n('Contract Creator')}</div>
            <div className="contract-right-row">
              {creatorTransaction.hash && (
                <div className="contract-right-val">
                  <EllipsisLine linkTo={`/address/${creatorTransaction.from}`} text={creatorTransaction.from} />
                  {i18n('contract.at-txn1')}
                  <EllipsisLine linkTo={`/transactionsdetail/${creatorTransaction.hash}`} text={creatorTransaction.hash} />
                  {i18n('contract.at-txn2')}
                </div>
              )}
            </div>
          </div>
        </div>
      </ContractInfoPanel>
    );
  }

  render() {
    const { accountid, intl, contractInfo, tokenTotal, tokenList = [] } = this.props;
    const { isLoading, accountDetail } = this.state;

    const isContractAddr = isContract(accountid);
    const tokenOpts = tokenList.map((v) => {
      return {
        key: v.address,
        value: v.address,
        imgSrc: v.tokenIcon,
        label1: `${v.tokenName} (${v.tokenSymbol})`,
        label2: `${v.balance} ${v.tokenSymbol}`,
      };
    });

    const toolTip4 = intl.formatMessage({
      id: 'Click to enter the official site',
    });

    return (
      <Fragment>
        <HeadBar>
          <h1>{isContractAddr ? i18n('Contract') : i18n('Address')}</h1>
          <p>{accountid}</p>
          <br className="sep" />
          <CopyButton txtToCopy={accountid} toolTipId="Copy address to clipboard" />
          <QrcodeButton titleTxt={accountid} qrTxt={accountid} tooltipId="Click to view QR Code" />
          {isContractAddr && (
            <Fragment>
              <Link
                to={renderAny(() => {
                  if (Object.keys(contractInfo).length === 0) {
                    return `/contract/create?address=${accountid}`;
                  }
                  return `/contract/update/${accountid}`;
                })}
                className="address-righticon"
                data-inverted=""
                data-tooltip={renderAny(() => {
                  if (Object.keys(contractInfo).length === 0) {
                    return intl.formatMessage({
                      id: 'Click to create contract',
                    });
                  }
                  return intl.formatMessage({
                    id: 'Click to edit contract',
                  });
                })}
                data-position="bottom left"
              >
                <i className="edit-icon" />
              </Link>
              {contractInfo.website && (
                <a
                  href={contractInfo.website}
                  target="_blank"
                  className="address-righticon"
                  data-inverted=""
                  data-tooltip={toolTip4}
                  data-position="bottom left"
                >
                  <i className="open-icon" />
                </a>
              )}
            </Fragment>
          )}
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

          <div className="balance">
            <div className="wrap">
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#iconEquilibrium-type" />
              </svg>
              <div>
                <h2>{i18n('Balance')}</h2>
                {renderAny(() => {
                  const val = convertToValueorFee(accountDetail.balance);
                  if (val.length > 18) {
                    return (
                      <span style={{ display: 'inline-block' }}>
                        <EllipsisLine text={val} />
                      </span>
                    );
                  }
                  return val;
                })}
                <span style={{ marginLeft: 5 }}>CFX</span>
              </div>
            </div>
          </div>

          <div className="token">
            <div className="wrap">
              <img src={imgtokenIcon} />
              <div>
                <h2>{i18n('Token')}</h2>
                <p>
                  {tokenTotal} {i18n('num.Tokens')}
                </p>
              </div>
            </div>
          </div>

          <div className="seen">
            <div className="token-select">
              <TokenSelect blueVal={tokenTotal} text="Tokens" options={tokenOpts} />
            </div>
          </div>
        </Statistic>
        {this.renderContractToken()}
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
  updateBlockCount: PropTypes.func.isRequired,
  intl: PropTypes.objectOf({
    formatMessage: PropTypes.func,
  }).isRequired,
  contractInfo: PropTypes.object,
  tokenTotal: PropTypes.number,
  tokenList: PropTypes.arrayOf({
    balance: PropTypes.number,
  }).isRequired,
};

export default injectIntl(AccountHead);
