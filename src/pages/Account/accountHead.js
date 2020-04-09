import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import PropTypes from 'prop-types';
import * as commonCss from '../../globalStyles/common';
import CopyButton from '../../components/CopyButton';
import QrcodeButton from '../../components/QrcodeButton';
import TableLoading from '../../components/TableLoading';
import EllipsisLine from '../../components/EllipsisLine';
import { reqContract, reqAccount, reqTokenList } from '../../utils/api';
import { errorCodes, IMG_PFX } from '../../constants';
import media from '../../globalStyles/media';
import { convertToValueorFee, i18n, renderAny, isContract } from '../../utils';
import TokenSelect from '../../components/TokenSelect';
import imgtokenIcon from '../../assets/images/icons/token-icon.svg';
import contractNameIcon from '../../assets/images/icons/contract-nameicon.svg';

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
  .token {
    width: 15%;
    border-left: 1px solid rgba(0, 0, 0, 0.08);
    ${fullWidthMobile}
    ${media.pad`border-bottom: 1px solid rgba(0, 0, 0, 0.08);`}
  }
  .token-select {
    width: 346px;
    margin-top: -10px;
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
  border-radius: 4px;
  margin-bottom: 35px;

  > div {
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
    margin-left: 24px;
    flex: 1;
    &:first-child {
      margin-left: 0;
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
      tokenList: [],
      tokenTotal: 0,

      // contract 部分
      contractName: '',
      tokenName: '',
      tokenIcon: '',
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

    reqTokenList({
      address: accountid,
    }).then((body) => {
      this.setState({
        tokenTotal: body.result.total,
        tokenList: body.result.list || [],
      });
    });

    // accountid = '0x8123123'
    if (isContract(accountid)) {
      const fields = ['address', 'type', 'name', 'webside', 'tokenName', 'tokenSymbol', 'tokenDecimal'].join(',');

      reqContract({
        fields,
        address: accountid,
      }).then((body) => {
        this.setState({
          contractName: body.result.name,
          tokenName: body.result.tokenName,
          tokenIcon: body.result.tokenIcon,
        });
      });
    }
  }

  renderContractToken() {
    const { accountid } = this.props;
    if (!isContract(accountid)) {
      return null;
    }

    const { contractName, tokenName, tokenIcon, creatorTransaction } = this.state;

    return (
      <ContractInfoPanel>
        <div>
          <div className="contract-info-row">
            <div className="contract-left-info">{i18n('Contract Name')}</div>
            <div className="contract-right-val">
              <img src={IMG_PFX + contractNameIcon} />
              {contractName}
            </div>
          </div>
          <div className="contract-info-row">
            <div className="contract-left-info">{i18n('Token Tracker')}</div>
            <div className="contract-right-val">
              {tokenIcon && <img src={IMG_PFX + tokenIcon} />}
              <a>{tokenName}</a>
            </div>
          </div>
        </div>

        <div className="info-right-col">
          <div className="contract-info-row">
            <div className="contract-left-info">{i18n('Contract Creator')}</div>
            <div className="contract-right-row">
              <div className="contract-right-val">
                <EllipsisLine linkTo="/todo----/" text={creatorTransaction.from} />
                {i18n('contract.at-txn1')}
                <EllipsisLine linkTo={`/transactionsdetail/${creatorTransaction.hash}`} text={creatorTransaction.hash} />
                {i18n('contract.at-txn2')}
              </div>
            </div>
          </div>
        </div>
      </ContractInfoPanel>
    );
  }

  render() {
    const { accountid } = this.props;
    const { isLoading, accountDetail, tokenTotal, tokenList } = this.state;

    const tokenOpts = tokenList.map((v) => {
      return {
        key: v.address,
        value: v.address,
        imgSrc: IMG_PFX + v.tokenIcon,
        label1: `${v.tokenName} (${v.tokenSymbol})`,
        label2: `${v.balance} ${v.tokenSymbol}`,
      };
    });

    return (
      <Fragment>
        <HeadBar>
          <h1>{i18n('Address')}</h1>
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

          <div className="balance">
            <div className="wrap">
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#iconEquilibrium-type" />
              </svg>
              <div>
                <h2>{i18n('Balance')}</h2>
                {convertToValueorFee(accountDetail.balance)}
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
};

export default AccountHead;
