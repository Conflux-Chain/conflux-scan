import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import superagent from 'superagent';
import DataList from '../../components/DataList';
import Countdown from '../../components/Countdown';
import EllipsisLine from '../../components/EllipsisLine';
import TableLoading from '../../components/TableLoading';
import '../../assets/semantic-ui/semantic.css';
import { initSse, closeSource, sendRequest } from '../../utils';

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: flex-start;
`;

const StyledTabel = styled.div`
  margin-top: 20px;
  width: calc(50% - 6px);

  &.right {
    margin-left: 16px;
  }
`;
const IconFace = styled.div`
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 23px;
    height: 23px;
  }
`;
const PCell = styled.div`
  margin: 0 !important;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.87);
  font-style: normal;
  font-weight: 400;
  height: 25px;
`;

const StyledButton = styled.button`
  color: rgba(0, 0, 0, 0.56) !important;
  background: #e0e1e2 !important;
  &:hover {
    color: #fff !important;
    background: #1e3de4 !important;
  }
`;

const columns = [
  {
    key: 1,
    dataIndex: 'ein',
    title: 'Blocks',
    // className: 'two wide',
    render: (text, row) => (
      <IconFace>
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#iconjinrijiaoyiliang" />
        </svg>
      </IconFace>
    ),
  },
  {
    key: 2,
    dataIndex: 'drei',
    title: 'Blocks',
    render: (text, row) => (
      <div>
        <PCell>
          <EllipsisLine isPivot text={row.zwei} />
        </PCell>
        <PCell>{row.drei}</PCell>
      </div>
    ),
  },
  {
    key: 3,
    dataIndex: 'drei',
    title: 'Blocks',
    render: (text, row) => (
      <div>
        <EllipsisLine text={row.zwei} />
        <PCell>{row.drei}</PCell>
      </div>
    ),
  },
  {
    key: 4,
    className: 'two wide right aligned',
    dataIndex: 'drei',
    title: 'Blocks',
    render: (text) => <div className="ui label">{text}</div>,
  },
];
const dataSource = [
  { key: 1, ein: '80580', zwei: '0xe969a6fc05897123123', drei: 'Alichs' },
  { key: 2, ein: '80581', zwei: '0xe969a6fc05897124124', drei: 'Schwarz' },
];

class BlockAndTxn extends Component {
  constructor() {
    super();
    this.state = {
      BlockList: [],
      TxList: [],
    };
  }

  componentDidMount() {
    this.fetchInitList();
    initSse(this, '/proxy/fetchBlockandTxList?pageNum=1&pageSize=10');
  }

  componentWillUnmount() {
    closeSource();
  }

  async fetchInitList() {
    const { code, result } = (await sendRequest({
      url: '/proxy/fetchInitBlockandTxList',
      query: {
        pageNum: 1,
        pageSize: 10,
      },
    })).body;
    if (!code) {
      this.setState({
        BlockList: result.find((item) => Object.keys(item)[0] === 'block/list')['block/list'],
        TxList: result.find((item) => Object.keys(item)[0] === 'transaction/list')['transaction/list'],
      });
    }
  }

  render() {
    const { BlockList, TxList } = this.state;
    const BlockColumns = [
      {
        key: 1,
        dataIndex: 'hash',
        title: 'Blocks',
        render: () => (
          <IconFace>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#iconqukuaigaoduxuanzhong" />
            </svg>
          </IconFace>
        ),
      },
      {
        key: 2,
        dataIndex: 'hash',
        title: 'Blocks',
        render: (text, row) => (
          <div>
            <PCell>
              <EllipsisLine linkTo={`/blocksdetail/${text}`} isPivot={row.isPivot} text={text} />
            </PCell>
            <PCell>
              <Countdown timestamp={row.timestamp * 1000} />
            </PCell>
          </div>
        ),
      },
      {
        key: 3,
        dataIndex: 'miner',
        title: 'Blocks',
        render: (text, row) => (
          <div>
            <EllipsisLine linkTo={`/accountdetail/${text}`} text={'Miner ' + text} />
            <PCell>{row.transactionCount} txns</PCell>
          </div>
        ),
      },
      {
        key: 4,
        className: 'two wide right aligned',
        dataIndex: 'viel',
        title: 'Blocks',
      },
    ];

    const TxColumns = [
      {
        key: 1,
        dataIndex: 'hash',
        title: 'Blocks',
        render: () => (
          <IconFace>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#iconjinrijiaoyiliang" />
            </svg>
          </IconFace>
        ),
      },
      {
        key: 2,
        dataIndex: 'hash',
        title: 'Blocks',
        render: (text, row) => (
          <div>
            <PCell>
              <EllipsisLine linkTo={`/transactionsdetail/${text}`} isPivot={row.isPivot} text={text} />
            </PCell>
            <PCell>
              <Countdown timestamp={row.timestamp * 1000} />
            </PCell>
          </div>
        ),
      },
      {
        key: 3,
        dataIndex: 'from',
        title: 'Blocks',
        render: (text, row) => (
          <div>
            <EllipsisLine prefix="From" linkTo={`/accountdetail/${text}`} text={text} />
            <EllipsisLine prefix="To" linkTo={`/accountdetail/${row.to}`} text={row.to} />
          </div>
        ),
      },
      {
        key: 4,
        className: 'three wide right aligned',
        dataIndex: 'gasPrice',
        title: 'Blocks',
        render: (text) => <div className="ui label">{'GAS ' + text}</div>,
      },
    ];
    return (
      <div className="page-block-txn">
        <Wrapper>
          <StyledTabel className="left">
            <div className="ui card" style={{ width: '100%' }}>
              <div className="content">
                <div className="header">Blocks</div>
              </div>
              <div className="content">
                {!BlockList.length && <TableLoading />}
                <DataList columns={BlockColumns} dataSource={BlockList} />
              </div>
              <div className="extra content">
                <Link to="/blocks">
                  <StyledButton className="ui fluid violet button ">View All Blocks</StyledButton>
                </Link>
              </div>
            </div>
          </StyledTabel>
          <StyledTabel className="right">
            <div className="ui card" style={{ width: '100%' }}>
              <div className="content">
                <div className="header">Transactions</div>
              </div>
              <div className="content">
                {!TxList.length && <TableLoading />}
                <DataList columns={TxColumns} dataSource={TxList} />
              </div>
              <div className="extra content">
                <Link to="/transactions">
                  <StyledButton className="ui fluid violet button ">View All Transactions</StyledButton>
                </Link>
              </div>
            </div>
          </StyledTabel>
        </Wrapper>
      </div>
    );
  }
}
export default BlockAndTxn;
