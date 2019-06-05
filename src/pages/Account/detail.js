import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import superagent from 'superagent';
import moment from 'moment';
import { Pagination, Dropdown } from 'semantic-ui-react';
import { DatePicker } from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import get from 'lodash/get';
import DataList from '../../components/DataList';
import Countdown from '../../components/Countdown';
import TableLoading from '../../components/TableLoading';
import EllipsisLine from '../../components/EllipsisLine';
import '../../assets/semantic-ui/semantic.css';
import { convertToValueorFee, converToGasPrice } from '../../utils';
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
`;

const HeadBar = styled.div`
  margin-top: 24px;
  width: 100%;
  font-size: 16px;
  font-family: ProximaNova-Regular;
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
    font-family: ProximaNova-Bold;
    font-weight: bold;
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
  padding-top: 24px;
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
    width: 28%;
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

const TabZoneWrapper = styled.div`
  box-shadow: 0 1px 3px 0;
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
    ${media.pad`
      position: absolute;
      right: 10px;
      top: 18px;
      svg {
        transform: rotate(90deg);
      }
    `}
  }
`;

const TabPanel = styled.div`
  &.ui.bottom.attached.segment.tab {
    border: 0;
    margin-left: 0px;
    margin-right: 0px;
    ${media.pad`
      box-shadow: none;
      width: auto;
    `}
  }
`;

const columns = [
  {
    key: 1,
    dataIndex: 'ein',
    title: 'Hash',
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
    title: 'From',
    render: (text, row) => (
      <div>
        <PCell>
          <EllipsisLine isPivot text={row.zwei} />
        </PCell>
      </div>
    ),
  },
  {
    key: 3,
    dataIndex: 'drei',
    title: 'To',
    render: (text, row) => (
      <div>
        <PCell>{row.drei}</PCell>
      </div>
    ),
  },
  {
    key: 4,
    className: 'two wide aligned',
    dataIndex: 'drei',
    title: 'Value',
    render: (text) => <div className="ui label">{text}</div>,
  },
  {
    key: 5,
    className: 'two wide aligned',
    dataIndex: 'drei',
    title: 'Fee',
    render: (text) => <div className="ui label">{text}</div>,
  },
  {
    key: 6,
    className: 'two wide aligned',
    dataIndex: 'drei',
    title: 'Gas Price',
    render: (text) => <div className="ui label">{text}</div>,
  },
  {
    key: 7,
    className: 'two wide aligned',
    dataIndex: 'drei',
    title: 'Age',
    render: (text) => <div className="ui label">{text}</div>,
  },
];

const minedColumns = [
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
      </div>
    ),
  },
  {
    key: 3,
    dataIndex: 'drei',
    title: 'Blocks',
    render: (text, row) => (
      <div>
        <PCell>{row.drei}</PCell>
      </div>
    ),
  },
  {
    key: 4,
    className: 'two wide aligned',
    dataIndex: 'drei',
    title: 'Blocks',
    render: (text) => <div className="ui label">{text}</div>,
  },
];

const dataSource = [
  { key: 1, ein: '80580', zwei: '0xe969a6fc05897123123', drei: 'Alichs' },
  { key: 2, ein: '80581', zwei: '0xe969a6fc05897124124', drei: 'Schwarz' },
];

class Detail extends Component {
  constructor() {
    super();
    this.state = {
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
    this.setState({ isLoading: true });
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
            `total_block/${accountid}/transactionList`,
            []
          ),
        },
        () => this.setState({ isLoading: false, queries })
      );
    }
    return {};
  }

  async fetchMinedBlockList(accountid) {
    const { code, result } = (await superagent.get(`/proxy/fetchMinedBlockList/${accountid}?pageNum=1&pageSize=20`)).body;
    if (!code) {
      this.setState(
        {
          minedBlockList: result.find((item) => Object.keys(item)[0] === `account/${accountid}/minedBlockList`)[
            `account/${accountid}/minedBlockList`
          ],
        },
        () => this.setState({ isLoading: false })
      );
    }
    return {};
  }

  render() {
    const { accountDetail, queries, currentTab, isLoading, minedBlockList, TxList, TxTotalCount } = this.state;
    const {
      intl,
      match: { params },
    } = this.props;
    console.log(TxList, '===== TxList');
    return (
      <div className="page-address-detail">
        <Wrapper>
          <HeadBar>
            <h1>
              <FormattedMessage id="app.pages.account.detail.h1" />
            </h1>
            <p>{params.accountid}</p>
            <br className="sep" />
            <CopyButton txtToCopy={params.accountid} toolTipId="app.pages.account.detail.tooltip" />
            <QrcodeButton titleTxt={params.accountid} qrTxt={params.accountid} tooltipId="app.pages.account.detail.qr" />
          </HeadBar>
          {isLoading && <TableLoading />}
          <Statistic>
            <div className="transaction">
              <div className="wrap">
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#iconshiliangzhinengduixiang" />
                </svg>
                <div>
                  <h2>
                    <FormattedMessage id="app.pages.account.detail.transactions" />
                  </h2>
                  <p>
                    <FormattedMessage id="app.pages.account.detail.sent" />
                    <span>{accountDetail.sentTransactions} & </span>
                    <FormattedMessage id="app.pages.account.detail.received" />
                    <span>{accountDetail.receivedTransactions}</span>
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
                  <h2>
                    <FormattedMessage id="app.pages.account.detail.minedBlocks" />
                  </h2>
                  <p>{accountDetail.minedBlocks} block</p>
                </div>
              </div>
            </div>
            <div className="balance">
              <div className="wrap">
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#iconEquilibrium-type" />
                </svg>
                <div>
                  <h2>
                    <FormattedMessage id="app.pages.account.detail.balance" />
                  </h2>
                  <EllipsisLine unit="CFX" text={convertToValueorFee(accountDetail.balance)} />
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
                    <h2>
                      <FormattedMessage id="app.pages.account.detail.firstSeen" />
                    </h2>
                    <p>{moment(accountDetail.firstSeen * 1000).format('YYYY-MM-DD HH:mm:ss')}</p>
                  </section>
                  <section>
                    <h2>
                      <FormattedMessage id="app.pages.account.detail.lastSeen" />
                    </h2>
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
                <FormattedMessage id="app.pages.account.detail.firstSeen" />
              </button>
              <button
                type="button"
                className={currentTab === 2 ? 'active item' : 'item'}
                onKeyUp={() => {}}
                onClick={() => {
                  this.setState({ currentTab: 2 });
                  this.fetchMinedBlockList(params.accountid);
                }}
              >
                <FormattedMessage id="app.pages.account.detail.lastSeen" />
              </button>
            </div>
            <div className="ctrlpanel-wrap">
              <CtrlPanel>
                <RangePicker
                  className="date-picker"
                  showTime={{ format: 'HH:00' }}
                  format="YYYY-MM-DD HH:00"
                  placeholder={[
                    intl.formatMessage({
                      id: 'app.pages.account.detail.startTime',
                    }),
                    intl.formatMessage({
                      id: 'app.pages.account.detail.endTime',
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
                      this.fetchAccountDetail(params.accountid, { ...queries, startTime, endTime });
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
                      text={<FormattedMessage id="app.pages.account.detail.viewAll" />}
                      value="all"
                      onClick={(e, data) => {
                        e.preventDefault();
                        this.fetchAccountDetail(params.accountid, { ...queries, txnType: data.value });
                      }}
                    />
                    <Dropdown.Item
                      text={<FormattedMessage id="app.pages.account.detail.viewOutGoing" />}
                      value="outgoing"
                      onClick={(e, data) => {
                        e.preventDefault();
                        this.fetchAccountDetail(params.accountid, { ...queries, txnType: data.value });
                      }}
                    />
                    <Dropdown.Item
                      text={<FormattedMessage id="app.pages.account.detail.viewIncoming" />}
                      value="incoming"
                      onClick={(e, data) => {
                        e.preventDefault();
                        this.fetchAccountDetail(params.accountid, { ...queries, txnType: data.value });
                      }}
                    />
                  </Dropdown.Menu>
                </Dropdown>
              </CtrlPanel>
              <TabPanel className={currentTab === 1 ? 'ui bottom attached segment active tab' : 'ui bottom attached segment tab'}>
                <StyledTabel>
                  <div className="ui fluid card">
                    <div className="content">
                      <DataList showHeader columns={columns} dataSource={dataSource} />
                    </div>
                  </div>
                </StyledTabel>
                <TabWrapper>
                  <div className="page-pc">
                    <Pagination
                      prevItem={{
                        'aria-label': 'Previous item',
                        content: <FormattedMessage id="app.pages.account.detail.lastPage" />,
                      }}
                      nextItem={{
                        'aria-label': 'Next item',
                        content: <FormattedMessage id="app.pages.account.detail.nextPage" />,
                      }}
                      defaultActivePage={5}
                    />
                  </div>
                  <div className="page-h5">
                    <Pagination
                      prevItem={{
                        'aria-label': 'Previous item',
                        content: <FormattedMessage id="app.pages.account.detail.lastPage" />,
                      }}
                      nextItem={{
                        'aria-label': 'Next item',
                        content: <FormattedMessage id="app.pages.account.detail.nextPage" />,
                      }}
                      boundaryRange={0}
                      activePage={2}
                      onPageChange={() => {}}
                      ellipsisItem={null}
                      firstItem={null}
                      lastItem={null}
                      siblingRange={1}
                      totalPages={10}
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
};
Detail.defaultProps = {
  match: {},
};
export default injectIntl(Detail);
