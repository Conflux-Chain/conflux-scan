import React, { Component, Fragment } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { Dropdown, Popup } from 'semantic-ui-react';
import { DatePicker } from 'antd';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import DataList from '../../components/DataList';
import EllipsisLine from '../../components/EllipsisLine';
import Countdown from '../../components/Countdown';
import { IMG_PFX } from '../../constants';
import { convertToValueorFee, converToGasPrice, i18n, renderAny } from '../../utils';
import { StyledTabel, TabPanel, PCell, TabWrapper, IconFace, CtrlPanel } from './styles';
import Pagination from '../../components/Pagination';
import iconStatusErr from '../../assets/images/icons/status-err.svg';
import iconStatusSkip from '../../assets/images/icons/status-skip.svg';
import { reqTokenTxnList } from '../../utils/api';
import { TotalDesc, getTotalPage } from '../../components/TotalDesc';

const ContractCell = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;
  font-weight: normal;
`;

const TokenLineDiv = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 21px;
    height: 21px;
  }
  a {
    margin-left: 8px;
    font-size: 16px;
    font-weight: 400;
    color: rgba(66, 146, 250, 1);
    line-height: 19px;
  }
`;

const { RangePicker } = DatePicker;

/* eslint react/destructuring-assignment: 0 */

class TokenTxns extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      TxList: [],
      TxTotalCount: 0,
      queries: {
        page: 1,
        pageSize: 10,
        txType: 'all',
      },
      activated: false,
      listLimit: undefined,
      startTime: null,
      endTime: null,
    };
  }

  componentDidUpdate(prevProps) {
    const { isActive } = this.props;
    if (isActive) {
      const { activated } = this.state;
      if (!activated) {
        this.onMount();
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          activated: true,
        });
      }

      // eslint-disable-next-line react/destructuring-assignment
      if (this.props.accountid !== prevProps.accountid) {
        this.onMount();
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          startTime: null,
          endTime: null,
        });
      }
    }
  }

  onMount() {
    const { accountid } = this.props;
    this.changePage(accountid, {
      page: 1,
      pageSize: 10,
      txType: 'all',
    });
  }

  changePage(accountid, queriesRaw) {
    const queries = { ...queriesRaw };
    if (!queries.startTime) {
      delete queries.startTime;
    }
    if (!queries.endTime) {
      delete queries.endTime;
    }
    // todo api change
    reqTokenTxnList({
      address: accountid,
      ...queries,
    }).then((body) => {
      this.setState({
        TxList: body.result.list,
        TxTotalCount: body.result.total,
        listLimit: body.result.listLimit,
        queries,
      });
      document.dispatchEvent(new Event('scroll-to-top'));
    });
  }

  render() {
    const { accountid, isActive, intl } = this.props;
    const { TxList, TxTotalCount, queries, listLimit, activated } = this.state;
    const { startTime, endTime } = this.state;

    if (!activated) {
      return null;
    }

    const columns = [
      {
        key: 1,
        dataIndex: 'hash',
        className: 'two wide aligned',
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
              {text !== accountid ? <EllipsisLine textInout="In" linkTo={`/address/${text}`} text={text} /> : <EllipsisLine text={text} />}
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
                {text !== accountid ? (
                  <EllipsisLine textInout="Out" linkTo={`/address/${text}`} text={text} />
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
        className: 'three wide aligned',
        dataIndex: '', // todo modify
        title: i18n('Token'),
        render: (text, row) => {
          const { tokenName, tokenSymbol, tokenIcon } = row;
          return (
            <TokenLineDiv>
              <img src={IMG_PFX + tokenIcon} />
              <a>{`${tokenName} (${tokenSymbol})`}</a>
            </TokenLineDiv>
          );
        },
      },
      // {
      //   key: 6,
      //   className: 'two wide aligned',
      //   dataIndex: 'gasPrice',
      //   title: i18n('Gas Price'),
      //   render: (text) => <EllipsisLine unit="Gdrip" text={converToGasPrice(text)} />,
      // },
      {
        key: 6,
        className: 'three wide aligned',
        dataIndex: 'timestamp',
        title: i18n('Age'),
        render: (text) => <Countdown timestamp={text * 1000} />,
      },
    ];

    return (
      <Fragment>
        <CtrlPanel
          style={{
            display: isActive ? 'flex' : 'none',
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
            value={[startTime, endTime]}
            disabledDate={(currentDate) => {
              if (!currentDate) {
                return false;
              }
              const diff = moment()
                .endOf('day')
                .diff(currentDate.clone().endOf('day'));
              if (diff < 0) {
                return true;
              }
              return false;
            }}
            onChange={(value) => {
              if (!value.length) {
                this.setState({
                  startTime: null,
                  endTime: null,
                });
                this.changePage(accountid, {
                  ...queries,
                  startTime: null,
                  endTime: null,
                });
              } else {
                this.setState({
                  startTime: value[0].startOf('days'),
                  endTime: value[1].endOf('days'),
                });
              }
            }}
            onOk={(value) => {
              if (value.length) {
                const start = value[0];
                const end = value[1];
                this.tempDate1 = start;
                this.tempDate2 = end;
                this.changePage(accountid, {
                  ...queries,
                  page: 1,
                  startTime: start.unix(),
                  endTime: end.unix(),
                });
              }
            }}
            onOpenChange={(open) => {
              if (open) {
                this.tempDate1 = this.state.startTime;
                this.tempDate2 = this.state.endTime;
              } else {
                this.setState({
                  startTime: this.tempDate1,
                  endTime: this.tempDate2,
                });
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
                  this.changePage(accountid, { ...queries, txType: data.value, page: 1 });
                }}
              />
              <Dropdown.Item
                text={i18n('app.pages.account.detail.viewOutGoing')}
                value="outgoing"
                onClick={(e, data) => {
                  e.preventDefault();
                  this.changePage(accountid, { ...queries, txType: data.value, page: 1 });
                }}
              />
              <Dropdown.Item
                text={i18n('app.pages.account.detail.viewIncoming')}
                value="incoming"
                onClick={(e, data) => {
                  e.preventDefault();
                  this.changePage(accountid, { ...queries, txType: data.value, page: 1 });
                }}
              />
            </Dropdown.Menu>
          </Dropdown>
        </CtrlPanel>

        <TabPanel className={isActive ? 'ui bottom attached segment active tab' : 'ui bottom attached segment tab'}>
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
                  <TotalDesc total={TxTotalCount} listLimit={listLimit} />
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
                      this.changePage(accountid, { ...queries, page: data.activePage });
                    }}
                    activePage={queries.page}
                    totalPages={getTotalPage(TxTotalCount, 10, listLimit)}
                    ellipsisItem={null}
                  />
                </div>
                <div className="page-h5">
                  <TotalDesc total={TxTotalCount} listLimit={listLimit} />
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
                      this.changePage(accountid, { ...queries, page: data.activePage });
                    }}
                    ellipsisItem={null}
                    firstItem={null}
                    lastItem={null}
                    siblingRange={1}
                    totalPages={getTotalPage(TxTotalCount, 10, listLimit)}
                  />
                </div>
              </TabWrapper>
            );
          })}
        </TabPanel>
      </Fragment>
    );
  }
}

TokenTxns.propTypes = {
  accountid: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

TokenTxns.defaultProps = {};

export default injectIntl(TokenTxns);
