import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import moment from 'moment';
import TableLoading from '../../components/TableLoading';
import EllipsisLine from '../../components/EllipsisLine';
import media from '../../globalStyles/media';
import { i18n, renderAny, sendRequest, dripTocfx, dripToGdrip } from '../../utils';
import NotFoundTx from '../NotFoundTx';
import iconFcLogo from '../../assets/images/icons/fc-logo.svg';
import Countdown from '../../components/Countdown';
import iconStatusErr from '../../assets/images/icons/status-err.svg';
import iconStatusSuccess from '../../assets/images/icons/status-success.svg';
import iconStatusSkip from '../../assets/images/icons/status-skip.svg';
import iconWesign from '../../assets/images/icons/wesign-logo.svg';
import CopyButton from '../../components/CopyButton';

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

class Detail extends Component {
  constructor() {
    super();
    this.state = {
      txnhash: '',
      result: {},
      isLoading: true,
      isPacking: false,
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
    return sendRequest({
      url: `/api/transaction/${txnhash}`,
      query: {},
      showError: false,
    }).then((res) => {
      switch (res.body.code) {
        case 1:
          history.push(`/search-notfound?searchId=${txnhash}`);
          break;
        case 4:
          this.setState({
            isPacking: true,
          });
          break;
        case 0:
        default:
          this.setState({
            result: res.body.result.data,
            isLoading: false,
          });
          break;
      }
    });
  }

  render() {
    const { isLoading, txnhash, isPacking } = this.state;
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
                  <td className="top">{result.hash}</td>
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
                          </div>
                        );
                      }
                      if (result.status === 2 || result.status === null) {
                        return (
                          <div className="status-line status-skip">
                            <img src={iconStatusSkip} />
                            <span>{i18n('app.pages.txns.Skip')}</span>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </td>
                </tr>

                {renderAny(() => {
                  if (result.decodedData) {
                    const { decodedData = {} } = result;
                    if (decodedData.name === 'mint') {
                      let account = {};
                      let value = {};
                      decodedData.params.forEach((v) => {
                        if (v.name === 'account') {
                          account = v;
                        } else if (v.name === 'value') {
                          value = v;
                        }
                      });
                      return (
                        <tr className="">
                          <td className="collapsing">{i18n('Token Minted')}</td>
                          <td className="">
                            <TokensDiv>
                              <em>{i18n('To')}</em>
                              <EllipsisLine
                                ellipsisStyle={{ maxWidth: 152 }}
                                linkTo={`/accountdetail/${account.value}`}
                                text={account.value}
                              />
                              <em>{i18n('For')}</em>
                              <span>{dripTocfx(value.value)}</span>
                              <img className="fc-logo" src={iconFcLogo} />

                              <span>Fans Coin (FC)</span>
                            </TokensDiv>
                          </td>
                        </tr>
                      );
                    }

                    let toAccount = {};
                    let value = {};
                    decodedData.params.forEach((v) => {
                      if (v.name === 'recipient') {
                        toAccount = v;
                      } else if (v.name === 'value') {
                        value = v;
                      }
                    });

                    return (
                      <tr className="">
                        <td className="collapsing">{i18n('Token Transfered')}</td>
                        <td className="">
                          <TokensDiv>
                            <em>{i18n('From')}</em>
                            <EllipsisLine ellipsisStyle={{ maxWidth: 152 }} linkTo={`/accountdetail/${result.from}`} text={result.from} />
                            <em>{i18n('To')}</em>
                            <EllipsisLine
                              ellipsisStyle={{ maxWidth: 152 }}
                              linkTo={`/accountdetail/${toAccount.value}`}
                              text={toAccount.value}
                            />
                            <em>For</em>
                            <span>{dripTocfx(value.value)}</span>

                            <img className="fc-logo" src={iconFcLogo} />
                            <span>Fans Coin (FC)</span>
                          </TokensDiv>
                        </td>
                      </tr>
                    );
                  }
                  return (
                    <tr className="">
                      <td className="collapsing align-top">{i18n('Data')}</td>
                      <td>
                        <div className="max10row">{result.data}</div>
                      </td>
                    </tr>
                  );
                })}

                <tr className="">
                  <td className="collapsing">{i18n('From')}</td>
                  <td className="">
                    <Link to={`/accountdetail/${result.from}`}>{result.from}</Link>
                    <CopyButton style={copyBtnStyle} txtToCopy={result.from} btnType="three" toolTipId="Copy to clipboard" />
                  </td>
                </tr>
                <tr className="">
                  <td className="collapsing">{i18n('To')}</td>
                  <td className="to">
                    {renderAny(() => {
                      let toDiv;
                      if (result.to) {
                        if (result.to === '0xf8966b6117bab55c8cb164483a1bf3d40e733799') {
                          toDiv = (
                            <span>
                              {i18n('Contract')} &nbsp;
                              <Link to={`/accountdetail/${result.to}`}>{result.to}</Link>
                              <img src={iconWesign} className="logo" />
                              {i18n('WeSign')}
                              <CopyButton style={copyBtnStyle} txtToCopy={result.to} btnType="three" toolTipId="Copy to clipboard" />
                            </span>
                          );
                        } else {
                          toDiv = (
                            <span>
                              <Link to={`/accountdetail/${result.to}`}>{result.to}</Link>
                              <CopyButton style={copyBtnStyle} txtToCopy={result.to} btnType="three" toolTipId="Copy to clipboard" />
                            </span>
                          );
                        }
                      } else if (result.contractCreated) {
                        toDiv = (
                          <span>
                            [{i18n('Contract')} &nbsp;
                            <Link to={`/accountdetail/${result.contractCreated}`}>{result.contractCreated}</Link>
                            &nbsp; {i18n('Created')}]
                          </span>
                        );
                      }
                      if (result.status === 0) {
                        return toDiv;
                      }
                      let statusReason;
                      if (result.status === 1) {
                        statusReason = <div className="status-reason-err">{i18n('app.pages.err-reason.1')}</div>;
                      } else if (result.status === 2 || result.status === null) {
                        statusReason = <div className="status-reason-skip">{i18n('app.pages.err-reason.2')}</div>;
                      }
                      return (
                        <div>
                          {toDiv}
                          {statusReason}
                        </div>
                      );
                    })}
                  </td>
                </tr>
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
                  <td className="collapsing bottom">{i18n('Position')}</td>
                  <td className="bottom">{result.transactionIndex}</td>
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
export default withRouter(Detail);
