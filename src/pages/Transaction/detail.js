/* eslint-disable no-case-declarations */
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import compose from 'lodash/fp/compose';

import moment from 'moment';
import TableLoading from '../../components/TableLoading';
import EllipsisLine from '../../components/EllipsisLine';
import media from '../../globalStyles/media';
import { i18n, renderAny, dripTocfx, dripToGdrip, getAddressType, devidedByDecimals } from '../../utils';
import NotFoundTx from '../NotFoundTx';
import Countdown from '../../components/Countdown';
import iconStatusErr from '../../assets/images/icons/status-err.svg';
import iconStatusSuccess from '../../assets/images/icons/status-success.svg';
import iconStatusSkip from '../../assets/images/icons/status-skip.svg';
import CopyButton from '../../components/CopyButton';
import { reqTransactionDetail, reqContractQuery } from '../../utils/api';
import { decodeContract } from '../../utils/transaction';
import { errorCodes, addressTypeContract } from '../../constants';
import InputData from '../../components/InputData';

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
    padding-top: 1em !important;
    vertical-align: initial !important;
    ${media.mobile`
      padding: 0.1em 2em 0.1em 2em !important;
    `}
    background: #edf2f9 !important;
  }

  td.zero-padding-bottom {
    padding-bottom: 0em !important;
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
  td.to {
    > span {
      display: flex;
      align-items: center;
    }
    .logo {
      width: 16px;
      margin-right: 5px;
      margin-left: 10px;
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
`;

const HeadBar = styled.div`
  margin-top: 16px;
  width: 100%;
  font-size: 16px;
  margin-bottom: 10px;
  display: flex;
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
    margin-right: 5px;
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
    justify-content: space-around;
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
    this.state = {
      txnhash: '',
      result: {},
      isLoading: true,
      isPacking: false,
      inputDataType: 'original',
      selectedLangKey: 'app.pages.txns.original',
      isContract: false,
      contractInfo: {},
      filterKeys: ['original', 'utf8'],
      contractType: 0, // 0:general conract, 1:erc20, 2:erc777, 3: fanscoin
      decodedData: {},
    };
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;
    this.fetchTxDetail(params.txnhash);
  }

  componentDidUpdate() {
    const {
      match: { params },
    } = this.props;
    const { txnhash } = this.state;
    if (params.txnhash !== txnhash) {
      this.fetchTxDetail(params.txnhash);
    }
  }

  fetchTxDetail(txnhash) {
    const { history } = this.props;
    this.setState({ isLoading: true, txnhash });
    return reqTransactionDetail(
      {
        hash: txnhash,
      },
      { showError: false }
    ).then((body) => {
      switch (body.code) {
        case errorCodes.ParameterError:
          history.push(`/search-notfound?searchId=${txnhash}`);
          break;
        case errorCodes.TxNotFoundError:
          this.setState({
            isPacking: true,
          });
          break;
        case 0:
        default:
          const transactionDetails = body.result;
          let toAddress = transactionDetails.to;
          if (getAddressType(toAddress) === addressTypeContract) {
            this.setState({ isContract: true });
            reqContractQuery({ address: toAddress, fields: ['abi', 'bytecode', 'icon'] }).then((contractResponse) => {
              const responseBody = contractResponse.body;
              switch (responseBody.code) {
                case 0:
                  const result = responseBody.result;
                  const contractType = result.typeCode;
                  let decodedData = {};
                  let filterKeys = [];
                  if (contractType !== 0) {
                    decodedData = decodeContract({
                      abi: result.abi,
                      bytecode: result.bytecode,
                      address: result.address,
                      transacionData: transactionDetails.data,
                    }); // decode the data of transaction
                    filterKeys = ['original', 'utf8', 'decodeInputData'];
                  }
                  this.setState({
                    result: transactionDetails,
                    isLoading: false,
                    contractInfo: result,
                    contractType,
                    filterKeys,
                    decodedData,
                  });
                  break;
                default:
                  this.setState({
                    isLoading: false,
                  });
                  break;
              }
            });
          } else {
            this.setState({
              isContract: false,
              result: transactionDetails,
              isLoading: false,
            });
          }
          break;
      }
    });
  }

  render() {
    const {
      isLoading,
      txnhash,
      isPacking,
      selectedLangKey,
      inputDataType,
      filterKeys,
      contractInfo,
      contractType,
      decodedData,
      isContract,
    } = this.state;
    const {
      match: { params },
    } = this.props;

    if (isPacking) {
      return <NotFoundTx searchId={txnhash} />;
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
            <h1>{i18n('Transaction')}</h1>
            <p>{params.txnhash}</p>
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
                    <Countdown timestamp={result.timestamp * 1000} />
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
                      if (result.status === 2 || result.status === null) {
                        return (
                          <div className="status-line status-skip">
                            <img src={iconStatusSkip} />
                            <span>{i18n('app.pages.txns.Skip')}</span>
                            <StatusDelimiter />
                            <span className="status-reason-skip">{i18n('app.pages.err-reason.2')}</span>
                          </div>
                        );
                      }
                      return null;
                    })}
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
                      if (isContract) {
                        toDiv = (
                          <span>
                            {i18n('Contract')} &nbsp;
                            <Link to={`/address/${result.to}`}>{result.to}</Link>
                            <img className="logo" src={`data:image/png;base64,${contractInfo.icon}`} />
                            <Link to={`/address/${result.to}`}>{contractInfo.name}</Link>
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
                      return <div>{toDiv}</div>;
                    })}
                  </td>
                </tr>
                {renderAny(() => {
                  if (contractType === 0) {
                    return null;
                  }
                  let contrctToAddress = decodedData.params[0];
                  let value = decodedData.params[1];
                  if (contractType === 3 && decodedData.name === 'mint') {
                    return (
                      <tr className="">
                        <td className="collapsing">{i18n('Token Minted')}</td>
                        <td className="">
                          <TokensDiv>
                            <em>{i18n('To')}</em>
                            <EllipsisLine
                              ellipsisStyle={{ maxWidth: 152 }}
                              linkTo={`/address/${contrctToAddress}`}
                              text={contrctToAddress}
                            />
                            <em>{i18n('For')}</em>
                            <span>{devidedByDecimals(value, contractInfo.decimals)}</span>
                            <img className="fc-logo" src={`data:image/png;base64,${contractInfo.icon}`} />

                            <span>{`${contractInfo.name} (${contractInfo.symbol})`}</span>
                          </TokensDiv>
                        </td>
                      </tr>
                    );
                  }
                  return (
                    <tr className="">
                      <td className="collapsing">{i18n('Token Transferred')}</td>
                      <td className="">
                        <TokensDiv>
                          <em>{i18n('From')}</em>
                          <EllipsisLine ellipsisStyle={{ maxWidth: 152 }} linkTo={`/address/${result.from}`} text={result.from} />
                          <em>{i18n('To')}</em>
                          <EllipsisLine ellipsisStyle={{ maxWidth: 152 }} linkTo={`/address/${contrctToAddress}`} text={contrctToAddress} />
                          <em>For</em>
                          <span>{devidedByDecimals(value, contractInfo.decimals)}</span>

                          <img className="fc-logo" src={`data:image/png;base64,${contractInfo.icon}`} />
                          <span>{`${contractInfo.name} (${contractInfo.symbol})`}</span>
                        </TokensDiv>
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
};
Detail.defaultProps = {
  match: {},
};

const hoc = compose(
  injectIntl,
  withRouter
);
export default hoc(Detail);
