import React, { Component } from 'react';
import styled from 'styled-components';
import superagent from 'superagent';
import { Pagination } from 'semantic-ui-react';
import DataList from '../../components/DataList';
import Countdown from '../../components/Countdown';
import TableLoading from '../../components/TableLoading';
import EllipsisLine from '../../components/EllipsisLine';
import '../../assets/semantic-ui/semantic.css';

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const TabWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledTabel = styled.div`
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
    dataIndex: 'epochNumber',
    title: 'Epoch',
  },
  {
    key: 2,
    dataIndex: 'drei',
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
    title: 'Hash',
    render: (text, row) => (
      <div>
        <EllipsisLine isPivot={row.isPivot} text={text} />
      </div>
    ),
  },
  {
    key: 4,
    className: 'two wide aligned',
    dataIndex: 'difficulty',
    title: 'Difficulty',
    render: (text) => <PCell>{text}</PCell>,
  },
  {
    key: 5,
    className: 'two wide aligned',
    dataIndex: 'miner',
    title: 'Miner',
    render: (text) => <EllipsisLine text={text} />,
  },
  {
    key: 6,
    className: 'two wide aligned',
    dataIndex: 'gasLimit',
    title: 'Gas Limit',
    render: (text) => <PCell>{text}</PCell>,
  },
  {
    key: 7,
    className: 'two wide aligned',
    dataIndex: 'timestamp',
    title: 'Age',
    render: (text) => <Countdown timestamp={text * 1000} />,
  },
  {
    key: 8,
    className: 'two wide aligned',
    dataIndex: 'transactionCount',
    title: 'Tx Count',
    render: (text) => <PCell>{text}</PCell>,
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
      BlockList: [],
      TotalCount: 100,
    };
  }

  componentDidMount() {
    this.fetchBlockList({ activePage: 1 });
  }

  async fetchBlockList({ activePage }) {
    this.setState({ isLoading: true });
    const { code, result } = (await superagent.get(`/proxy/fetchInitBlockandTxList?pageNum=${activePage}&pageSize=10`)).body;
    if (!code) {
      this.setState(
        {
          BlockList: result.find((item) => Object.keys(item)[0] === 'block/list')['block/list'],
          TotalCount: result.find((item) => Object.keys(item)[0] === 'block/list')['total_block/list'],
        },
        () => this.setState({ isLoading: false })
      );
    }
  }

  render() {
    const { BlockList, TotalCount, isLoading } = this.state;
    return (
      <div className="page-block-list">
        <Wrapper>
          <HeadBar>
            <IconFace>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#iconqukuaigaoduxuanzhong" />
              </svg>
            </IconFace>
            <h1>Blocks</h1>
          </HeadBar>
          <TabWrapper>
            <StyledTabel>
              <div className="ui fluid card">
                <div className="content">
                  {isLoading && <TableLoading />}
                  <DataList showHeader columns={columns} dataSource={BlockList} />
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
                  this.fetchBlockList(data);
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
