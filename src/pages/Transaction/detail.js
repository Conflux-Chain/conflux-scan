import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import superagent from 'superagent';
import moment from 'moment';
import { Pagination } from 'semantic-ui-react';
import TableLoading from '../../components/TableLoading';
import DataList from '../../components/DataList';
import EllipsisLine from '../../components/EllipsisLine';
import '../../assets/semantic-ui/semantic.css';

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
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

  &.right {
    margin-left: 16px;
  }
  td.collapsing {
    font-weight: bold !important;
    padding: 0.5em 5em 0.5em 2em !important;
    background: #edf2f9 !important;
  }
  td.top {
    padding-top: 2em !important;
  }
  td.bottom {
    padding-bottom: 2em !important;
  }
`;

const HeadBar = styled.div`
  margin-top: 24px;
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

class Detail extends Component {
  constructor() {
    super();
    this.state = {
      result: {},
      isLoading: true,
    };
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;
    this.fetchTxDetail(params.txnhash);
  }

  async fetchTxDetail(txnhash) {
    this.setState({ isLoading: true });
    const { code, result } = (await superagent.get(`/proxy/fetchTxDetail?transactionHash=${txnhash}`)).body;
    if (!code) {
      this.setState({ result }, () => this.setState({ isLoading: false }));
    }
    return {};
  }

  render() {
    const { result, isLoading } = this.state;
    const {
      match: { params },
    } = this.props;

    return (
      <div className="page-transaction-detail">
        <Wrapper>
          <HeadBar>
            <h1>Transaction</h1>
            <p>{params.txnhash}</p>
          </HeadBar>
          {isLoading ? (
            <TableLoading />
          ) : (
            <StyledTabel className="ui basic padded table">
              <tbody className="">
                <tr className="">
                  <td className="collapsing top">Transation Hash</td>
                  <td className="top">{result.hash}</td>
                </tr>
                <tr className="">
                  <td className="collapsing">Data</td>
                  <td className="">{result.data}</td>
                </tr>
                <tr className="">
                  <td className="collapsing">From</td>
                  <td className="">{result.from}</td>
                </tr>
                <tr className="">
                  <td className="collapsing">To</td>
                  <td className="">{result.to}</td>
                </tr>
                <tr className="">
                  <td className="collapsing">Gas</td>
                  <td className="">{result.gas}</td>
                </tr>
                <tr className="">
                  <td className="collapsing">Gas Price</td>
                  <td className="">{result.gasPrice}</td>
                </tr>
                <tr className="">
                  <td className="collapsing">Value</td>
                  <td className="">{result.value}</td>
                </tr>
                <tr className="">
                  <td className="collapsing">Nonce</td>
                  <td className="">{result.nonce}</td>
                </tr>
                <tr className="">
                  <td className="collapsing">Block Hash</td>
                  <td className="">{result.blockHash}</td>
                </tr>
                <tr className="">
                  <td className="collapsing">Position</td>
                  <td className="">{result.transactionIndex}</td>
                </tr>
                <tr className="">
                  <td className="collapsing bottom">Time</td>
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
};
Detail.defaultProps = {
  match: {},
};
export default Detail;
