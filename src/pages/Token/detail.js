import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';

import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Popup } from 'semantic-ui-react';
import compose from 'lodash/fp/compose';
import * as styledComp from './styledComp';
import EllipsisLine from '../../components/EllipsisLine';
import DataList from '../../components/DataList';
import Countdown from '../../components/Countdown';
import Pagination from '../../components/Pagination';
import { i18n, renderAny, humanizeNum, getQuery, dripTocfx, notice, tranferToLowerCase, devidedByDecimals } from '../../utils';

import TableLoading from '../../components/TableLoading';
import { reqContractListInfo, reqTokenQuery, reqTransferList, reqTotalSupply, reqBalanceOf } from '../../utils/api';

/* eslint jsx-a11y/click-events-have-key-events: 0 */
/* eslint jsx-a11y/no-static-element-interactions: 0 */
/* eslint react/destructuring-assignment: 0 */

const { SummaryDiv, TransfersDiv, TagWrapper, FilteredDiv } = styledComp;

let curPageBase = 1;
document.addEventListener('clean_state', () => {
  curPageBase = 1;
});
class TokenDetail extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      transferList: [],
      transferTotal: 0,
      tokenDetail: {
        accountCount: 0,
        transferCount: 0,
      },
      totalSupply: 0,
      addressData: {
        balance: '',
      },
      searchInput: '',
      listLoading: false,
      pageSize: 10,
      pageNum: curPageBase,
    };
  }

  componentDidMount() {
    const address = this.getAddress();
    this.reqTokenPromise = reqTokenQuery({
      address,
    }).then((body) => {
      if (body.code === 0) {
        this.setState({
          tokenDetail: body.result,
        });
      }
    });

    reqTotalSupply({
      address,
      params: [],
    }).then(async (result) => {
      await this.reqTokenPromise;
      const { tokenDetail } = this.state;
      if (tokenDetail.decimals) {
        this.setState({
          totalSupply: devidedByDecimals(result, tokenDetail.decimals),
        });
      } else {
        this.setState({
          totalSupply: result,
        });
      }
    });

    const { pageNum } = this.state;
    this.getFcList({
      pageNum,
    });

    reqContractListInfo([address]);
  }

  componentWillUnmount() {
    // eslint-disable-next-line: react/destructuring-assignment
    curPageBase = this.state.pageNum;
  }

  getAddress() {
    const {
      match: { params },
    } = this.props;
    const { address } = params;
    return tranferToLowerCase(address);
  }

  getFcList({ pageNum }, options) {
    const { pageSize, searchInput } = this.state;
    const query = getQuery(window.location.search);
    const { address } = query;
    this.setState({
      listLoading: true,
    });
    const filter = searchInput || address;
    const contractAddress = this.getAddress();

    const params = {
      page: pageNum,
      pageSize,
      contractAddress,
    };
    if (filter) {
      params.address = filter;
    }

    reqTransferList(params, options).then(
      (res) => {
        this.setState({
          listLoading: false,
        });
        if (res.code === 0) {
          this.setState({
            pageNum,
            transferList: res.result.list,
            transferTotal: res.result.total,
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
      reqBalanceOf({
        address: contractAddress,
        params: [address],
      }).then(async (result) => {
        await this.reqTokenPromise;
        const { tokenDetail } = this.state;
        this.setState({
          addressData: {
            balance: devidedByDecimals(result, tokenDetail.decimals),
          },
        });
      });
    }
  }

  render() {
    const { transferList, pageNum, pageSize, transferTotal, listLoading, addressData, searchInput } = this.state;
    const { tokenDetail, totalSupply } = this.state;
    const { history, intl, contractManagerCache } = this.props;
    const query = getQuery(window.location.search);
    const address = this.getAddress();
    const basePath = history.location.pathname;

    const resetSearch = () => {
      history.replace(basePath);
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
          {renderAny(() => {
            let tokenIcon;
            if (contractManagerCache[address] && contractManagerCache[address].tokenIcon) {
              tokenIcon = <img className="token-logo" src={contractManagerCache[address].tokenIcon} />;
            }

            let contractIcon;
            if (contractManagerCache[address] && contractManagerCache[address].website) {
              contractIcon = (
                <a href={contractManagerCache[address].website} target="_blank">
                  <i className="link-open" />
                </a>
              );
            }

            // if (contractManagerCache[address] && contractManagerCache[address].website) {
            //   content = (
            //     <a href={contractManagerCache[address].website} target="_blank">
            //       {content}
            //     </a>
            //   );
            // }

            let content = (
              <Fragment>
                {tokenIcon}
                <h1>{tokenDetail.symbol}</h1>
                <p>
                  {tokenDetail.name}
                  {contractIcon}
                </p>
              </Fragment>
            );

            return content;
          })}
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
                  <div className="summary-line-content">
                    {totalSupply} {tokenDetail.symbol}
                  </div>
                </div>
                <div className="summary-line">
                  <h6>{i18n('Holders')}:</h6>
                  <div className="summary-line-content">
                    {humanizeNum(tokenDetail.accountCount || 0)} &nbsp; {i18n('addresses')}
                  </div>
                </div>
                <div className="summary-line">
                  <h6>{i18n('Transfers')}:</h6>
                  <div className="summary-line-content">{humanizeNum(tokenDetail.transferCount || 0)}</div>
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
                  <div className="summary-line-content">
                    <Link to={`/address/${address}`}>{address}</Link>
                  </div>
                </div>
                <div className="summary-line">
                  <h6>{i18n('Decimals')}:</h6>
                  <div className="summary-line-content">{tokenDetail.decimals}</div>
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
                            history.replace(`${basePath}?address=${query.address}`);
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
                      <div className="filter-item-4">
                        {humanizeNum(addressData.balance)} {tokenDetail.symbol}
                      </div>
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
                          history.replace(`${basePath}?address=${searchInput}`);
                          this.setState({
                            searchInput: '',
                          });
                          this.getFcList({
                            pageNum: 1,
                          });
                        } else {
                          history.replace(basePath);
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
                    dataIndex: 'transactionHash',
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
                      return line;
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
                    render: (text, row) => {
                      const linkTo = text === query.address ? '' : `${basePath}?address=${text}`;
                      return (
                        <div style={{ marginRight: 10 }}>
                          <EllipsisLine
                            popUpCfg={{
                              pinned: true,
                            }}
                            ellipsisStyle={{ maxWidth: 152 }}
                            onClick={(e) => {
                              e.preventDefault();
                              history.replace(`${basePath}?address=${text}`);

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
                            linkTo={linkTo}
                          />
                        </div>
                      );
                    },
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
                      const linkTo = text === query.address ? '' : `${basePath}?address=${text}`;

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
                              history.replace(`${basePath}?address=${text}`);

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
                            linkTo={linkTo}
                          />
                        </TagWrapper>
                      );
                    },
                  },
                  {
                    key: 5,
                    className: 'two wide aligned plain_th',
                    dataIndex: 'value',
                    title: i18n('Value'),
                    render: (text, row) => {
                      let decimals;
                      if (row.token && row.token.decimals) {
                        decimals = row.token.decimals;
                      } else if (tokenDetail.decimals) {
                        decimals = tokenDetail.decimals;
                      }

                      let symbol;
                      if (row.token && row.token.symbol) {
                        symbol = row.token.symbol;
                      } else if (tokenDetail.symbol) {
                        symbol = tokenDetail.symbol;
                      }

                      if (decimals) {
                        return (
                          <styledComp.PCell>
                            {devidedByDecimals(text, decimals)} {symbol}
                          </styledComp.PCell>
                        );
                      }
                      return (
                        <styledComp.PCell>
                          {text} {symbol}
                        </styledComp.PCell>
                      );
                    },
                  },
                ];

                return <DataList showHeader columns={columns} dataSource={transferList} />;
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
                  totalPages={Math.ceil(transferTotal / pageSize)}
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
                  totalPages={Math.ceil(transferTotal / pageSize)}
                />
              </div>
            </styledComp.TabWrapper>
          );
        })}
      </styledComp.Wrapper>
    );
  }
}

TokenDetail.propTypes = {
  history: PropTypes.shape({
    replace: PropTypes.func,
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

function mapStateToProps(state) {
  return {
    contractManagerCache: state.common.contractManagerCache,
  };
}

const hoc = compose(
  withRouter,
  injectIntl,
  connect(mapStateToProps)
);

TokenDetail.propTypes = {
  match: PropTypes.objectOf(PropTypes.string).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }),
    replace: PropTypes.func,
  }).isRequired,
  contractManagerCache: PropTypes.objectOf(
    PropTypes.shape({
      tokenIcon: PropTypes.string,
      website: PropTypes.string,
    })
  ).isRequired,
  location: PropTypes.objectOf({
    hash: PropTypes.string,
  }).isRequired,
};

export default hoc(TokenDetail);
