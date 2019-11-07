import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import superagent from 'superagent';
import moment from 'moment';
import TableLoading from '../../components/TableLoading';
import EllipsisLine from '../../components/EllipsisLine';
import media from '../../globalStyles/media';
import { i18n, renderAny, sendRequest } from '../../utils';
import NotFoundTx from '../NotFoundTx';

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  ${media.mobile`
    width: 95%;
    margin: 0 auto;
    overflow-x: scroll;
  `}
`;

const StyledTabel = styled.table`
  margin-top: 20px;
  width: 100%;
  background: #fff;
  border-radius: 4px !important;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.12) !important;

  tr > td {
    padding-left: 3.2em !important;
    border: none !important;
    font-size: 16px !important;
    background: #fff !important;
  }
  .ui.padded.table td {
    padding: none;
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
  tr > td > a {
    font-weight: bold;
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
    &:first-child {
      margin-left: 0;
    }
  }
  > span {
    margin-right: 8px;
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
    const { result, isLoading, txnhash, isPacking } = this.state;
    const {
      match: { params },
    } = this.props;

    if (isPacking) {
      return <NotFoundTx searchId={txnhash} />;
    }

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

                {renderAny(() => {
                  if (result.decodedData) {
                    const { decodedData = {} } = result;
                    const fromAddress = '0x959a58254cce5fc2a8765de83ba0001edd7e98e6c9c136babb80eb5cd270097d';
                    if (decodedData.name === 'mint') {
                      return (
                        <tr className="">
                          <td className="collapsing">{i18n('Tokens Transferred')}</td>
                          <td className="">
                            <TokensDiv>
                              <em>To</em>
                              <EllipsisLine
                                ellipsisStyle={{ maxWidth: 152 }}
                                linkTo={`/transactionsdetail/${fromAddress}`}
                                text={fromAddress}
                              />
                              <em>For</em>
                              <span>210.23</span>

                              <span>Fans Coin (FC)</span>
                            </TokensDiv>
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr className="">
                        <td className="collapsing">{i18n('Tokens Transferred')}</td>
                        <td className="">
                          <TokensDiv>
                            <em>From</em>
                            <EllipsisLine
                              ellipsisStyle={{ maxWidth: 152 }}
                              linkTo={`/transactionsdetail/${fromAddress}`}
                              text={fromAddress}
                            />
                            <em>To</em>
                            <EllipsisLine
                              ellipsisStyle={{ maxWidth: 152 }}
                              linkTo={`/transactionsdetail/${fromAddress}`}
                              text={fromAddress}
                            />
                            <em>For</em>
                            <span>210.23</span>

                            <span>Fans Coin (FC)</span>
                          </TokensDiv>
                        </td>
                      </tr>
                    );
                  }
                  return (
                    <tr className="">
                      <td className="collapsing">{i18n('Data')}</td>
                      <td className="" style={{ wordBreak: 'break-word' }}>
                        {result.data}
                      </td>
                    </tr>
                  );
                })}

                <tr className="">
                  <td className="collapsing">{i18n('From')}</td>
                  <td className="">
                    <Link to={`/accountdetail/${result.from}`}>{result.from}</Link>
                  </td>
                </tr>
                <tr className="">
                  <td className="collapsing">{i18n('To')}</td>
                  <td className="">
                    {renderAny(() => {
                      if (result.to) {
                        return <Link to={`/accountdetail/${result.to}`}>{result.to}</Link>;
                      }
                      if (result.contractCreated) {
                        return (
                          <span>
                            [{i18n('Contract')} &nbsp;
                            <Link to={`/accountdetail/${result.contractCreated}`}>{result.contractCreated}</Link>
                            &nbsp; {i18n('Created')}]
                          </span>
                        );
                      }
                      return null;
                    })}
                  </td>
                </tr>
                <tr className="">
                  <td className="collapsing">{i18n('Gas')}</td>
                  <td className="">{result.gas}</td>
                </tr>
                <tr className="">
                  <td className="collapsing">{i18n('Gas Price')}</td>
                  <td className="">{result.gasPrice}</td>
                </tr>
                <tr className="">
                  <td className="collapsing">{i18n('Value')}</td>
                  <td className="">{result.value}</td>
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
                  <td className="collapsing bottom">{i18n('app.pages.txns.time')}</td>
                  <td className="bottom">{moment(result.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')}</td>
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
