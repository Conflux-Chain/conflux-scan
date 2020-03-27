import React, { Component } from 'react';
import styled from 'styled-components';
import Pagination from '../../components/Pagination';
import DataList from '../../components/DataList';
import Countdown from '../../components/Countdown';
import TableLoading from '../../components/TableLoading';
import EllipsisLine from '../../components/EllipsisLine';
import media from '../../globalStyles/media';
import { i18n, sendRequest } from '../../utils/index';
import ConfirmSimple from '../../components/ConfirmSimple';
import Dag from '../../components/Dag';
import * as commonCss from '../../globalStyles/common';
import { reqBlockList } from '../../utils/api';

const DagWrapper = styled.div`
  #dag-viewer {
    min-height: 240px;
    width: 100%;
    > canvas {
      border-radius: 4px;
    }
  }
`;

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
      padding: 16px 0 !important;
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
  * {
    margin: 0;
  }
  h1 {
    color: #000;
    font-size: 20px;
  }
`;

const AbsWrapper = styled.div`
  position: relative;
  height: 0;
`;
const TitleWrapper = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  color: white;
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  > h1 {
    color: white;
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
    title: i18n('Epoch'),
    className: 'one wide aligned',
    render: (text) => <EllipsisLine linkTo={`/epochsdetail/${text}`} text={text} />,
  },
  {
    key: 2,
    dataIndex: 'position',
    title: i18n('Position'),
    className: 'one wide aligned plain_th',
    render: (text /* , row */) => (
      <div>
        <PCell>{1 + text}</PCell>
      </div>
    ),
  },
  {
    key: 3,
    dataIndex: 'hash',
    title: i18n('Hash'),
    className: 'two wide aligned',
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
    title: i18n('Difficulty'),
    render: (text) => <PCell>{text}</PCell>,
  },
  {
    key: 5,
    className: 'one wide aligned',
    dataIndex: 'miner',
    title: i18n('Miner'),
    render: (text) => <EllipsisLine linkTo={`/accountdetail/${text}`} text={text} />,
  },
  {
    key: 6,
    className: 'one wide aligned plain_th',
    dataIndex: 'gasLimit',
    title: i18n('Gas Limit'),
    render: (text) => <PCell>{text}</PCell>,
  },
  {
    key: 7,
    className: 'three wide aligned',
    dataIndex: 'timestamp',
    title: i18n('Age'),
    render: (text) => <Countdown timestamp={text * 1000} />,
  },
  {
    key: 8,
    className: 'one wide aligned plain_th',
    dataIndex: 'transactionCount',
    title: i18n('Tx Count'),
    render: (text) => <PCell>{text}</PCell>,
  },
];

/* eslint react/destructuring-assignment: 0 */
let curPageBase = 1;
document.addEventListener('clean_state', (/* event */) => {
  curPageBase = 1;
});

class List extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      BlockList: [],
      TotalCount: 100,
      curPage: curPageBase,
    };
  }

  componentDidMount() {
    this.fetchBlockList({ activePage: this.state.curPage });
  }

  componentWillUnmount() {
    curPageBase = this.state.curPage;
  }

  fetchBlockList({ activePage }) {
    this.setState({ isLoading: true });
    reqBlockList({
      pageNum: activePage,
      pageSize: 10,
    }).then((body) => {
      const { data } = body.result;
      this.setState({
        isLoading: false,
        curPage: activePage,
        BlockList: data,
        TotalCount: body.result.total,
      });
    });
  }

  render() {
    const { BlockList, TotalCount, isLoading, confirmOpen, curPage } = this.state;
    return (
      <div className="page-block-list">
        <Wrapper>
          <HeadBar>
            <DagWrapper>
              <Dag>
                <AbsWrapper>
                  <TitleWrapper>
                    <IconFace>
                      <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#iconqukuaigaoduxuanzhong" />
                      </svg>
                    </IconFace>
                    <h1>{i18n('app.pages.blockAndTx.blocks')}</h1>
                  </TitleWrapper>
                </AbsWrapper>
              </Dag>
            </DagWrapper>
          </HeadBar>
          <TabWrapper>
            <StyledTabel>
              <div className="ui fluid card">
                <div className="content">
                  {isLoading && <TableLoading />}
                  <DataList isMobile showHeader columns={columns} dataSource={BlockList} />
                </div>
              </div>
              <div className="page-pc">
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
                    this.fetchBlockList(data);
                  }}
                  activePage={curPage}
                  totalPages={Math.ceil(TotalCount / 10)}
                  ellipsisItem={null}
                />
              </div>
              <div className="page-h5">
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
                    this.fetchBlockList(data);
                  }}
                  ellipsisItem={null}
                  firstItem={null}
                  lastItem={null}
                  siblingRange={1}
                  totalPages={Math.ceil(TotalCount / 10)}
                />
              </div>
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
