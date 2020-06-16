/* eslint-disable no-case-declarations */
import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import compose from 'lodash/fp/compose';
import { connect } from 'react-redux';
import uniq from 'lodash/uniq';
import moment from 'moment';
import TableLoading from '../../components/TableLoading';
import EllipsisLine from '../../components/EllipsisLine';
import media from '../../globalStyles/media';
import { i18n, renderAny, dripTocfx, dripToGdrip, getAddressType, devidedByDecimals, tranferToLowerCase, wait } from '../../utils';
import NotFoundTx from '../NotFoundTx';
import Countdown from '../../components/Countdown';
import iconStatusErr from '../../assets/images/icons/status-err.svg';
import iconStatusSuccess from '../../assets/images/icons/status-success.svg';
import iconStatusSkip from '../../assets/images/icons/status-skip.svg';
import iconUnexecuted from '../../assets/images/icons/icon-unexecuted.svg';
import CopyButton from '../../components/CopyButton';
import { reqTransactionDetail, reqContract, reqTransferList, reqConfirmationRiskByHash, reqContractListInfo } from '../../utils/api';
import { decodeContract } from '../../utils/transaction';
import {
  errorCodes,
  addressTypeContract,
  contractTypeCodeFc,
  contractTypeCodeGeneral,
  defaultTokenIcon,
  defaultContractIcon,
} from '../../constants';
import InputData from '../../components/InputData';
import SecurityLevel from '../../components/SecurityLevel';

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  ${media.mobile`
    width: 95%;
    margin: 0 auto;
    overflow-x: scroll;
  `}
  .status-reason-err {
    color: #ec6057;
  }
  .status-reason-skip {
    color: #f09c3a;
  }
`;

const StyledTabel = styled.table`
  margin-top: 20px;
  width: 100%;
  background: #fff;
  border-radius: 4px !important;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.12) !important;
  .max10row {
    max-height: 250px;
    overflow: auto;
    word-break: break-all;
    margin-right: 40px;
  }
  tr > td {
    padding-left: 3.2em !important;
    border: none !important;
    font-size: 16px !important;
    background: #fff !important;
  }
  .ui.padded.table td {
    padding: none;
  }

  td.align-top {
    vertical-align: top;
  }
  &.right {
    margin-left: 16px;
  }
  td.collapsing {
    font-weight: bold !important;
    padding: 0.5em 5em 0.5em 2em !important;
    ${media.mobile`
      padding: 0.1em 2em 0.1em 2em !important;
    `}
    background: #edf2f9 !important;
  }

  td.collapsing.init-top {
    font-weight: bold !important;
    /* padding-top: 1em !important; */
    vertical-align: initial !important;
    ${media.mobile`
      padding: 0.1em 2em 0.1em 2em !important;
    `}
    background: #edf2f9 !important;
  }

  td.zero-padding-bottom {
    padding-bottom: 0em !important;
    max-width: 500px;
  }
  td.zero-padding-top {
    padding-top: 0em !important;
  }

  td.top {
    padding-top: 2em !important;
  }
  td.bottom {
    padding-bottom: 2em !important;
  }
  .nameItem {
    white-space: nowrap;
    margin-left: 5px;
  }
  td.to {
    > span {
      display: flex;
      align-items: center;
    }
    .logo {
      width: 16px;
      margin-left: 5px;
      vertical-align: middle;
    }
  }
  tr > td a {
    font-weight: bold;
  }
  .status-line {
    display: flex;
    align-items: center;
    > img {
      width: 16px;
      margin-right: 5px;
    }
    span {
      font-size: 16px;
      line-height: 16px;
    }
  }
  .status-success {
    color: #59bf9c;
  }
  .status-err {
    color: #ec6057;
  }
  .status-skip {
    color: #f09c3a;
  }
  .transferListContainer {
  }
`;

const HeadBar = styled.div`
  margin-top: 16px;
  width: 100%;
  font-size: 16px;
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;

  * {
    display: inline-block;
    margin: 0;
  }
  h1 {
    color: #000;
    font-size: 20px;
    margin-right: 12px;
  }
`;

const TokensDiv = styled.div`
  display: flex;
  align-items: center;
  line-height: 24px;
  height: 24px;
  > em {
    font-style: normal;
    margin-right: 8px;
    margin-left: 8px;
    color: #8f8f8f;
    white-space: nowrap;
    &:first-child {
      margin-left: 0;
    }
  }
  > span {
    margin-right: 8px;
    white-space: nowrap;
  }
  .fc-logo {
    width: 16px;
    vertical-align: middle;
    margin-top: -1px;
    margin-left: 5px;
  }
`;

const FilterSelector = styled.div.attrs({
  className: 'ui menu compact',
})`
  width: 200px;
  height: 36px;
  border: none !important;
  box-shadow: none !important;
  padding-bottom: 10px !important;
  background: transparent !important;

  .ui.dropdown {
    width: 100%;
    justify-content: space-between;
    border: 1px solid #e0e1e2;
    border-radius: 4px !important;

    .menu > .item {
      outline: none;
    }

    .menu > .item.priority {
      &:hover {
        background: rgba(0, 0, 0, 0.12) !important;
        font-weight: bold !important;
        color: #1e3de4 !important;
      }
    }
  }

  .menu.visible {
    display: none !important;
    top: calc(100% + 8px);
  }

  &:hover {
    .menu.visible {
      display: block !important;
    }
  }
`;

const StatusDelimiter = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  background: white;
  border: 1px solid #989898;
  border-top: none;
  border-right: none;
  margin: 0 3px 0 8px;
`;

const baseLangId = 'app.pages.txns.';
class Detail extends Component {
  constructor() {
    super();
    this.getInitState = () => ({
      result: {},
      isLoading: true,
      isPacking: false,
      inputDataType: 'original',
      selectedLangKey: 'app.pages.txns.original',
      isContract: false,
      contractInfo: {},
      filterKeys: ['original', 'utf8'],
      contractType: contractTypeCodeGeneral, //
      decodedData: {},
      transferList: [],
    });
    this.state = this.getInitState();
  }

  componentDidMount() {
    this.fetchTxDetail(this.getTxnHash());
  }

  componentDidUpdate(prevProps) {
    const txnhash = this.getTxnHash();
    const prevTxnHash = tranferToLowerCase(prevProps.match.params.txnhash);
    if (txnhash !== prevTxnHash) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(this.getInitState());
      this.fetchTxDetail(txnhash);
    }
  }

  componentWillUnmount() {
    if (this.fetchDetailTimer) {
      clearTimeout(this.fetchDetailTimer);
    }
  }

  getTxnHash() {
    const {
      match: { params },
    } = this.props;
    const { txnhash } = params;
    return tranferToLowerCase(txnhash);
  }

  async getConfirmRisk(blockHash) {
    let looping = true;
    let riskLevel;
    while (looping) {
      // eslint-disable-next-line no-await-in-loop
      riskLevel = await reqConfirmationRiskByHash(blockHash);
      this.setState({
        riskLevel,
      });
      if (riskLevel === '') {
        // eslint-disable-next-line no-await-in-loop
        await wait(1000);
      } else if (riskLevel === 'lv0') {
        looping = false;
      } else {
        // eslint-disable-next-line no-await-in-loop
        await wait(10 * 1000);
      }
    }
  }

  fetchTxDetail(txnhash, params = { showLoading: true }) {
    const { history } = this.props;
    if (params.showLoading) {
      this.setState({ isLoading: true });
    }
    return reqTransactionDetail(
      {
        hash: txnhash,
      },
      { showError: false }
    ).then((body) => {
      if (txnhash !== this.getTxnHash()) {
        return;
      }

      switch (body.code) {
        case 0:
          if (body.result.blockHash) {
            this.getConfirmRisk(body.result.blockHash);
          } else {
            this.fetchDetailTimer = setTimeout(() => {
              this.fetchTxDetail(this.getTxnHash(), { showLoading: false });
            }, 3000);
          }
          const transactionDetails = body.result;
          this.setState({ result: transactionDetails });
          let toAddress = transactionDetails.to;
          if (getAddressType(toAddress) === addressTypeContract) {
            this.setState({ isContract: true });
            const fields = [
              'address',
              'type',
              'name',
              'website',
              'tokenName',
              'tokenSymbol',
              'tokenIcon',
              'tokenDecimal',
              'abi',
              'bytecode',
              'icon',
              'sourceCode',
              'typeCode',
            ].join(',');
            const proArr = [];
            proArr.push(reqContract({ address: toAddress, fields: fields }, { showError: false }));
            proArr.push(reqTransferList({ transactionHash: txnhash, fields: 'token' }, { showError: false }));
            Promise.all(proArr).then((proRes) => {
              this.setState({
                isLoading: false,
              });
              const contractResponse = proRes[0];
              const transferListReponse = proRes[1];
              switch (contractResponse.code) {
                case 0:
                  const result = contractResponse.result;
                  const contractType = result.typeCode;
                  let decodedData = {};
                  let filterKeys = [];
                  decodedData = decodeContract({
                    abi: JSON.parse(result.abi),
                    bytecode: result.bytecode,
                    address: result.address,
                    transacionData: transactionDetails.data,
                  }); // decode the data of transaction
                  filterKeys = ['original', 'utf8', 'decodeInputData'];
                  this.setState({
                    isLoading: false,
                    contractInfo: result,
                    contractType,
                    filterKeys,
                    decodedData,
                  });
                  break;
                default:
                  break;
              }
              switch (transferListReponse.code) {
                case 0:
                  const result = transferListReponse.result;
                  const list = result.list;
                  this.setState({
                    transferList: list,
                  });
                  const addressList = list.map((v) => v.address);
                  reqContractListInfo(uniq(addressList));
                  break;
                default:
                  break;
              }
            });
          } else {
            this.setState({
              isContract: false,
              isLoading: false,
            });
          }
          break;
        case errorCodes.ParameterError:
          history.push(`/search-notfound?searchId=${txnhash}`);
          break;
        case errorCodes.TxNotFoundError:
          this.setState({
            isPacking: true,
          });
          break;
        default:
          break;
      }
    });
  }

  render() {
    const {
      isLoading,
      isPacking,
      selectedLangKey,
      inputDataType,
      filterKeys,
      contractInfo,
      contractType,
      decodedData,
      isContract,
      transferList,
      riskLevel,
    } = this.state;
    const { contractManagerCache } = this.props;

    if (isPacking) {
      return <NotFoundTx searchId={this.getTxnHash()} />;
    }
    let { result } = this.state;
    result = result || {};

    const copyBtnStyle = {
      verticalAlign: 'middle',
      height: 22,
    };

    return (
      <div className="page-transaction-detail">
        <Wrapper>
          <HeadBar>
            <h1>{i18n('app.pages.txns.transaction')}</h1>
            <p>{this.getTxnHash()}</p>
          </HeadBar>
          {isLoading ? (
            <TableLoading />
          ) : (
            <StyledTabel className="ui basic table">
              <tbody className="">
                <tr className="">
                  <td className="collapsing top">{i18n('Transaction Hash')}</td>
                  <td className="top">
                    {result.hash}
                    <CopyButton style={copyBtnStyle} txtToCopy={result.hash} btnType="three" toolTipId="Copy to clipboard" />
                  </td>
                </tr>

                <tr className="">
                  <td className="collapsing">{i18n('app.pages.txns.time')}</td>
                  <td className="">
                    <Countdown baseTime={Date.now()} timestamp={result.syncTimestamp * 1000} />
                    &nbsp; ({moment(result.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss Z')})
                  </td>
                </tr>

                <tr className="">
                  <td className="collapsing">{i18n('app.pages.txns.Status')}</td>
                  <td className="">
                    {renderAny(() => {
                      if (result.status === 0) {
                        return (
                          <div className="status-line status-success">
                            <img src={iconStatusSuccess} />
                            <span>{i18n('app.pages.txns.Success')}</span>
                          </div>
                        );
                      }
                      if (result.status === 1) {
                        return (
                          <div className="status-line status-err">
                            <img src={iconStatusErr} />
                            <span>{i18n('app.pages.txns.Err')}</span>
                            <StatusDelimiter />
                            <span className="status-reason-err">{i18n('app.pages.err-reason.1')}</span>
                          </div>
                        );
                      }
                      if (result.status === 2) {
                        return (
                          <div className="status-line status-skip">
                            <img src={iconStatusSkip} />
                            <span>{i18n('app.pages.txns.Skip')}</span>
                            <StatusDelimiter />
                            <span className="status-reason-skip">{i18n('app.pages.err-reason.2')}</span>
                          </div>
                        );
                      }
                      if (result.status === null) {
                        return (
                          <div className="status-line status-Unexecuted">
                            <img src={iconUnexecuted} />
                            <span>{i18n('app.pages.txns.Unexecuted')}</span>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </td>
                </tr>

                <tr className="">
                  <td className="collapsing">{i18n('Security')}</td>
                  <td className="">
                    <SecurityLevel riskLevel={riskLevel} />
                  </td>
                </tr>

                <tr className="">
                  <td className="collapsing">{i18n('From')}</td>
                  <td className="">
                    <Link to={`/address/${result.from}`}>{result.from}</Link>
                    <CopyButton style={copyBtnStyle} txtToCopy={result.from} btnType="three" toolTipId="Copy to clipboard" />
                  </td>
                </tr>
                <tr className="">
                  <td className="collapsing">{i18n('To')}</td>
                  <td className="to">
                    {renderAny(() => {
                      let toDiv;
                      if (result.to) {
                        if (isContract) {
                          let imgIcon = null;
                          if (contractInfo.icon) {
                            imgIcon = <img className="logo" src={`${contractInfo.icon}`} />;
                          } else {
                            imgIcon = <img className="logo" src={defaultContractIcon} />;
                          }
                          toDiv = (
                            <span>
                              {i18n('Contract')} &nbsp;
                              <Link to={`/address/${result.to}`}>{result.to}</Link>
                              {contractInfo.name && (
                                <Fragment>
                                  {imgIcon}
                                  <Link to={`/address/${result.to}`} className="nameItem">
                                    {contractInfo.name}
                                  </Link>
                                </Fragment>
                              )}
                              <CopyButton style={copyBtnStyle} txtToCopy={result.to} btnType="three" toolTipId="Copy to clipboard" />
                            </span>
                          );
                        } else {
                          toDiv = (
                            <span>
                              <Link to={`/address/${result.to}`}>{result.to}</Link>
                              <CopyButton style={copyBtnStyle} txtToCopy={result.to} btnType="three" toolTipId="Copy to clipboard" />
                            </span>
                          );
                        }
                      } else if (result.contractCreated) {
                        toDiv = (
                          <span>
                            {i18n('Contract')} &nbsp;
                            <Link to={`/accountdetail/${result.contractCreated}`}>{result.contractCreated}</Link>
                            &nbsp; {i18n('Created')}
                          </span>
                        );
                      } else {
                        toDiv = <span>{i18n('Contract Creation')}</span>;
                      }
                      return <div>{toDiv}</div>;
                    })}
                  </td>
                </tr>
                {renderAny(() => {
                  if (!isContract) {
                    return null;
                  }
                  if (transferList.length <= 0) {
                    return null;
                  }
                  let transferListContainer = [];
                  let transferListContainerStyle = {};
                  for (let i = 0; i < transferList.length; i++) {
                    const transferItem = transferList[i];
                    let imgSrc = '';
                    let tokenName = '';
                    let tokenSymbol = '';
                    let tokenDecimals = 0;
                    if (transferItem.token) {
                      tokenName = transferItem.token.name;
                      tokenSymbol = transferItem.token.symbol;
                      tokenDecimals = transferItem.token.decimals;
                    }
                    const curContractInfo = contractManagerCache[transferItem.address];
                    if (curContractInfo && curContractInfo.tokenIcon) {
                      imgSrc = curContractInfo.tokenIcon;
                    }
                    const imgIcon = <img className="fc-logo" src={`${imgSrc || defaultTokenIcon}`} />;
                    const nameContainer = (
                      <Link to={`/token/${transferItem.address}`} className="nameItem">
                        {`${tokenName} (${tokenSymbol})`}
                      </Link>
                    );

                    transferListContainer.push(
                      <TokensDiv>
                        <em>{i18n('From')}</em>
                        <EllipsisLine
                          ellipsisStyle={{ maxWidth: 152 }}
                          linkTo={`/address/${transferItem.from}`}
                          text={transferItem.from}
                          popUpCfg={{ position: 'top left' }}
                        />
                        <em>{i18n('To')}</em>
                        <EllipsisLine ellipsisStyle={{ maxWidth: 152 }} linkTo={`/address/${transferItem.to}`} text={transferItem.to} />
                        <em>For</em>
                        <span>
                          {typeof tokenDecimals !== 'undefined' ? devidedByDecimals(transferItem.value, tokenDecimals) : transferItem.value}
                        </span>
                        {imgIcon}
                        {nameContainer}
                      </TokensDiv>
                    );
                  }
                  if (transferList.length > 5) {
                    transferListContainerStyle = { height: '120px', overflow: 'auto' };
                  }
                  const sty = { paddingTop: '0.5em' };
                  const countStr = transferList.length > 1 ? `(${transferList.length})` : '';
                  return (
                    <tr className="">
                      <td className="collapsing init-top">
                        {i18n('app.pages.txns.tokenTransferred')} {`${countStr}`}
                      </td>
                      <td style={sty}>
                        <div style={transferListContainerStyle}>{transferListContainer}</div>
                      </td>
                    </tr>
                  );
                })}
                <tr className="">
                  <td className="collapsing">{i18n('Value')}</td>
                  <td className="">{dripTocfx(result.value)} CFX</td>
                </tr>
                <tr className="">
                  <td className="collapsing">{i18n('Gas')}</td>
                  <td className="">{result.gas}</td>
                </tr>
                <tr className="">
                  <td className="collapsing">{i18n('Gas Price')}</td>
                  <td className="">{dripToGdrip(result.gasPrice)} Gdrip</td>
                </tr>
                <tr className="">
                  <td className="collapsing">{i18n('Nonce')}</td>
                  <td className="">{result.nonce}</td>
                </tr>
                <tr className="">
                  <td className="collapsing">{i18n('Block Hash')}</td>
                  <td className="">
                    <Link to={`/blocksdetail/${result.blockHash}`}>{result.blockHash}</Link>
                  </td>
                </tr>
                <tr className="">
                  <td className="collapsing">{i18n('Position')}</td>
                  <td className="">{result.transactionIndex}</td>
                </tr>
                <tr className="">
                  <td className="collapsing">{i18n('app.pages.txns.proposedEpoch')}</td>
                  <td className="">{result.epochHeight}</td>
                </tr>
                <tr className="">
                  <td className="collapsing">{i18n('app.pages.txns.storageLimit')}</td>
                  <td className="">{result.storageLimit}</td>
                </tr>
                <tr className="">
                  <td className="collapsing">{i18n('app.pages.txns.chainId')}</td>
                  <td className="">{result.chainId}</td>
                </tr>
                {renderAny(() => {
                  return (
                    <tr className="">
                      <td className="collapsing init-top">{i18n('app.pages.txns.inputData')}</td>
                      <td className="zero-padding-bottom">
                        <InputData byteCode={result.data} inputType={inputDataType} decodedDataStr={JSON.stringify(decodedData)} />
                      </td>
                    </tr>
                  );
                })}
                <tr className="">
                  <td className="collapsing" />
                  <td className="zero-padding-top">
                    <FilterSelector>
                      <div className="ui dropdown link item">
                        <FormattedMessage id={selectedLangKey}>{(s) => <span className="text">{s}</span>}</FormattedMessage>
                        <i className="dropdown icon" />
                        <div className="menu transition visible">
                          {filterKeys.map((name, index) => (
                            <div
                              key={name}
                              className="item priority"
                              role="button"
                              tabIndex={index}
                              onClick={() => this.setState({ inputDataType: name, selectedLangKey: baseLangId + name })}
                              onKeyPress={() => this.setState({ inputDataType: name, selectedLangKey: baseLangId + name })}
                            >
                              <FormattedMessage id={baseLangId + name} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </FilterSelector>
                  </td>
                </tr>
              </tbody>
            </StyledTabel>
          )}
        </Wrapper>
      </div>
    );
  }
}
Detail.propTypes = {
  match: PropTypes.objectOf(PropTypes.string),
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  contractManagerCache: PropTypes.objectOf(
    PropTypes.shape({
      address: PropTypes.string,
    })
  ).isRequired,
};
Detail.defaultProps = {
  match: {},
};

function mapStateToProps(state) {
  return {
    contractManagerCache: state.common.contractManagerCache,
  };
}

const hoc = compose(
  injectIntl,
  withRouter,
  connect(mapStateToProps)
);
export default hoc(Detail);
