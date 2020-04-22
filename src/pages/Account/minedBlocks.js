import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import DataList from '../../components/DataList';
import EllipsisLine from '../../components/EllipsisLine';
import Countdown from '../../components/Countdown';
import * as commonCss from '../../globalStyles/common';
import { i18n, renderAny } from '../../utils';
import { StyledTabel, TabPanel } from './styles';
import Pagination from '../../components/Pagination';
import { reqMinedBlockList } from '../../utils/api';
import { TotalDesc, getTotalPage } from '../../components/TotalDesc';

const PCell = styled.div`
  margin: 0 !important;
`;

const MinedWrap = styled.div`
  display: flex;
  margin-top: 24px;
  justify-content: flex-end;
  ${commonCss.paginatorMixin}
`;

const minedColumns = [
  {
    key: 1,
    dataIndex: 'epochNumber',
    className: 'one wide aligned',
    title: i18n('Epoch'),
    render: (text) => <EllipsisLine linkTo={`/epochsdetail/${text}`} text={text} />,
  },
  {
    key: 2,
    dataIndex: 'blockIndex',
    className: 'one wide aligned plain_th',
    title: i18n('Position'),
    render: (text, row) => (
      <div>
        <PCell>{1 + text}</PCell>
      </div>
    ),
  },
  {
    key: 3,
    dataIndex: 'hash',
    className: 'two wide aligned',
    title: i18n('Hash'),
    render: (text, row) => (
      <div>
        <EllipsisLine isLong linkTo={`/blocksdetail/${text}`} isPivot={row.pivotHash === row.hash} text={text} />
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
    render: (text) => <EllipsisLine linkTo={`/address/${text}#minedBlocks`} text={text} />,
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
    className: 'two wide aligned plain_th',
    dataIndex: 'transactionCount',
    title: i18n('Tx Count'),
    render: (text) => <PCell>{text}</PCell>,
  },
];

class MinedBlocks extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      curMinedPage: 1,
      minedBlockList: [],
      minedTotalCount: 0,
    };
  }

  componentDidMount() {
    this.onMount();
  }

  onMount() {
    const { accountid } = this.props;
    this.fetchMinedBlockList(accountid, 1);
  }

  fetchMinedBlockList(accountid, curMinedPage) {
    reqMinedBlockList({
      miner: accountid,
      page: curMinedPage,
      pageSize: 10,
    }).then((body) => {
      if (body.code === 0) {
        const { total, listLimit } = body.result;
        this.setState({
          minedBlockList: body.result.list.filter((v) => !!v),
          curMinedPage,
          minedTotalCount: total,
          listLimit,
        });
      }
    });
  }

  render() {
    const { accountid } = this.props;
    const { minedBlockList, minedTotalCount, curMinedPage } = this.state;
    const { listLimit } = this.state;

    return (
      <TabPanel className="ui bottom attached segment active tab">
        <StyledTabel>
          <div className="ui fluid card">
            <div className="content">
              <DataList showHeader columns={minedColumns} dataSource={minedBlockList} />
            </div>
          </div>
        </StyledTabel>

        {renderAny(() => {
          if (!minedTotalCount) {
            return null;
          }
          return (
            <MinedWrap>
              <div className="page-pc">
                <TotalDesc total={minedTotalCount} listLimit={listLimit} />
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
                    this.fetchMinedBlockList(accountid, data.activePage);
                  }}
                  activePage={curMinedPage}
                  totalPages={getTotalPage(minedTotalCount, 10, listLimit)}
                  ellipsisItem={null}
                />
              </div>
              <div className="page-h5">
                <TotalDesc total={minedTotalCount} listLimit={listLimit} />
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
                  activePage={curMinedPage}
                  onPageChange={(e, data) => {
                    e.preventDefault();
                    this.fetchMinedBlockList(accountid, data.activePage);
                  }}
                  ellipsisItem={null}
                  firstItem={null}
                  lastItem={null}
                  siblingRange={1}
                  totalPages={getTotalPage(minedTotalCount, 10, listLimit)}
                />
              </div>
            </MinedWrap>
          );
        })}
      </TabPanel>
    );
  }
}

MinedBlocks.propTypes = {
  accountid: PropTypes.string.isRequired,
};

MinedBlocks.defaultProps = {};

export default MinedBlocks;
