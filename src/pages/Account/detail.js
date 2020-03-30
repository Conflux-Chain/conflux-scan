import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import superagent from 'superagent';
import moment from 'moment';
import { Dropdown, Popup } from 'semantic-ui-react';
import { DatePicker } from 'antd';
import BigNumber from 'bignumber.js';
import { injectIntl } from 'react-intl';
import get from 'lodash/get';
import compose from 'lodash/fp/compose';
import DataList from '../../components/DataList';
import Countdown from '../../components/Countdown';
import TableLoading from '../../components/TableLoading';
import EllipsisLine from '../../components/EllipsisLine';
import { convertToValueorFee, converToGasPrice, i18n, sendRequest, renderAny } from '../../utils';
import CopyButton from '../../components/CopyButton';
import QrcodeButton from '../../components/QrcodeButton';
import * as commonCss from '../../globalStyles/common';
import media from '../../globalStyles/media';
import iconStatusErr from '../../assets/images/icons/status-err.svg';
import iconStatusSkip from '../../assets/images/icons/status-skip.svg';
import Pagination from '../../components/Pagination';
import { reqAccount, reqAccountTransactionList, reqMinedBlockList } from '../../utils/api';
import { errorCodes } from '../../constants';

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
      word-break: break-all;
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

  &.iconmore1 {
    svg {
      color: #000;
    }
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.12);
  }
  &.iconmore1:hover {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.05);
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
  .miner {
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
    border-left: 1px solid rgba(0, 0, 0, 0.08);
    ${fullWidthMobile}
    ${media.pad`border-bottom: 1px solid rgba(0, 0, 0, 0.08);`}
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
    position: relative;
    width: auto;
    padding-top: 20px;
    padding-left: 16px;
    background: #fff;
    z-inde: 10;
    align-items: flex-end;
    justify-content: flex-end;
    padding-right: 10px;
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

const ContractCell = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;
  font-weight: normal;
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
  constructor(...args) {
    super(...args);
    const {
      match: { params },
    } = this.props;
    this.state = {
      accountid: params.accountid,
      currentTab: 1,
      isLoading: false,
      accountDetail: {},
      minedBlockList: [],
      TxList: [],
      TxTotalCount: 100,
      queries: {
        page: 1,
        pageSize: 10,
        txType: 'all',
      },
      minedTotalCount: 0,
      curMinedPage: 1,
      showMaintaining: false,
    };
  }

  componentDidMount() {
    const { queries } = this.state;
    const {
      match: { params },
    } = this.props;
    this.fetchAccountDetail(params.accountid, queries);
  }

  componentDidUpdate(prevProps) {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.props.match.params.accountid !== prevProps.match.params.accountid) {
      // eslint-disable-next-line react/destructuring-assignment
      this.fetchAccountDetail(this.props.match.params.accountid, {
        page: 1,
        pageSize: 10,
        txType: 'all',
      });
    }
  }

  fetchAccountDetail(accountid, queries) {
    const { history } = this.props;
    this.setState({ isLoading: true, accountid });

    reqAccount({ address: accountid }).then((body) => {
      if (body.code === 0) {
        this.setState({
          accountDetail: body.result,
          minedTotalCount: body.result.blockCount,
          isLoading: false,
        });
      } else if (body.code === errorCodes.ParameterError) {
        history.push(`/search-notfound?searchId=${accountid}`);
      } else {
        this.setState({
          showMaintaining: true,
          isLoading: false,
        });
      }
    });

    reqAccountTransactionList({
      address: accountid,
      page: queries.page,
      pageSize: queries.pageSize,
      txType: queries.txType,
    }).then((body) => {
      this.setState({
        TxList: body.result.list,
        TxTotalCount: body.result.total,
        queries,
      });
    });
  }

  changePage(accountid, queries) {
    this.setState({ isLoading: true });
    reqAccountTransactionList({
      address: accountid,
      ...queries,
    }).then((body) => {
      this.setState({
        TxList: body.result.list,
        TxTotalCount: body.result.total,
        queries,
      });
      this.setState({ isLoading: false });
      document.dispatchEvent(new Event('scroll-to-top'));
    });
  }

  fetchMinedBlockList(accountid, curMinedPage) {
    this.setState({ isLoading: true });

    reqMinedBlockList({
      miner: accountid,
      page: curMinedPage,
      pageSize: 10,
    }).then((body) => {
      if (body.code === 0) {
        const { total } = body.result;
        this.setState({
          minedBlockList: body.result.list,
          isLoading: false,
          curMinedPage,
          minedTotalCount: total,
        });

        const { accountDetail } = this.state;
        if (total !== accountDetail.blockCount) {
          reqAccount({ address: accountid }).then((body1) => {
            if (body1.code === 0) {
              this.setState({
                accountDetail: body1.result,
              });
            }
          });
        }
      }
    });
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
      showMaintaining,
    } = this.state;
    const {
      intl,
      match: { params },
    } = this.props;

    const columns = [
      {
        key: 1,
        dataIndex: 'hash',
        className: 'two wide aligned',
        title: i18n('Hash'),
        render: (text, row) => {
          const line = <EllipsisLine linkTo={`/transactionsdetail/${text}`} text={text} />;
          if (row.status === 0) {
            return line;
          }
          let errIcon;
          if (row.status === 1) {
            errIcon = (
              <Popup trigger={<img src={iconStatusErr} />} content={i18n('app.pages.err-reason.1')} position="top left" hoverable />
            );
          } else if (row.status === 2 || row.status === null) {
            errIcon = (
              <Popup trigger={<img src={iconStatusSkip} />} content={i18n('app.pages.err-reason.2')} position="top left" hoverable />
            );
          }

          return (
            <div className="txnhash-err">
              {errIcon}
              <div className="txnhash-err-line1">
                {line}
                {/* <div className="txnhash-err-line2">{errtxt}</div> */}
              </div>
            </div>
          );
        },
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
        render: (text, row) => {
          if (row.contractCreated) {
            return (
              <div>
                <ContractCell>{i18n('Contract Creation')}</ContractCell>
              </div>
            );
          }
          return (
            <div>
              <PCell>
                {text !== params.accountid ? (
                  <EllipsisLine textInout="Out" linkTo={`/accountdetail/${text}`} text={text} />
                ) : (
                  <EllipsisLine text={text} />
                )}
              </PCell>
            </div>
          );
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
        dataIndex: 'drei',
        title: i18n('Fee'),
        render: (text, row) => {
          const result = new BigNumber(row.gas).multipliedBy(row.gasPrice);
          return <EllipsisLine unit="CFX" text={convertToValueorFee(result.toFixed())} />;
        },
      },
      {
        key: 6,
        className: 'two wide aligned',
        dataIndex: 'gasPrice',
        title: i18n('Gas Price'),
        render: (text) => <EllipsisLine unit="Gdrip" text={converToGasPrice(text)} />,
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
        {showMaintaining && (
          <div className="message message-important-light">
            <span>{intl.formatMessage({ id: 'system maintaining, please visit later' })}</span>
          </div>
        )}
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
                    <span>{accountDetail.transactionCount}</span>
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
                  <p>{accountDetail.blockCount}</p>
                </div>
              </div>
            </div>
            <div className="balance">
              <div className="wrap">
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#iconEquilibrium-type" />
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
                    {renderAny(() => {
                      if (!accountDetail.firstTime) {
                        return i18n('No Record');
                      }
                      return <p>{moment(accountDetail.firstTime * 1000).format('YYYY-MM-DD HH:mm:ss')}</p>;
                    })}
                  </section>
                  <section>
                    <h2>{i18n('Last Seen')}</h2>
                    {renderAny(() => {
                      if (!accountDetail.lastTime) {
                        return i18n('No Record');
                      }
                      return <p>{moment(accountDetail.lastTime * 1000).format('YYYY-MM-DD HH:mm:ss')}</p>;
                    })}
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
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
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
                      this.changePage(params.accountid, queries);
                    }
                  }}
                  onOk={(value) => {
                    if (value.length) {
                      const startTime = value[0].unix();
                      const endTime = value[1].unix();
                      this.changePage(params.accountid, { ...queries, startTime, endTime, page: 1 });
                    }
                  }}
                />
                <Dropdown
                  className="drop-btn"
                  direction="left"
                  icon={
                    <IconFace className="iconmore1" style={{ borderRadius: '4px' }}>
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
                        this.changePage(params.accountid, { ...queries, txType: data.value, page: 1 });
                      }}
                    />
                    <Dropdown.Item
                      text={i18n('app.pages.account.detail.viewOutGoing')}
                      value="outgoing"
                      onClick={(e, data) => {
                        e.preventDefault();
                        this.changePage(params.accountid, { ...queries, txType: data.value, page: 1 });
                      }}
                    />
                    <Dropdown.Item
                      text={i18n('app.pages.account.detail.viewIncoming')}
                      value="incoming"
                      onClick={(e, data) => {
                        e.preventDefault();
                        this.changePage(params.accountid, { ...queries, txType: data.value, page: 1 });
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
                {renderAny(() => {
                  if (!TxTotalCount) {
                    return null;
                  }
                  return (
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
                            this.changePage(params.accountid, { ...queries, page: data.activePage });
                          }}
                          activePage={queries.page}
                          totalPages={Math.ceil(TxTotalCount / 10)}
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
                          activePage={queries.page}
                          onPageChange={(e, data) => {
                            e.preventDefault();
                            this.changePage(params.accountid, { ...queries, page: data.activePage });
                          }}
                          ellipsisItem={null}
                          firstItem={null}
                          lastItem={null}
                          siblingRange={1}
                          totalPages={Math.ceil(TxTotalCount / 10)}
                        />
                      </div>
                    </TabWrapper>
                  );
                })}
              </TabPanel>
              <TabPanel className={currentTab === 2 ? 'ui bottom attached segment active tab' : 'ui bottom attached segment tab'}>
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
                          totalPages={Math.ceil(minedTotalCount / 10)}
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
                          activePage={curMinedPage}
                          onPageChange={(e, data) => {
                            e.preventDefault();
                            this.fetchMinedBlockList(params.accountid, data.activePage);
                          }}
                          ellipsisItem={null}
                          firstItem={null}
                          lastItem={null}
                          siblingRange={1}
                          totalPages={Math.ceil(minedTotalCount / 10)}
                        />
                      </div>
                    </MinedWrap>
                  );
                })}
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
