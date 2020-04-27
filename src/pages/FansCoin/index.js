import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { injectIntl } from 'react-intl';

import { Popup } from 'semantic-ui-react';
import compose from 'lodash/fp/compose';
import * as styledComp from './styledComp';
import media from '../../globalStyles/media';
import EllipsisLine from '../../components/EllipsisLine';
import DataList from '../../components/DataList';
import Countdown from '../../components/Countdown';
import Pagination from '../../components/Pagination';
import { i18n, renderAny, humanizeNum, getQuery, dripTocfx, notice } from '../../utils';
import iconCloseSmall from '../../assets/images/icons/close-small.svg';
import iconCloseMd from '../../assets/images/icons/close-md.svg';
import iconFcLogo from '../../assets/images/icons/fc-logo.svg';
import TableLoading from '../../components/TableLoading';
import iconStatusErr from '../../assets/images/icons/status-err.svg';
import iconStatusSkip from '../../assets/images/icons/status-skip.svg';

import { reqFcList, reqFcStat, reqFcByAddress } from '../../utils/api';
import wechatCode from '../../assets/images/wechat-code.jpg';

const SummaryDiv = styled.div`
  display: flex;
  ${media.pad`
    display: block;
  `}

  & > .card-wrapper {
    flex: 1;
    margin-right: 16px;
    margin-top: 0;
    &:last-child {
      margin-right: 0;
    }
    > .ui.card {
      width: 100%;
    }

    .summary-content {
      height: 140px;
    }
    ${media.pad`
      margin-bottom: 16px;
      margin-right: 0px;
      .summary-content {
        height: auto;
      }
    `}
  }

  .summary-line {
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;
    > h6 {
      ${media.pad`
      min-width: 80px;
      max-width: 120px;
    `}
      min-width: 120px;
      margin: 0;
      font-size: 16px;
      color: #8f8f8f;
      font-weight: normal;
      > span {
        vertical-align: middle;
      }
      & + div {
        word-break: break-word;
      }
    }
  }
  .summary-line-content {
    display: flex;
  }
  .link-open {
    margin-left: 3px;
    font-size: 14px;
  }
  .iconwrap {
    flex: 1;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f2f2f2;
    border-radius: 4px;
    margin-right: 10px;
    > .icon {
      margin: 0;
      padding: 0;
      color: #8f8f8f;
      font-size: 15px;
      height: 21px;
      line-height: 24px;
    }
  }
  .icon-link {
    color: rgb(143, 143, 143);
    line-height: 20px;
    text-align: center;
    width: 20px;
    height: 20px;
  }
`;

const TransfersDiv = styled.div`
  position: relative;
  display: flex;
  margin-top: 16px;
    > .ui.card {
      width: 100%;
    }
    .transfer-search {
      display: flex;
      align-items: center;
      ${media.pad`
        flex-wrap: wrap;
      `}
      h6 {
        flex: 1;
        margin: 0;
        font-size: 20px;
      }
    }
    .transfer-search-input {
      display: flex;
      align-items: center;
      border: 1px solid #fff;
      ${media.pad`
        flex: 1;
        display: flex;
        margin-top: 0px;
      `}

    &:hover {
      border: 1px solid rgb(204, 204, 204);
    }
    input {
      min-width: 200px;
      outline: none;
      font-size: 16px;
      height: 28px;
      line-height: 28px;
      border: none;
      text-indent: 5px;
      ${media.pad`
        flex: 1;
      `}
    }
    .search-icon {
      padding-left: 8px;
      padding-right: 8px;
      font-size: 16px;
      color: #8F8F8F;
      height: 26px;
      cursor: pointer;
    }
  }

  ${media.pad`
    .transfer-search-tag + .transfer-search-input {
      margin-top: 10px;
    }
  `}
  .transfer-search-tag {
    background: #F2F2F2;
    padding-left: 10px;
    padding-right: 5px;
    align-items: center;
    height: 28px;
    margin-right: 16px;
    display: flex;
    ${media.pad`
      margin-right: 0px;
    `}

    .icon-close {
      background-image: url("${iconCloseSmall}");
      background-repeat: no-repeat;
      width: 10px;
      height: 10px;
      margin-top: -2px;
      padding-right: 5px;
      box-sizing: content-box;
      cursor: pointer;
    }
    .transfer-search-tag-inner {
      margin-right: 5px;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 97px;
      font-size: 12px;
      height: 28px;
      line-height: 28px;
      color: #5C5C5C;
      overflow: hidden;
    }
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
      color: #8F8F8F;
    }
  }
`;

const TagWrapper = styled.div`
  display: flex;
  align-items: center;

  .tag-out {
    color: #e66a24;
    background: #ffebd4;
  }
  .tag-in {
    color: #4a9e81;
    background: #d0f5e7;
  }
  .tag {
    width: 40px;
    border-radius: 4px;
    font-size: 12px;
    line-height: 22px;
    text-align: center;
    margin-right: 12px;
    margin-left: -50px;
    &.tag-arrow {
      background: #f2f2f2;
      width: auto;
      box-sizing: border-box;
      padding-left: 5px;
      padding-right: 5px;
      > i {
        font-size: 12px;
        color: #59bf9c;
      }
    }
  }
`;

const FilteredDiv = styled.div`
  margin-top: 16px;
  .ui.card {
    width: 100%;
    display: flex;
  }
  .filter-item-wrap {
    display: flex;
    position: relative;
    ${media.pad`
      display: block;
    `}
  }
  .filter-item {
    flex: 1;
    padding: 20px;
  }
  h5 {
    display: flex;
    align-items: center;
    span {
      font-size: 16px;
      color: #292929;
      line-height: 23px;
    }
    margin-bottom: 12px;
  }
  .icon-filter {
    margin-right: 8px;
    height: 23px;
    vertical-align: middle;
  }
  .filter-item-3 {
    margin-top: 10px;
    font-size: 12px;
    line-height: 12px;
    color: #8f8f8f;
    margin-bottom: 8px;
  }
  .filter-item-4 {
    font-size: 16px;
    line-height: 16px;
    color: #292929;
    user-select: none;
  }
  .filter-item-2 {
    display: inline-block;
    word-break: break-word;
  }
  .close-btn {
    width: 32px;
    height: 32px;
    position: absolute;
    background-color: #F2F2F2;
    background-image: url("${iconCloseMd}");
    background-position: center;
    background-repeat: no-repeat;
    top: 28px;
    right: 20px;
    border-radius: 50%;
    cursor: pointer;
    ${media.pad`
      top: 12px;
    `}
  }
`;

/* eslint jsx-a11y/click-events-have-key-events: 0 */
/* eslint jsx-a11y/no-static-element-interactions: 0 */
/* eslint react/destructuring-assignment: 0 */

let curPageBase = 1;
document.addEventListener('clean_state', () => {
  curPageBase = 1;
});
class FansCoin extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      fcTransList: [],
      fcTransTotal: 0,
      fcStat: {
        totalSupply: 0,
        transactionCount: 0,
        accountTotal: 0,
      },
      addressData: {
        balance: '',
      },
      searchInput: '',
      listLoading: false,
      pageSize: 10,
      pageNum: curPageBase,
    };

    reqFcStat().then((body) => {
      if (body.code === 0) {
        this.setState({
          fcStat: body.result.data,
        });
      }
    });

    const { pageNum } = this.state;
    this.getFcList({
      pageNum,
    });
  }

  componentWillUnmount() {
    // eslint-disable-next-line: react/destructuring-assignment
    curPageBase = this.state.pageNum;
  }

  getFcList({ pageNum }, options) {
    const { pageSize, searchInput } = this.state;
    const query = getQuery(window.location.search);
    const { address } = query;
    this.setState({
      listLoading: true,
    });
    const filter = searchInput || address;
    reqFcList(
      {
        pageNum,
        pageSize,
        filter,
      },
      options
    ).then(
      (res) => {
        this.setState({
          listLoading: false,
        });
        if (res.code === 0) {
          this.setState({
            pageNum,
            fcTransList: res.result.data,
            fcTransTotal: res.result.total,
          });
        } else if (res.code === 1) {
          notice.show({
            type: 'message-error-light',
            content: i18n('Search paremeter incorrect'),
            timeout: 3000,
          });
        } else {
          notice.show({
            type: 'message-error-light',
            content: i18n('server error'),
            timeout: 3000,
          });
        }
      },
      () => {
        this.setState({
          listLoading: false,
        });
        notice.show({
          type: 'message-error-light',
          content: i18n('server error'),
          timeout: 3000,
        });
      }
    );

    if (address) {
      reqFcByAddress({
        address,
      }).then((res) => {
        if (res.code === 0) {
          this.setState({
            addressData: res.result.data,
          });
        }
      });
    }
  }

  render() {
    const { fcTransList, fcStat, pageNum, pageSize, fcTransTotal, listLoading, addressData, searchInput } = this.state;
    const { history, intl } = this.props;
    const query = getQuery(window.location.search);

    const resetSearch = () => {
      history.replace('/fansCoin');
      this.setState({
        searchInput: '',
      });
      this.getFcList({
        pageNum: 1,
      });
    };

    return (
      <styledComp.Wrapper>
        <styledComp.HeadBar>
          <img className="fc-logo" src={iconFcLogo} />
          <h1>{i18n('FC')}</h1>
          <p>
            <a href="https://wallet.confluxscan.io/about" target="_blank">
              FansCoin
              <i className="link-open" />
            </a>
          </p>
        </styledComp.HeadBar>

        <SummaryDiv>
          <div className="card-wrapper">
            <div className="ui card">
              <div className="content">
                <div className="header">{i18n('Overview')}</div>
              </div>
              <div className="content summary-content">
                <div className="summary-line">
                  <h6>{i18n('Total Supply')}:</h6>
                  <div className="summary-line-content">{dripTocfx(fcStat.totalSupply)} FC</div>
                </div>
                <div className="summary-line">
                  <h6>{i18n('Holders')}:</h6>
                  <div className="summary-line-content">{humanizeNum(fcStat.accountTotal)} addresses</div>
                </div>
                <div className="summary-line">
                  <h6>{i18n('Transfers')}:</h6>
                  <div className="summary-line-content">{humanizeNum(fcStat.transactionCount)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card-wrapper">
            <div className="ui card">
              <div className="content">
                <div className="header">{i18n('Profile Summary')}</div>
              </div>
              <div className="content summary-content">
                <div className="summary-line">
                  <h6 style={{ userSelect: 'none' }}>{i18n('Contract')}:</h6>
                  <div className="summary-line-content">{fcStat.address}</div>
                </div>
                <div className="summary-line">
                  <h6>{i18n('Official Site')}:</h6>
                  <div className="summary-line-content">
                    <a href="https://www.conflux-chain.org" target="_blank">
                      conflux-chain.org <i className="link-open" />
                    </a>
                  </div>
                </div>
                <div className="summary-line">
                  <h6>{i18n('Social Profiles')}:</h6>
                  <div className="summary-line-content">
                    {/* <a className="iconwrap" >
                      <i className="facebook f icon"></i>
                    </a> */}
                    <a className="iconwrap" href="https://twitter.com/ConfluxChain" target="_blank">
                      <i className="twitter icon" />
                    </a>
                    <a className="iconwrap" href="https://github.com/conflux-chain" target="_blank">
                      <i className="icon-github icon-link" />
                    </a>
                    <a className="iconwrap" href="https://www.reddit.com/user/ConfluxChain" target="_blank">
                      <i className="icon-reddit icon-link" />
                    </a>
                    <a className="iconwrap" href="https://medium.com/@Confluxchain" target="_blank">
                      <i className="icon-medium icon-link" />
                    </a>
                    <a className="iconwrap" href="https://t.me/Conflux_English" target="_blank">
                      <i className="icon-telegram icon-link" />
                    </a>
                    <a className="iconwrap" href="https://weibo.com/confluxchain" target="_blank">
                      <i className="icon-sina icon-link" />
                    </a>
                    <Popup
                      trigger={
                        <a className="iconwrap">
                          <i className="icon-wechat icon-link" />
                        </a>
                      }
                      content={
                        <div>
                          <img width="100" src={wechatCode} />
                        </div>
                      }
                      position="top left"
                      hoverable
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SummaryDiv>

        {renderAny(() => {
          if (query.address) {
            return (
              <FilteredDiv>
                <div className="ui card">
                  <div className="filter-item-wrap">
                    <div className="filter-item">
                      <h5>
                        <i className="icon-filter" />
                        <span>{i18n('Filtered by Token Holder')}</span>
                      </h5>

                      <div className="filter-item-2">
                        <a
                          onClick={() => {
                            history.replace(`/fansCoin?address=${query.address}`);
                            this.setState({
                              searchInput: '',
                            });
                            this.getFcList({
                              pageNum: 1,
                            });
                          }}
                        >
                          {query.address}
                        </a>
                      </div>
                    </div>

                    <div className="filter-item">
                      <div className="filter-item-3">{i18n('BALANCE')}</div>
                      <div className="filter-item-4">{humanizeNum(dripTocfx(addressData.balance))} FC</div>
                    </div>
                    <div className="close-btn" onClick={resetSearch} />
                  </div>
                </div>
              </FilteredDiv>
            );
          }
          return null;
        })}

        <TransfersDiv>
          {listLoading && <TableLoading />}
          <div className="ui card">
            <div className="content">
              <div className="header">
                <div className="transfer-search">
                  <h6>{i18n('Transfers')}</h6>
                  {renderAny(() => {
                    if (query.address) {
                      return (
                        <div className="transfer-search-tag">
                          <Popup
                            trigger={<div className="transfer-search-tag-inner">{query.address}</div>}
                            content={query.address}
                            position="top center"
                            hoverable
                          />
                          <div className="icon-close" onClick={resetSearch} />
                        </div>
                      );
                    }
                    return null;
                  })}
                  <div className="transfer-search-input">
                    {renderAny(() => {
                      const doSearch = () => {
                        if (searchInput.length === 42) {
                          history.replace(`/fansCoin?address=${searchInput}`);
                          this.setState({
                            searchInput: '',
                          });
                          this.getFcList({
                            pageNum: 1,
                          });
                        } else {
                          history.replace(`/fansCoin`);
                          this.getFcList(
                            {
                              pageNum: 1,
                            },
                            {
                              showError: false,
                            }
                          );
                        }
                      };
                      return (
                        <Fragment>
                          <input
                            type="text"
                            placeholder={intl.formatMessage({
                              id: 'Txn Hash/Holder Address',
                            })}
                            onChange={(e) => {
                              this.setState({
                                searchInput: e.target.value,
                              });
                            }}
                            value={searchInput}
                            onKeyPress={(e) => {
                              if (e.which === 13) {
                                doSearch();
                                e.stopPropagation();
                                e.preventDefault();
                                e.target.blur();
                              }
                            }}
                          />
                          <i
                            className="search-icon"
                            onClick={() => {
                              doSearch();
                            }}
                          />
                        </Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="content">
              {renderAny(() => {
                const columns = [
                  {
                    key: 1,
                    dataIndex: 'hash',
                    className: 'three wide aligned',
                    title: i18n('Txn Hash'),
                    render: (text, row) => {
                      const line = (
                        <EllipsisLine
                          popUpCfg={{ position: 'top left', pinned: true }}
                          linkTo={`/transactionsdetail/${text}`}
                          text={text}
                        />
                      );
                      if (row.status === 0) {
                        return line;
                      }
                      let errIcon;
                      if (row.status === 1) {
                        errIcon = (
                          <Popup
                            trigger={<img src={iconStatusErr} />}
                            content={i18n('app.pages.err-reason.1')}
                            position="top left"
                            hoverable
                          />
                        );
                      } else if (row.status === 2 || row.status === null) {
                        errIcon = (
                          <Popup
                            trigger={<img src={iconStatusSkip} />}
                            content={i18n('app.pages.err-reason.2')}
                            position="top left"
                            hoverable
                          />
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
                    dataIndex: 'timestamp',
                    title: i18n('Age'),
                    render: (text) => <Countdown timestamp={text * 1000} />,
                  },
                  {
                    key: 3,
                    dataIndex: 'from',
                    className: 'three wide aligned',
                    title: i18n('From'),
                    render: (text, row) => (
                      <div style={{ marginRight: 10 }}>
                        <EllipsisLine
                          popUpCfg={{
                            pinned: true,
                          }}
                          ellipsisStyle={{ maxWidth: 152 }}
                          onClick={(e) => {
                            e.preventDefault();
                            history.replace(`/fansCoin?address=${text}`);

                            setTimeout(() => {
                              this.getFcList({
                                pageNum: 1,
                              });
                              this.setState({
                                searchInput: '',
                              });
                            }, 10);
                          }}
                          text={text}
                          linkTo={`/fansCoin?address=${text}`}
                        />
                      </div>
                    ),
                  },
                  {
                    key: 4,
                    dataIndex: 'to',
                    className: 'three wide aligned',
                    title: i18n('To'),
                    render: (text, row) => {
                      let arrowDiv;
                      if (!query.address) {
                        arrowDiv = (
                          <span className="tag tag-arrow">
                            <i className="arrow-right" />
                          </span>
                        );
                      } else if (query.address === row.from) {
                        arrowDiv = <span className="tag-out tag">OUT</span>;
                      } else if (query.address === row.to) {
                        arrowDiv = <span className="tag-in tag">IN</span>;
                      }

                      return (
                        <TagWrapper>
                          {/* <span className="tag-out tag">OUT</span> */}
                          {arrowDiv}
                          <EllipsisLine
                            popUpCfg={{
                              pinned: true,
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              history.replace(`/fansCoin?address=${text}`);

                              setTimeout(() => {
                                this.getFcList({
                                  pageNum: 1,
                                });
                                this.setState({
                                  searchInput: '',
                                });
                              }, 10);
                            }}
                            ellipsisStyle={{ maxWidth: 152 }}
                            text={text}
                            linkTo={`/fansCoin?address=${text}`}
                          />
                        </TagWrapper>
                      );
                    },
                  },
                  {
                    key: 5,
                    className: 'one wide aligned plain_th',
                    dataIndex: 'value',
                    title: i18n('Value'),
                    render: (text) => <styledComp.PCell>{dripTocfx(text)} FC</styledComp.PCell>,
                  },
                ];

                return <DataList showHeader columns={columns} dataSource={fcTransList} />;
              })}
            </div>
          </div>
        </TransfersDiv>

        {renderAny(() => {
          return (
            <styledComp.TabWrapper>
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
                    this.getFcList({
                      pageNum: data.activePage,
                    });
                  }}
                  activePage={pageNum}
                  totalPages={Math.ceil(fcTransTotal / pageSize)}
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
                  activePage={pageNum}
                  onPageChange={(e, data) => {
                    e.preventDefault();
                    this.getFcList({
                      pageNum: data.activePage,
                    });
                  }}
                  ellipsisItem={null}
                  firstItem={null}
                  lastItem={null}
                  siblingRange={1}
                  totalPages={Math.ceil(fcTransTotal / pageSize)}
                />
              </div>
            </styledComp.TabWrapper>
          );
        })}
      </styledComp.Wrapper>
    );
  }
}

FansCoin.propTypes = {
  history: PropTypes.shape({
    replace: PropTypes.func,
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

const hoc = compose(
  withRouter,
  injectIntl
);
export default hoc(FansCoin);
