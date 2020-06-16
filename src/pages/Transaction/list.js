import React, { Component } from 'react';
import styled from 'styled-components';
import superagent from 'superagent';
import { Popup } from 'semantic-ui-react';
import Pagination from '../../components/Pagination';
import DataList from '../../components/DataList';
import Countdown from '../../components/Countdown';
import TableLoading from '../../components/TableLoading';
import EllipsisLine from '../../components/EllipsisLine';
import { convertToValueorFee, converToGasPrice, i18n, getContractList } from '../../utils';
import media from '../../globalStyles/media';
import * as commonCss from '../../globalStyles/common';
import { reqTransactionList, reqContractListInfo } from '../../utils/api';
import TotalDesc from '../../components/TotalDesc';
import iconStatusErr from '../../assets/images/icons/status-err.svg';
import iconStatusSkip from '../../assets/images/icons/status-skip.svg';
import AddressEllipseLine from '../../components/AddressEllipseLine';

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const TabWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  .txnhash-err {
    display: flex;
    > img {
      align-self: flex-start;
    }
    .txnhash-err-line1 {
      flex: 1;
      margin-left: 4px;
    }
    .txnhash-err-line2 {
      margin-top: 5px;
      font-size: 14px;
      line-height: 14px;
      color: #8f8f8f;
    }
  }
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
  ${commonCss.paginatorMixin}
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

const ContractCell = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;
  font-weight: normal;
`;

/* eslint react/destructuring-assignment: 0 */
let curPageBase = 1;
document.addEventListener('clean_state', () => {
  curPageBase = 1;
});

const pageSize = 10;
class List extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      TxList: [],
      TotalCount: 0,
      curPage: curPageBase,
      txServerTimestamp: 0,
    };
  }

  componentDidMount() {
    const { curPage } = this.state;
    this.fetchTxList({ activePage: curPage });
  }

  componentWillUnmount() {
    curPageBase = this.state.curPage;
  }

  fetchTxList({ activePage }) {
    this.setState({ isLoading: true });

    reqTransactionList({
      page: activePage,
      pageSize,
    }).then((body) => {
      if (body.code === 0) {
        this.setState({
          TxList: body.result.list,
          TotalCount: body.result.total,
          curPage: activePage,
          txServerTimestamp: body.serverTimestamp,
        });
        reqContractListInfo(getContractList(body.result.list));
        document.dispatchEvent(new Event('scroll-to-top'));
      }
      this.setState({ isLoading: false });
    });
  }

  render() {
    const { TxList, TotalCount, isLoading, curPage, txServerTimestamp } = this.state;

    const columns = [
      {
        key: 1,
        className: 'two wide aligned',
        dataIndex: 'hash',
        title: i18n('Hash'),
        render: (text, row) => {
          const line = (
            <EllipsisLine popUpCfg={{ position: 'top left', pinned: true }} linkTo={`/transactionsdetail/${text}`} text={text} />
          );
          if (row.status === 0) {
            return line;
          }
          let errIcon;
          if (row.status === 1) {
            errIcon = (
              <Popup trigger={<img src={iconStatusErr} />} content={i18n('app.pages.err-reason.1')} position="top left" hoverable />
            );
          } else if (row.status === 2) {
            errIcon = (
              <Popup trigger={<img src={iconStatusSkip} />} content={i18n('app.pages.err-reason.2')} position="top left" hoverable />
            );
          }

          return (
            <div className="txnhash-err">
              {errIcon}
              <div className="txnhash-err-line1">{line}</div>
            </div>
          );
        },
      },
      {
        key: 2,
        className: 'two wide aligned',
        dataIndex: 'from',
        title: i18n('From'),
        render: (text) => <AddressEllipseLine address={text} />,
      },
      {
        key: 3,
        className: 'two wide aligned',
        dataIndex: 'to',
        title: i18n('To'),
        render: (text, row) => {
          return <AddressEllipseLine contractCreated={row.contractCreated} type="to" address={row.to} />;
        },
      },
      {
        key: 4,
        className: 'two wide aligned',
        dataIndex: 'value',
        title: i18n('Value'),
        render: (text) => <EllipsisLine unit="CFX" text={convertToValueorFee(text)} />,
      },
      {
        key: 5,
        className: 'two wide aligned',
        dataIndex: 'gasPrice',
        title: i18n('Gas Price'),
        render: (text) => <EllipsisLine unit="Gdrip" text={converToGasPrice(text)} />,
      },
      {
        key: 6,
        className: 'three wide aligned',
        dataIndex: 'timestamp',
        title: i18n('app.pages.txns.age'),
        render: (text, row) => <Countdown baseTime={txServerTimestamp} timestamp={row.syncTimestamp} />,
      },
    ];

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
              <div className="page-pc">
                <TotalDesc total={TotalCount} />
                <Pagination
                  style={{ float: 'right' }}
                  ellipsisItem={null}
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
                  activePage={curPage}
                  totalPages={Math.ceil(TotalCount / pageSize)}
                />
              </div>
              <div className="page-h5">
                <TotalDesc total={TotalCount} />
                <Pagination
                  prevItem={{
                    'aria-label': 'Previous item',
                    content: i18n('lastPage'),
                  }}
                  nextItem={{
                    'aria-label': 'Next item',
                    content: i18n('nextPage'),
                  }}
                  boundaryRange={0}
                  activePage={curPage}
                  onPageChange={(e, data) => {
                    e.preventDefault();
                    this.fetchTxList(data);
                  }}
                  ellipsisItem={null}
                  firstItem={null}
                  lastItem={null}
                  siblingRange={1}
                  totalPages={Math.ceil(TotalCount / pageSize)}
                />
              </div>
            </StyledTabel>
          </TabWrapper>
        </Wrapper>
      </div>
    );
  }
}
export default List;
