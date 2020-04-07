import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { Dropdown, Popup } from 'semantic-ui-react';
import { DatePicker } from 'antd';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import DataList from '../../components/DataList';
import EllipsisLine from '../../components/EllipsisLine';
import Countdown from '../../components/Countdown';
import { convertToValueorFee, converToGasPrice, i18n, renderAny } from '../../utils';
import { StyledTabel, TabPanel, PCell, TabWrapper } from './styles';
import Pagination from '../../components/Pagination';
import iconStatusErr from '../../assets/images/icons/status-err.svg';
import iconStatusSkip from '../../assets/images/icons/status-skip.svg';
import { reqAccountTransactionList } from '../../utils/api';
import media from '../../globalStyles/media';

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

const ContractCell = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;
  font-weight: normal;
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
    z-index: 10;
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

const { RangePicker } = DatePicker;

class Transitions extends Component {
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
    };
  }

  componentDidMount() {
    const { accountid } = this.props;
    const { queries } = this.state;

    this.changePage(accountid, {
      page: 1,
      pageSize: 10,
      txType: 'all',
    });
  }

  componentDidUpdate(prevProps) {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.props.accountid !== prevProps.accountid) {
      // eslint-disable-next-line react/destructuring-assignment
      this.changePage(this.props.accountid, {
        page: 1,
        pageSize: 10,
        txType: 'all',
      });
    }
  }

  changePage(accountid, queries) {
    reqAccountTransactionList({
      address: accountid,
      ...queries,
    }).then((body) => {
      this.setState({
        TxList: body.result.list,
        TxTotalCount: body.result.total,
        queries,
      });
      document.dispatchEvent(new Event('scroll-to-top'));
    });
  }

  render() {
    const { accountid, isActive, intl } = this.props;
    const { TxList, TxTotalCount, queries } = this.state;

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
              {text !== accountid ? (
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
                {text !== accountid ? (
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
            onChange={(value) => {
              if (!value.length) {
                delete queries.startTime;
                delete queries.endTime;
                this.changePage(accountid, queries);
              }
            }}
            onOk={(value) => {
              if (value.length) {
                const startTime = value[0].unix();
                const endTime = value[1].unix();
                this.changePage(accountid, { ...queries, startTime, endTime, page: 1 });
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
                      this.changePage(accountid, { ...queries, page: data.activePage });
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
      </Fragment>
    );
  }
}

Transitions.propTypes = {
  accountid: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

Transitions.defaultProps = {};

export default injectIntl(Transitions);
