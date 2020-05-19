import React, { Component } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import superagent from 'superagent';
import Pagination from '../../components/Pagination';
import DataList from '../../components/DataList';
import TableLoading from '../../components/TableLoading';
import EllipsisLine from '../../components/EllipsisLine';
import Countdown from '../../components/Countdown';
import media from '../../globalStyles/media';
import * as commonCss from '../../globalStyles/common';
import { i18n, getTotalPage } from '../../utils';
import { reqBlockList } from '../../utils/api';
import { errorCodes } from '../../constants';

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  ${media.mobile`
    width: 95%;
    margin: 0 auto;
  `}
`;

const StyledTabel = styled.div`
  margin-top: 20px;
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
`;

const PCell = styled.div`
  margin: 0 !important;
`;

const HeadBar = styled.div`
  margin-top: 24px;
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
const PagerWrap = styled.div`
  display: flex;
  margin-top: 24px;
  justify-content: flex-end;
  ${commonCss.paginatorMixin}
`;

const columns = [
  {
    key: 1,
    dataIndex: 'blockIndex',
    title: i18n('Position'),
    className: 'one wide aligned plain_th',
    render: (text) => 1 + text,
  },
  {
    key: 2,
    dataIndex: 'hash',
    title: i18n('Hash'),
    className: 'two wide aligned',
    render: (text, row) => (
      <div>
        <PCell>
          <EllipsisLine linkTo={`/blocksdetail/${text}`} isPivot={row.pivotHash === row.hash} isLong text={text} />
        </PCell>
      </div>
    ),
  },
  {
    key: 3,
    dataIndex: 'difficulty',
    title: i18n('Difficulty'),
    className: 'one wide aligned plain_th',
    render: (text) => (
      <div>
        <PCell>{text}</PCell>
      </div>
    ),
  },
  {
    key: 4,
    dataIndex: 'miner',
    title: i18n('Miner'),
    className: 'one wide aligned',
    render: (text) => (
      <div>
        <PCell>
          <EllipsisLine linkTo={`/address/${text}`} text={text} />
        </PCell>
      </div>
    ),
  },
  {
    key: 5,
    dataIndex: 'gasLimit',
    title: i18n('Gas Limit'),
    className: 'one wide aligned plain_th',
    render: (text) => text,
  },
  {
    key: 6,
    dataIndex: 'timestamp',
    title: i18n('Age'),
    className: 'three wide aligned plain_th',
    render: (text) => (
      <PCell>
        <Countdown timestamp={text * 1000} />
      </PCell>
    ),
  },
  {
    key: 7,
    className: 'one wide left aligned plain_th',
    dataIndex: 'transactionCount',
    title: i18n('Tx Count'),
    render: (text) => text,
  },
];

const pageSize = 10;
class Detail extends Component {
  constructor() {
    super();
    this.getInitState = () => ({
      BlockList: [],
      curPage: 1,
      totalCount: 0,
      isLoading: false,
    });
    this.state = this.getInitState();
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;
    const { curPage } = this.state;
    this.fetchInitList({
      epochid: params.epochid,
      curPage,
    });
  }

  componentDidUpdate(prevProps) {
    const { curPage } = this.state;
    // eslint-disable-next-line react/destructuring-assignment
    if (this.props.match.params.epochid !== prevProps.match.params.epochid) {
      const {
        match: { params },
      } = this.props;
      // eslint-disable-next-line  react/no-did-update-set-state
      this.setState(this.getInitState());
      this.fetchInitList({
        epochid: params.epochid,
        curPage,
      });
    }
  }

  async fetchInitList({ epochid, curPage }) {
    const { history } = this.props;
    this.setState({ isLoading: true });
    reqBlockList(
      {
        page: curPage,
        pageSize,
        epochNumber: epochid,
      },
      {
        showError: false,
      }
    ).then((body) => {
      if (body.code === 0) {
        this.setState({
          BlockList: body.result.list.filter((v) => !!v),
          totalCount: body.result.total,
          isLoading: false,
          curPage,
        });
      } else if (body.code === errorCodes.ParameterError) {
        history.push(`/search-notfound?searchId=${epochid}`);
      }
    });
  }

  render() {
    const { BlockList, curPage, totalCount, isLoading } = this.state;
    const {
      match: { params },
    } = this.props;
    return (
      <div className="page-epoch-detail">
        <Wrapper>
          <HeadBar>
            <h1>{i18n('Epoch')}</h1>
            <p>{params.epochid}</p>
          </HeadBar>
          {isLoading && <TableLoading />}
          <StyledTabel>
            <div className="ui fluid card">
              <div className="content">
                <DataList isMobile showHeader columns={columns} dataSource={BlockList} />
              </div>
            </div>
          </StyledTabel>

          <PagerWrap>
            <div className="page-pc">
              <Pagination
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
                  this.fetchInitList({
                    curPage: data.activePage,
                    epochid: params.epochid,
                  });
                }}
                activePage={curPage}
                totalPages={getTotalPage(totalCount, pageSize)}
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
                  this.fetchInitList({
                    curPage: data.activePage,
                    epochid: params.epochid,
                  });
                }}
                ellipsisItem={null}
                firstItem={null}
                lastItem={null}
                siblingRange={1}
                totalPages={getTotalPage(totalCount, pageSize)}
              />
            </div>
          </PagerWrap>
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
