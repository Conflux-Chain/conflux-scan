import React, { Component } from 'react';
import styled from 'styled-components';
import superagent from 'superagent';
import { Pagination } from 'semantic-ui-react';
import DataList from '../../components/DataList';
import Countdown from '../../components/Countdown';
import TableLoading from '../../components/TableLoading';
import EllipsisLine from '../../components/EllipsisLine';
import { convertToValueorFee, converToGasPrice, i18n } from '../../utils';
import '../../assets/semantic-ui/semantic.css';
import media from '../../globalStyles/media';
import ConfirmSimple from '../../components/ConfirmSimple';

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
  width: 100%;
  ${media.mobile`
    width: 95%;
    margin: 0 auto;
  `}

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
      padding: 16px 0 16px 20px !important;
    }
  }

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
  ${media.mobile`
    width: 95%;
    margin: 0 auto;
    margin-bottom: 24px;
  `}
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
    className: 'two wide aligned plain_th',
    dataIndex: 'hash',
    title: i18n('Hash'),
    render: (text) => <EllipsisLine isLong linkTo={`/transactionsdetail/${text}`} text={text} />,
  },
  {
    key: 2,
    className: 'two wide aligned plain_th',
    dataIndex: 'from',
    title: i18n('From'),
    render: (text) => <EllipsisLine linkTo={`/accountdetail/${text}`} text={text} />,
  },
  {
    key: 3,
    className: 'two wide aligned plain_th',
    dataIndex: 'to',
    title: i18n('To'),
    render: (text) => <EllipsisLine linkTo={`/accountdetail/${text}`} text={text} />,
  },
  {
    key: 4,
    className: 'two wide aligned plain_th',
    dataIndex: 'value',
    title: i18n('Value'),
    render: (text) => <EllipsisLine unit="CFX" text={convertToValueorFee(text)} />,
  },
  {
    key: 5,
    className: 'two wide aligned plain_th',
    dataIndex: 'gasPrice',
    title: i18n('Gas Price'),
    render: (text) => <EllipsisLine unit="Gdip" text={converToGasPrice(text)} />,
  },
  {
    key: 6,
    className: 'three wide aligned plain_th',
    dataIndex: 'timestamp',
    title: i18n('app.pages.txns.age'),
    render: (text) => <Countdown timestamp={text * 1000} />,
  },
];
const dataSource = [
  { key: 1, ein: '80580', zwei: '0xe969a6fc05897123123', drei: 'Alichs' },
  { key: 2, ein: '80581', zwei: '0xe969a6fc05897124124', drei: 'Schwarz' },
];

let curPageBase = 1;
/* eslint react/destructuring-assignment: 0 */
class List extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      TxList: [],
      TotalCount: 100,
      curPage: curPageBase,
    };
  }

  componentDidMount() {
    const { curPage } = this.state;
    this.fetchTxList({ activePage: curPage });
  }

  componentWillUnmount() {
    curPageBase = this.state.curPage;
  }

  async fetchTxList({ activePage }) {
    if (activePage > 10000) {
      this.setState({
        confirmOpen: true,
      });
      return;
    }
    this.setState({ isLoading: true });
    const { code, result } = (await superagent.get(`/proxy/fetchInitBlockandTxList?pageNum=${activePage}&pageSize=10`)).body;
    if (!code) {
      this.setState(
        {
          TxList: result.find((item) => Object.keys(item)[0] === 'transaction/list')['transaction/list'],
          TotalCount: result.find((item) => Object.keys(item)[0] === 'transaction/list')['total_transaction/list'],
        },
        () => this.setState({ isLoading: false, curPage: activePage })
      );
    }
  }

  render() {
    const { TxList, TotalCount, isLoading, confirmOpen } = this.state;
    return (
      <div className="page-transaction-list">
        <Wrapper>
          <HeadBar>
            <IconFace>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#iconjinrijiaoyiliang" />
              </svg>
            </IconFace>
            <h1>{i18n('Transactions')}</h1>
          </HeadBar>
          <TabWrapper>
            <StyledTabel>
              <div className="ui fluid card">
                <div className="content">
                  {isLoading && <TableLoading />}
                  <DataList isMobile showHeader columns={columns} dataSource={TxList} />
                </div>
              </div>
              <Pagination
                style={{ float: 'right' }}
                prevItem={{
                  'aria-label': 'Previous item',
                  content: i18n('lastPage'),
                }}
                nextItem={{
                  'aria-label': 'Next item',
                  content: i18n('nextPage'),
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
        <ConfirmSimple
          open={confirmOpen}
          onConfirm={() => {
            this.setState({
              confirmOpen: false,
            });
          }}
        />
      </div>
    );
  }
}
export default List;
