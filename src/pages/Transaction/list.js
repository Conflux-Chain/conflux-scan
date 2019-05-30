import React, { Component } from 'react';
import styled from 'styled-components';
import superagent from 'superagent';
import { Pagination } from 'semantic-ui-react';
import DataList from '../../components/DataList';
import Countdown from '../../components/Countdown';
import TableLoading from '../../components/TableLoading';
import EllipsisLine from '../../components/EllipsisLine';
import { convertToValueorFee, converToGasPrice } from '../../utils';
import '../../assets/semantic-ui/semantic.css';

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const TabWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

const StyledTabel = styled.div`
  // margin-top: 20px;
  width: 100%;

  &.right {
    margin-left: 16px;
  }
`;

const PCell = styled.div`
  margin: 0 !important;
`;

const HeadBar = styled.div`
  width: 100%;
  font-size: 16px;
  margin-bottom: 24px;
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
    margin-right: 24px;
  }
`;

const IconFace = styled.div`
  margin-right: 16px;
  width: 32px;
  height: 32px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 24px;
    height: 24px;
  }
`;

const columns = [
  {
    key: 1,
    dataIndex: 'hash',
    title: 'Hash',
    render: (text) => <EllipsisLine isLong linkTo={`/transactionsdetail/${text}`} text={text} />,
  },
  {
    key: 2,
    dataIndex: 'from',
    title: 'From',
    render: (text) => <EllipsisLine linkTo={`/accountdetail/${text}`} text={text} />,
  },
  {
    key: 3,
    dataIndex: 'to',
    title: 'To',
    render: (text) => <EllipsisLine linkTo={`/accountdetail/${text}`} text={text} />,
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
    title: 'Gas Price',
    render: (text) => <EllipsisLine unit="Gdip" text={converToGasPrice(text)} />,
  },
  {
    key: 6,
    className: 'two wide aligned plain_th',
    dataIndex: 'timestamp',
    title: 'Age',
    render: (text) => <Countdown timestamp={text * 1000} />,
  },
];
const dataSource = [
  { key: 1, ein: '80580', zwei: '0xe969a6fc05897123123', drei: 'Alichs' },
  { key: 2, ein: '80581', zwei: '0xe969a6fc05897124124', drei: 'Schwarz' },
];

class List extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      TxList: [],
      TotalCount: 100,
    };
  }

  componentDidMount() {
    this.fetchTxList({ activePage: 1 });
  }

  async fetchTxList({ activePage }) {
    this.setState({ isLoading: true });
    const { code, result } = (await superagent.get(
      `http://127.0.0.1:3000/proxy/fetchInitBlockandTxList?pageNum=${activePage}&pageSize=10`
    )).body;
    if (!code) {
      this.setState(
        {
          TxList: result.find((item) => Object.keys(item)[0] === 'transaction/list')['transaction/list'],
          TotalCount: result.find((item) => Object.keys(item)[0] === 'transaction/list')['total_transaction/list'],
        },
        () => this.setState({ isLoading: false })
      );
    }
  }

  render() {
    const { TxList, TotalCount, isLoading } = this.state;
    return (
      <div className="page-transaction-list">
        <Wrapper>
          <HeadBar>
            <IconFace>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#iconjinrijiaoyiliang" />
              </svg>
            </IconFace>
            <h1>Transactions</h1>
          </HeadBar>
          <TabWrapper>
            <StyledTabel>
              <div className="ui fluid card">
                <div className="content">
                  {isLoading && <TableLoading />}
                  <DataList showHeader columns={columns} dataSource={TxList} />
                </div>
              </div>
              <Pagination
                style={{ float: 'right' }}
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
                  this.fetchTxList(data);
                }}
                defaultActivePage={1}
                totalPages={Math.ceil(TotalCount / 10)}
              />
            </StyledTabel>
          </TabWrapper>
        </Wrapper>
      </div>
    );
  }
}
export default List;
