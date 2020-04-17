import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { Dropdown, Popup } from 'semantic-ui-react';
import { DatePicker } from 'antd';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import DataList from '../../components/DataList';
import EllipsisLine from '../../components/EllipsisLine';
import Countdown from '../../components/Countdown';
import { convertToValueorFee, converToGasPrice, i18n, renderAny, valToTokenVal } from '../../utils';
import { StyledTabel, TabPanel, PCell, TabWrapper, IconFace, CtrlPanel } from './styles';
import Pagination from '../../components/Pagination';
import { reqTokenTxnList, reqFcStat } from '../../utils/api';
import { TotalDesc, getTotalPage } from '../../components/TotalDesc';
import { UPDATE_COMMON } from '../../constants';

const NumCell = styled.div`
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
    &[href^='/'] {
      &:hover {
        color: #1e70bf;
      }
    }
  }
`;

const { RangePicker } = DatePicker;

/* eslint react/destructuring-assignment: 0 */
/* eslint react/no-did-update-set-state: 0 */

class TokenTxns extends Component {
  constructor(...args) {
    super(...args);

    this.getInitState = () => ({
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
    });
    this.state = this.getInitState();
  }

  componentDidUpdate(prevProps) {
    const { isActive } = this.props;
    const { activated } = this.state;
    if (isActive && !activated) {
      // first mount
      this.onMount();
      this.setState({
        activated: true,
      });
      return;
    }

    if (this.props.accountid !== prevProps.accountid) {
      this.setState(this.getInitState());
      if (this.props.isActive) {
        this.onMount();
        this.setState({
          activated: true,
        });
      }
    }
  }

  onMount() {
    const { accountid, fcStat, dispatch } = this.props;
    this.changePage(accountid, {
      page: 1,
      pageSize: 10,
      txType: 'all',
    });

    if (!fcStat.address) {
      reqFcStat().then((body) => {
        if (body.code === 0) {
          dispatch({
            type: UPDATE_COMMON,
            payload: {
              fcStat: body.result.data,
            },
          });
        }
      });
    }
  }

  changePage(accountid, queriesRaw) {
    const queries = { ...queriesRaw };
    if (!queries.startTime) {
      delete queries.startTime;
    }
    if (!queries.endTime) {
      delete queries.endTime;
    }
    reqTokenTxnList({
      address: accountid,
      ...queries,
    }).then((body) => {
      if (body.code === 0) {
        this.setState({
          TxList: body.result.list,
          TxTotalCount: body.result.total,
          listLimit: body.result.listLimit,
          queries,
        });
        document.dispatchEvent(new Event('scroll-to-top'));
      }
    });
  }

  render() {
    const { accountid, isActive, intl, tokenMap = {}, fcStat } = this.props;
    const { TxList, TxTotalCount, queries, listLimit, activated } = this.state;
    const { startTime, endTime } = this.state;

    if (!activated) {
      return null;
    }

    const columns = [
      {
        key: 1,
        dataIndex: 'transactionHash',
        className: 'two wide aligned',
        title: i18n('Hash'),
        render: (text, row) => {
          return <EllipsisLine popUpCfg={{ position: 'top left', pinned: true }} linkTo={`/transactionsdetail/${text}`} text={text} />;
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
              {text !== accountid ? (
                <EllipsisLine textInout="In" linkTo={`/address/${text}#tokentxns`} text={text} />
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
          return (
            <div>
              <PCell>
                {text !== accountid ? (
                  <EllipsisLine textInout="Out" linkTo={`/address/${text}#tokentxns`} text={text} />
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
        render: (text, row) => {
          return <NumCell>{valToTokenVal(text, row.token.decimals)}</NumCell>;
        },
      },
      {
        key: 5,
        className: 'three wide aligned',
        dataIndex: '',
        title: i18n('Token'),
        render: (text, row) => {
          const { name, symbol } = row.token;
          let tokenImg;
          if (tokenMap[row.address] && tokenMap[row.address].tokenIcon) {
            tokenImg = <img src={tokenMap[row.address].tokenIcon} />;
          }

          let tokenLink;
          const txt = `${name} (${symbol})`;
          if (fcStat.address === row.address) {
            tokenLink = <Link to="/fansCoin">{txt}</Link>;
          } else {
            tokenLink = <a>{txt}</a>;
          }
          return (
            <TokenLineDiv>
              {tokenImg}
              {tokenLink}
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
                  page: 1,
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
  tokenMap: PropTypes.objectOf(
    PropTypes.shape({
      tokenIcon: PropTypes.string,
    })
  ).isRequired,
  fcStat: PropTypes.objectOf({
    address: PropTypes.string,
  }).isRequired,
  dispatch: PropTypes.string.isRequired,
};

TokenTxns.defaultProps = {};

function mapStateToProps(state) {
  return {
    fcStat: state.common.fcStat,
  };
}

export default connect(mapStateToProps)(injectIntl(TokenTxns));
