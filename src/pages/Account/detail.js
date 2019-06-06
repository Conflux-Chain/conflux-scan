import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import superagent from 'superagent';
import moment from 'moment';
import { Pagination, Dropdown } from 'semantic-ui-react';
import { DatePicker } from 'antd';
import { injectIntl } from 'react-intl';
import get from 'lodash/get';
import compose from 'lodash/fp/compose';
import DataList from '../../components/DataList';
import Countdown from '../../components/Countdown';
import TableLoading from '../../components/TableLoading';
import EllipsisLine from '../../components/EllipsisLine';
import { convertToValueorFee, converToGasPrice, i18n } from '../../utils';
import CopyButton from '../../components/CopyButton';
import QrcodeButton from '../../components/QrcodeButton';
import * as commonCss from '../../globalStyles/common';
import media from '../../globalStyles/media';

const { RangePicker } = DatePicker;

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  .ctrlpanel-wrap {
    box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px 1px;
    ${media.pad`
      margin-top: -1px;
      box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px 1px;
    `}
  }
`;

const StyledTabel = styled.div`
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
  .ui.fluid.card {
    box-shadow: none;
    border: 1px solid rgba(0, 0, 0, 0.08);
  }
`;

const HeadBar = styled.div`
  margin-top: 24px;
  width: 100%;
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 24px;
  .sep {
    display: none;
  }
  .sep + div {
    margin-left: 10px;
  }
  ${media.pad`
    padding-left: 16px;
    .sep{display: block;}
    .sep + div {
      margin-left: 0;
    }
    p {
      padding-top: 5px;
      padding-bottom: 5px;
    }
  `}
  * {
    display: inline-block;
    margin: 0;
  }
  h1 {
    color: #000;
    font-size: 20px;
    font-weight: 700;
    margin-right: 24px;
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

const fullWidthMobile = media.pad`
  width: auto;
  margin-left: 0px;
  margin-right: 24px;
  padding-top: 16px;
  padding-bottom: 24px;
  border-left: 0;
`;

const Statistic = styled.div`
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  width: 100%;
  height: 100px;
  display: flex;
  ${media.pad`
    display: block;
    height: auto;
    margin-left: 16px;
    margin-right: 16px;
    width: auto;
  `}
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 34px;
  ${commonCss.lightBorder}
  border-radius: 4px;

  .transaction {
    width: 22%;
    ${fullWidthMobile}
    ${media.pad`border-bottom: 1px solid rgba(0, 0, 0, 0.08);`}
  }
  .miner,
  .balance {
    width: 20%;
    border-left: 1px solid rgba(0, 0, 0, 0.08);
    ${fullWidthMobile}
    ${media.pad`border-bottom: 1px solid rgba(0, 0, 0, 0.08);`}
  }
  .balance {
    width: 24%;
    .wrap svg {
      opacity: 1;
    }
  }

  .seen {
    width: 36%;
    border-left: 1px solid rgba(0, 0, 0, 0.08);
    ${fullWidthMobile}
  }
  .wrap {
    /* height: 68px; */
    width: 100%;
    display: flex;
    align-items: flex-start;
    * {
      font-size: 16px;
    }
    svg {
      width: 32px;
      height: 32px;
      opacity: 0.38;
      margin: 0 16px;
      margin-top: 5px;
    }
    h2 {
      margin-bottom: 7px;
    }
  }
  .sectionWrap {
    width: 100%;
    display: flex;
    ${media.pad`display: block;`}
    section {
      flex: 1;
      p {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.87);
      }
      &:nth-child(2) {
        ${media.pad`padding-top: 24px;`}
      }
    }
  }
`;

const TabZone = styled.div`
  position: relative;
  width: 100%;
  ${media.pad`
    margin-left: 16px;
    margin-right: 16px;
    width: auto;
  `}
  button {
    outline: none;
    border: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }
  .ui.attached.tabular.menu {
    border-bottom: none;
  }
  .ui.tabular.menu .active.item {
    ${commonCss.lightBorder}
    background:rgba(255,255,255,1);
  }
`;

const PCell = styled.div`
  margin: 0 !important;
`;

const TabWrapper = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  .page-pc {
    display: inline-flex !important;
  }
  .page-h5 {
    ${commonCss.hide}
  }
  ${media.pad`
    justify-content: center;
    .page-pc { ${commonCss.hide} }
    .page-h5 { display: inline-flex!important; }
  `}
`;

const CtrlPanel = styled.div`
  position: absolute;
  right: 0;
  top: 0px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  ${media.pad`
    display: block;
    position: relative;
    width: auto;
    padding-top: 20px;
    padding-left: 16px;
    background: #fff;
    z-inde: 10;
  `}
  .screentime {
    ${media.pad`display: block; margin-bottom: 8px; margin-right: 0;`}
    font-size: 16px;
    margin-right: 5px;
  }
  .date-picker {
    ${media.pad`width: 250px!important; display: inline-block;`}
  }
  .drop-btn {
    svg {
      transform: rotate(90deg);
    }
    ${media.pad`
      position: absolute;
      right: 10px;
      top: 18px;
    `}
  }
`;

const TabPanel = styled.div`
  &.ui.bottom.attached.segment.tab {
    border: 0;
    margin-left: 0px;
    margin-right: 0px;
    box-shadow: none;
    ${media.pad`
      width: auto;
    `}
  }
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
    dataIndex: 'position',
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
    className: 'two wide aligned plain_th',
    dataIndex: 'transactionCount',
    title: i18n('Tx Count'),
    render: (text) => <PCell>{text}</PCell>,
  },
];

class Detail extends Component {
  constructor() {
    super();
    this.state = {
      accountid: '',
      currentTab: 1,
      isLoading: false,
      accountDetail: {},
      minedBlockList: [],
      TxList: [],
      TxTotalCount: 100,
      queries: {
        pageNum: 1,
        pageSize: 10,
        txnType: 'all',
      },
      minedTotalCount: 0,
      curMinedPage: 1,
    };
  }

  componentDidMount() {
    const { queries } = this.state;
    const {
      match: { params },
    } = this.props;
    this.fetchAccountDetail(params.accountid, queries);
  }

  async fetchAccountDetail(accountid, queries) {
    const { history } = this.props;
    this.setState({ isLoading: true, accountid });
    const { code, result } = (await superagent.get(`/proxy/fetchAccountDetail/${accountid}`).query(queries)).body;
    if (!code) {
      this.setState(
        {
          accountDetail: result.find((item) => Object.keys(item)[0] === `account/${accountid}`)[`account/${accountid}`],
          // TxList: result.find((item) => Object.keys(item)[0] === `account/${accountid}/transactionList`)[
          //   `account/${accountid}/transactionList`
          // ],
          TxList: get(
            result.find((item) => Object.keys(item)[0] === `account/${accountid}/transactionList`),
            `account/${accountid}/transactionList`,
            []
          ),
          TxTotalCount: get(
            result.find((item) => Object.keys(item)[0] === `account/${accountid}/transactionList`),
            `total_account/${accountid}/transactionList`,
            []
          ),
          minedTotalCount:
            get(result.find((item) => Object.keys(item)[0] === `account/${accountid}`), [`account/${accountid}`, 'minedBlocks']) || 0,
        },
        () => {
          this.setState({ isLoading: false, queries });
        }
      );
    } else if (code === 1) {
      history.push(`/search-notfound?searchId=${accountid}`);
    }
    return {};
  }

  async fetchMinedBlockList(accountid, curMinedPage) {
    this.setState({ isLoading: true });
    const { code, result } = (await superagent.get(`/proxy/fetchMinedBlockList/${accountid}?pageNum=${curMinedPage}&pageSize=5`)).body;
    if (!code) {
      this.setState(
        {
          minedBlockList: result.find((item) => Object.keys(item)[0] === `account/${accountid}/minedBlockList`)[
            `account/${accountid}/minedBlockList`
          ],
        },
        () => {
          this.setState({
            isLoading: false,
            curMinedPage,
          });
        }
      );
    }
    this.setState({ isLoading: false });
    return {};
  }

  render() {
    const {
      accountDetail,
      queries,
      currentTab,
      isLoading,
      minedBlockList,
      TxList,
      TxTotalCount,
      accountid,
      minedTotalCount,
      curMinedPage,
    } = this.state;
    const {
      intl,
      match: { params },
    } = this.props;
    if (accountid !== params.accountid) {
      this.fetchAccountDetail(params.accountid, queries);
    }
    const columns = [
      {
        key: 1,
        dataIndex: 'hash',
        className: 'two wide aligned',
        title: i18n('Hash'),
        render: (text, row) => <EllipsisLine linkTo={`/transactionsdetail/${text}`} text={text} />,
      },
      {
        key: 2,
        dataIndex: 'from',
        className: 'two wide aligned',
        title: i18n('From'),
        render: (text, row) => (
          <div>
            <PCell>
              {text !== params.accountid ? (
                <EllipsisLine textInout="In" linkTo={`/accountdetail/${text}`} text={text} />
              ) : (
                <EllipsisLine text={text} />
              )}
            </PCell>
          </div>
        ),
      },
      {
        key: 3,
        className: 'two wide aligned',
        dataIndex: 'to',
        title: i18n('To'),
        render: (text) => (
          <div>
            <PCell>
              {text !== params.accountid ? (
                <EllipsisLine textInout="Out" linkTo={`/accountdetail/${text}`} text={text} />
              ) : (
                <EllipsisLine text={text} />
              )}
            </PCell>
          </div>
        ),
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
        dataIndex: 'drei',
        title: i18n('Fee'),
        render: (text, row) => <EllipsisLine unit="CFX" text={convertToValueorFee(row.value * row.gasPrice)} />,
      },
      {
        key: 6,
        className: 'two wide aligned',
        dataIndex: 'gasPrice',
        title: i18n('Gas Price'),
        render: (text) => <EllipsisLine unit="Gdip" text={converToGasPrice(text)} />,
      },
      {
        key: 7,
        className: 'three wide aligned',
        dataIndex: 'timestamp',
        title: i18n('Age'),
        render: (text) => <Countdown timestamp={text * 1000} />,
      },
    ];

    return (
      <div className="page-address-detail">
        <Wrapper>
          <HeadBar>
            <h1>{i18n('Account')}</h1>
            <p>{params.accountid}</p>
            <br className="sep" />
            <CopyButton txtToCopy={params.accountid} toolTipId="Copy address to clipboard" />
            <QrcodeButton titleTxt={params.accountid} qrTxt={params.accountid} tooltipId="Click to view QR Code" />
          </HeadBar>
          {isLoading && <TableLoading />}
          <Statistic>
            <div className="transaction">
              <div className="wrap">
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#iconshiliangzhinengduixiang" />
                </svg>
                <div>
                  <h2>{i18n('app.pages.account.detail.transactions')}</h2>
                  <p>
                    <span>{accountDetail.transactions}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="miner">
              <div className="wrap">
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#iconwakuang" />
                </svg>
                <div>
                  <h2>{i18n('Mined Blocks')}</h2>
                  <p>{accountDetail.minedBlocks}</p>
                </div>
              </div>
            </div>
            <div className="balance">
              <div className="wrap">
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#iconEquilibrium-type" className="iconEquilibrium" />
                </svg>
                <div>
                  <h2>{i18n('Balance')}</h2>
                  {convertToValueorFee(accountDetail.balance)}
                  <span style={{ marginLeft: 5 }}>CFX</span>
                  {/* <EllipsisLine unit="CFX" text={} /> */}
                </div>
              </div>
            </div>
            <div className="seen">
              <div className="wrap">
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#iconliulan" />
                </svg>
                <div className="sectionWrap">
                  <section>
                    <h2>{i18n('First Seen')}</h2>
                    <p>{moment(accountDetail.firstSeen * 1000).format('YYYY-MM-DD HH:mm:ss')}</p>
                  </section>
                  <section>
                    <h2>{i18n('Last Seen')}</h2>
                    <p>{moment(accountDetail.lastSeen * 1000).format('YYYY-MM-DD HH:mm:ss')}</p>
                  </section>
                </div>
              </div>
            </div>
          </Statistic>
          <TabZone>
            <div className="ui attached tabular menu">
              <button
                type="button"
                className={currentTab === 1 ? 'active item' : 'item'}
                onKeyUp={() => {}}
                onClick={() => this.setState({ currentTab: 1 })}
              >
                {i18n('app.pages.account.detail.transactions')}
              </button>
              <button
                type="button"
                className={currentTab === 2 ? 'active item' : 'item'}
                onKeyUp={() => {}}
                onClick={() => {
                  this.setState({ currentTab: 2 });
                  this.fetchMinedBlockList(params.accountid, curMinedPage);
                }}
              >
                {i18n('Mined Blocks')}
              </button>
            </div>
            <div className="ctrlpanel-wrap">
              <CtrlPanel
                style={{
                  display: currentTab === 1 ? 'flex' : 'none',
                }}
              >
                <RangePicker
                  className="date-picker"
                  showTime={{ format: 'HH:00' }}
                  format="YYYY-MM-DD HH:00"
                  placeholder={[
                    intl.formatMessage({
                      id: 'StartTime',
                    }),
                    intl.formatMessage({
                      id: 'EndTime',
                    }),
                  ]}
                  onChange={(value) => {
                    if (!value.length) {
                      delete queries.startTime;
                      delete queries.endTime;
                      this.fetchAccountDetail(params.accountid, queries);
                    }
                  }}
                  onOk={(value) => {
                    if (value.length) {
                      const startTime = value[0].unix();
                      const endTime = value[1].unix();
                      this.fetchAccountDetail(params.accountid, { ...queries, startTime, endTime, pageNum: 1 });
                    }
                  }}
                />
                <Dropdown
                  className="drop-btn"
                  direction="left"
                  icon={
                    <IconFace style={{ borderRadius: '4px' }}>
                      <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#iconmore1" />
                      </svg>
                    </IconFace>
                  }
                >
                  <Dropdown.Menu>
                    <Dropdown.Item
                      text={i18n('app.pages.account.detail.viewAll')}
                      value="all"
                      onClick={(e, data) => {
                        e.preventDefault();
                        this.fetchAccountDetail(params.accountid, { ...queries, txnType: data.value, pageNum: 1 });
                      }}
                    />
                    <Dropdown.Item
                      text={i18n('app.pages.account.detail.viewOutGoing')}
                      value="outgoing"
                      onClick={(e, data) => {
                        e.preventDefault();
                        this.fetchAccountDetail(params.accountid, { ...queries, txnType: data.value, pageNum: 1 });
                      }}
                    />
                    <Dropdown.Item
                      text={i18n('app.pages.account.detail.viewIncoming')}
                      value="incoming"
                      onClick={(e, data) => {
                        e.preventDefault();
                        this.fetchAccountDetail(params.accountid, { ...queries, txnType: data.value, pageNum: 1 });
                      }}
                    />
                  </Dropdown.Menu>
                </Dropdown>
              </CtrlPanel>
              <TabPanel className={currentTab === 1 ? 'ui bottom attached segment active tab' : 'ui bottom attached segment tab'}>
                <StyledTabel>
                  <div className="ui fluid card">
                    <div className="content">
                      <DataList showHeader columns={columns} dataSource={TxList} />
                    </div>
                  </div>
                </StyledTabel>
                <TabWrapper>
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
                        this.fetchAccountDetail(params.accountid, { ...queries, pageNum: data.activePage });
                      }}
                      activePage={queries.pageNum}
                      totalPages={Math.floor(TxTotalCount / 10) + 1}
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
                      activePage={queries.pageNum}
                      onPageChange={(e, data) => {
                        e.preventDefault();
                        this.fetchAccountDetail(params.accountid, { ...queries, pageNum: data.activePage });
                      }}
                      ellipsisItem={null}
                      firstItem={null}
                      lastItem={null}
                      siblingRange={1}
                      totalPages={Math.floor(TxTotalCount / 10) + 1}
                    />
                  </div>
                </TabWrapper>
              </TabPanel>
              <TabPanel className={currentTab === 2 ? 'ui bottom attached segment active tab' : 'ui bottom attached segment tab'}>
                <StyledTabel>
                  <div className="ui fluid card">
                    <div className="content">
                      <DataList showHeader columns={minedColumns} dataSource={minedBlockList} />
                    </div>
                  </div>
                </StyledTabel>

                <MinedWrap>
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
                        this.fetchMinedBlockList(params.accountid, data.activePage);
                      }}
                      activePage={curMinedPage}
                      totalPages={Math.floor(minedTotalCount / 5) + 1}
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
                      activePage={curMinedPage}
                      onPageChange={(e, data) => {
                        e.preventDefault();
                        this.fetchMinedBlockList(params.accountid, data.activePage);
                      }}
                      ellipsisItem={null}
                      firstItem={null}
                      lastItem={null}
                      siblingRange={1}
                      totalPages={Math.floor(minedTotalCount / 5) + 1}
                    />
                  </div>
                </MinedWrap>
              </TabPanel>
            </div>
          </TabZone>
        </Wrapper>
      </div>
    );
  }
}
Detail.propTypes = {
  match: PropTypes.objectOf(PropTypes.string),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
Detail.defaultProps = {
  match: {},
};
const hoc = compose(
  injectIntl,
  withRouter
);
export default hoc(Detail);
