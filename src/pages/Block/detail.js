import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import superagent from 'superagent';
import moment from 'moment';
import BigNumber from 'bignumber.js';
import { Pagination } from 'semantic-ui-react';
import Countdown from '../../components/Countdown';
import TableLoading from '../../components/TableLoading';
import DataList from '../../components/DataList';
import EllipsisLine from '../../components/EllipsisLine';
import { convertToValueorFee, converToGasPrice } from '../../utils';
import '../../assets/semantic-ui/semantic.css';

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledTabelWrapper = styled.div`
  .content {
    padding: 0 !important;
  }
  thead tr th {
    background: rgba(0, 0, 0, 0.05) !important;
  }
  tr th {
    padding: 16px 20px !important;
    padding-right: 0 !important;
    &:last-of-type {
      padding: 16px 16px !important;
      padding-right: 0 !important;
    }
    &.right-pad {
      padding-right: 16px !important;
    }
  }
  &.right {
    margin-left: 16px;
  }
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
  width: 100%;
  font-size: 16px;
  margin-top: 24px;
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

const IconFace = styled.div`
  margin-left: 16px;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 16px;
    height: 16px;
  }
  &:hover {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.54);
    svg {
      color: #fff;
    }
  }
`;

const TabZone = styled.div`
  position: relative;
  width: 100%;
  button {
    outline: none;
    border: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }
`;

const PCell = styled.div`
  margin: 0 !important;
`;

const TabWrapper = styled.div`
  margin-top: 1em;
  display: flex;
  justify-content: flex-end;
`;

const dataSource = [
  { key: 1, ein: '80580', zwei: '0xe969a6fc05897123123', drei: 'Alichs' },
  { key: 2, ein: '80581', zwei: '0xe969a6fc05897124124', drei: 'Schwarz' },
];

const TxColumns = [
  {
    key: 1,
    className: 'two wide aligned',
    dataIndex: 'hash',
    title: 'Hash',
    render: (text) => <EllipsisLine text={text} />,
  },
  {
    key: 2,
    className: 'two wide aligned',
    dataIndex: 'from',
    title: 'From',
    render: (text) => <EllipsisLine text={text} />,
  },
  {
    key: 3,
    className: 'two wide aligned',
    dataIndex: 'to',
    title: 'To',
    render: (text) => <EllipsisLine text={text} />,
  },
  {
    key: 4,
    className: 'two wide aligned',
    dataIndex: 'value',
    title: 'Value',
    render: (text) => <EllipsisLine unit="CFX" text={convertToValueorFee(text)} />,
  },
  {
    key: 5,
    className: 'two wide aligned',
    dataIndex: 'gasPrice',
    title: 'Fee',
    render: (text, row) => {
      const result = new BigNumber(text).multipliedBy(row.value);
      console.log(convertToValueorFee(result.toFixed()));
      return <EllipsisLine unit="CFX" text={convertToValueorFee(result.toFixed())} />;
    },
  },
  {
    key: 6,
    className: 'two wide aligned',
    dataIndex: 'gasPrice',
    title: 'Gas Price',
    render: (text) => <EllipsisLine unit="Gdip" text={converToGasPrice(text)} />,
  },
  {
    key: 7,
    className: 'three wide aligned plain_th',
    dataIndex: 'timestamp',
    title: 'Age',
    render: (text) => <Countdown timestamp={text * 1000} />,
  },
];

const RefColumns = [
  {
    key: 1,
    dataIndex: 'epochNumber',
    className: 'one wide aligned',
    title: 'Epoch',
    render: (text) => <EllipsisLine linkTo={`/epochsdetail/${text}`} text={text} />,
  },
  {
    key: 2,
    dataIndex: 'drei',
    className: 'one wide aligned',
    title: 'Position',
    render: (text, row) => (
      <div>
        <PCell>{row.drei}</PCell>
      </div>
    ),
  },
  {
    key: 3,
    dataIndex: 'hash',
    className: 'one wide aligned',
    title: 'Hash',
    render: (text, row) => (
      <div>
        <EllipsisLine isLong linkTo={`/blocksdetail/${text}`} isPivot={row.isPivot} text={text} />
      </div>
    ),
  },
  {
    key: 4,
    dataIndex: 'difficulty',
    className: 'one wide aligned plain_th',
    title: 'Difficulty',
    render: (text) => <PCell>{text}</PCell>,
  },
  {
    key: 5,
    className: 'one wide aligned',
    dataIndex: 'miner',
    title: 'Miner',
    render: (text) => <EllipsisLine linkTo={`/accountdetail/${text}`} text={text} />,
  },
  {
    key: 6,
    className: 'one wide aligned plain_th',
    dataIndex: 'gasLimit',
    title: 'Gas Limit',
    render: (text) => <PCell>{text}</PCell>,
  },
  {
    key: 7,
    className: 'three wide aligned plain_th',
    dataIndex: 'timestamp',
    title: 'Age',
    render: (text) => <Countdown timestamp={text * 1000} />,
  },
  {
    key: 8,
    className: 'two wide left aligned plain_th',
    dataIndex: 'transactionCount',
    title: 'Tx Count',
    render: (text) => <PCell>{text}</PCell>,
  },
];

class Detail extends Component {
  constructor() {
    super();
    this.state = {
      currentTab: 1,
      TxTotalCount: 100,
      refereeBlockList: [],
      blockDetail: {},
      TxList: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;
    this.fetchTxDetail(params.blockhash, { activePage: 1 });
  }

  async fetchTxDetail(blockHash, { activePage }) {
    this.setState({ isLoading: true });
    const { code, result } = (await superagent.get(`/proxy/fetchBlockDetail/${blockHash}?pageNum=${activePage}&pageSize=10`)).body;
    if (!code) {
      this.setState(
        {
          blockDetail: result.find((item) => Object.keys(item)[0] === `block/${blockHash}`)[`block/${blockHash}`],
          TxList: result.find((item) => Object.keys(item)[0] === `block/${blockHash}/transactionList`)[
            `block/${blockHash}/transactionList`
          ],
          TxTotalCount: result.find((item) => Object.keys(item)[0] === `block/${blockHash}/transactionList`)[
            `total_block/${blockHash}/transactionList`
          ],
        },
        () => this.setState({ isLoading: false })
      );
    }
    return {};
  }

  async fetchReffereBlock(blockHash) {
    this.setState({ isLoading: true });
    const { code, result } = (await superagent.get(`/proxy/fetchRefereeBlockList/${blockHash}?pageNum=1&pageSize=10`)).body;
    if (!code) {
      this.setState(
        {
          refereeBlockList: result.find((item) => Object.keys(item)[0] === `block/${blockHash}/refereeBlockList`)[
            `block/${blockHash}/refereeBlockList`
          ],
        },
        () => this.setState({ isLoading: false })
      );
    }
    return {};
  }

  render() {
    const { blockDetail, TxList, TxTotalCount, isLoading, currentTab, refereeBlockList } = this.state;
    const {
      match: { params },
    } = this.props;

    console.log(refereeBlockList, '===refereeBlockList');
    return (
      <div className="page-block-detail">
        <Wrapper>
          <HeadBar>
            <h1>Block</h1>
            <p>{params.blockhash}</p>
          </HeadBar>
          {isLoading ? (
            <TableLoading />
          ) : (
            <StyledTabel className="ui basic table">
              <tbody className="">
                <tr className="">
                  <td className="collapsing top">Block Height</td>
                  <td className="top">{blockDetail.height}</td>
                </tr>
                <tr className="">
                  <td className="collapsing">Epoch Number</td>
                  <td className="">{blockDetail.epochNumber}</td>
                </tr>
                <tr className="">
                  <td className="collapsing">Difficulty</td>
                  <td className="">{blockDetail.difficulty}</td>
                </tr>
                <tr className="">
                  <td className="collapsing">Miner</td>
                  <td className="">{blockDetail.miner}</td>
                </tr>
                <tr className="">
                  <td className="collapsing">Block Hash</td>
                  <td className="">{blockDetail.hash}</td>
                </tr>
                <tr className="">
                  <td className="collapsing">Present Hash</td>
                  <td className="">{blockDetail.parentHash}</td>
                </tr>
                <tr className="">
                  <td className="collapsing">Nonce</td>
                  <td className="">{blockDetail.nonce}</td>
                </tr>
                <tr className="">
                  <td className="collapsing">Gas Limit</td>
                  <td className="">{blockDetail.gasLimit}</td>
                </tr>
                <tr className="">
                  <td className="collapsing">Time</td>
                  <td className="">{moment(blockDetail.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')}</td>
                </tr>
                <tr className="">
                  <td className="collapsing bottom">Size</td>
                  <td className="bottom">{blockDetail.size}</td>
                </tr>
              </tbody>
            </StyledTabel>
          )}
          <TabZone>
            <div className="ui attached tabular menu">
              <button type="button" className={currentTab === 1 ? 'active item' : 'item'} onClick={() => this.setState({ currentTab: 1 })}>
                Transactions
              </button>
              <button
                className={currentTab === 2 ? 'active item' : 'item'}
                type="button"
                onClick={() => {
                  this.fetchReffereBlock(params.blockhash);
                  this.setState({ currentTab: 2 });
                }}
              >
                Referee Block
              </button>
            </div>
            <div className={currentTab === 1 ? 'ui bottom attached segment active tab' : 'ui bottom attached segment tab'}>
              <StyledTabelWrapper>
                <div className="ui fluid card">
                  <div className="content">
                    <DataList showHeader columns={TxColumns} dataSource={TxList} />
                  </div>
                </div>
              </StyledTabelWrapper>
              <TabWrapper>
                <Pagination
                  prevItem={{
                    'aria-label': 'Previous item',
                    content: 'Previous',
                  }}
                  nextItem={{
                    'aria-label': 'Next item',
                    content: 'Next',
                  }}
                  onPageChange={(e, data) => {
                    e.preventDefault();
                    this.fetchTxDetail(params.blockhash, data);
                  }}
                  defaultActivePage={1}
                  totalPages={Math.ceil(TxTotalCount / 10)}
                />
              </TabWrapper>
            </div>
            <div className={currentTab === 2 ? 'ui bottom attached segment active tab' : 'ui bottom attached segment tab'}>
              <StyledTabelWrapper>
                <div className="ui fluid card">
                  <div className="content">
                    <DataList showHeader columns={RefColumns} dataSource={refereeBlockList} />
                  </div>
                </div>
              </StyledTabelWrapper>
            </div>
          </TabZone>
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
