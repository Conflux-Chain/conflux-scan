import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { Pagination, Dropdown, Popup } from 'semantic-ui-react';
import compose from 'lodash/fp/compose';
import * as styledComp from './styledComp';
import media from '../../globalStyles/media';
import EllipsisLine from '../../components/EllipsisLine';
import DataList from '../../components/DataList';
import Countdown from '../../components/Countdown';
import { convertToValueorFee, converToGasPrice, i18n, sendRequest, renderAny } from '../../utils';
import iconCloseSmall from '../../assets/images/icons/close-small.svg';
import iconCloseMd from '../../assets/images/icons/close-md.svg';

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
  `}
  }

  .summary-line {
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;
    > h6 {
      width: 120px;
      margin: 0;
      font-size: 16px;
      line-height: 16px;
      color: #8f8f8f;
      font-weight: normal;
    }
  }
  .summary-line-content {
  }
  .link-open {
    margin-left: 3px;
    font-size: 14px;
  }
`;

const TransfersDiv = styled.div`
  display: flex;
  margin-top: 16px;
   >  .ui.card {
      width: 100%;
    }
   .transfer-search {
      display: flex;
      align-items: center;
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
     &:hover {
      border: 1px solid rgb(204, 204, 204);
     }
    input {
      min-width: 200px;
      outline: none;
      font-size: 16px;
      color: #8F8F8F;
      height: 28px;
      line-height: 28px;
      border: none;
      text-indent: 5px;
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
   .transfer-search-tag {
    background: #F2F2F2;
    padding-left: 10px;
    padding-right: 5px;
    align-items: center;
    height: 28px;
    margin-right: 16px;
    display: flex;

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
`;

const FilteredDiv = styled.div`
  margin-top: 16px;
  .ui.card {
    width: 100%;
    display: flex;
  }
  .filter-item-wrap {
    display: flex;
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
  }
`;

class FansCoin extends Component {
  constructor(...args) {
    super(...args);
    const source = {
      code: 0,
      message: '',
      result: {
        data: [
          {
            firstMinedByBlock: '0x50e20e42ec09475bd950a08fa9715f8eb25fe117762ae2965972204e3485770e',
            timestamp: 1572941825,
            transactionIndex: 0,
            data: '0x',
            status: '0x0',
            from: '0xa70ddf9b9750c575db453eea6a041f4c8536785a',
            blockHash: '0x50e20e42ec09475bd950a08fa9715f8eb25fe117762ae2965972204e3485770e',
            s: '0x2db14aa7214fbf8468095cb8d5102e68289081bcd6c4b5f3e74998e8b03b68d4',
            v: 0,
            to: '0x63f0a574987f6893e068a08a3fb0e63aec3785e6',
            hash: '0x425b74f056ce53716aa8c091f5cf8781b52af32d2f0b18d18e7a2d2f1656bdeb',
            r: '0x27638073a2f4d25b92f3b941bcf98f2b634fa109af7154047d1338a535610582',
            value: '1000000000000000000',
            nonce: 991,
            gasPrice: '819',
            gas: 21000,
          },
          {
            firstMinedByBlock: '0x8f9f188561fe0cd3b223311c60ce305af5449f684c008806014f1b9d5778dbab',
            transactionIndex: 0,
            timestamp: 1572940660,
            data: '0x',
            from: '0xa70ddf9b9750c575db453eea6a041f4c8536785a',
            blockHash: '0x8f9f188561fe0cd3b223311c60ce305af5449f684c008806014f1b9d5778dbab',
            s: '0x2a510f05cbb2d840c223728acf957a63f04f187fc6d244148769c0448629762b',
            hash: '0xa92a2414a827491c02e1256c3fba529a63d0f5f7a3e4d1ea7fc4509f1774a233',
            r: '0xd050f4961b4e8b99a5bbd33b9faf83146a2f160b7d84745b20ccfa48bb5eec77',
            v: 1,
            to: '0xc9b18e67d28d98366c6e7dd9e37dd41d7c69681a',
            value: '1000000000000000000',
            nonce: 990,
            gasPrice: '819',
            gas: 21000,
          },
        ],
        total: 996,
      },
    };

    this.state = {
      fcTransList: source.result.data,
    };
  }

  render() {
    const { fcTransList } = this.state;

    return (
      <styledComp.Wrapper>
        <styledComp.HeadBar>
          <h1>{i18n('FC')}</h1>
          <p>
            <a>
              Fans Coin
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
                  <h6>Total Supply:</h6>
                  <div className="summary-line-content">qweqwe</div>
                </div>
                <div className="summary-line">
                  <h6>Holders:</h6>
                  <div className="summary-line-content">20,000 addresses</div>
                </div>
                <div className="summary-line">
                  <h6>Transfers:</h6>
                  <div className="summary-line-content">2,345</div>
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
                  <h6>Contract:</h6>
                  <div className="summary-line-content">
                    <a>0x3dc938eklds923kwdu0923s23</a>
                  </div>
                </div>
                <div className="summary-line">
                  <h6>Official Site:</h6>
                  <div className="summary-line-content">
                    <a>
                      conflux-chian.org <i className="link-open" />
                    </a>
                  </div>
                </div>
                <div className="summary-line">
                  <h6>Social Profiles::</h6>
                  <div className="summary-line-content" />
                </div>
              </div>
            </div>
          </div>
        </SummaryDiv>

        <FilteredDiv>
          <div className="ui card">
            <div className="filter-item-wrap">
              <div className="filter-item">
                <h5>
                  <i className="icon-filter" />
                  <span>Filtered by Token Holder</span>
                </h5>

                <div className="filter-item-2">
                  <a>0xa92a2414a827491c02e1256c3fba529a63d0f5f7a3e4d1ea7fc4509f1774a233</a>
                  {/* <EllipsisLine ellipsisStyle={{ maxWidth: '100%' }} text={'0xa92a2414a827491c02e1256c3fba529a63d0f5f7a3e4d1ea7fc4509f1774a233'} linkTo={`/transactionsdetail/`} /> */}
                </div>
              </div>

              <div className="filter-item">
                <div className="filter-item-3">BALANCE</div>
                <div className="filter-item-4">2131.2100 FC</div>
              </div>
            </div>
          </div>
        </FilteredDiv>

        <TransfersDiv>
          <div className="ui card">
            <div className="content">
              <div className="header">
                <div className="transfer-search">
                  <h6>{i18n('Transfers')}</h6>

                  <div className="transfer-search-tag">
                    <Popup
                      trigger={<div className="transfer-search-tag-inner">0xa70ddf9b9750c575db453eea6a041f4c8536785a</div>}
                      content="0xa70ddf9b9750c575db453eea6a041f4c8536785a"
                      position="top center"
                      hoverable
                    />
                    <div className="icon-close" />
                  </div>
                  <div className="transfer-search-input">
                    <input type="text" placeholder="Txn Hash/Holder Address" />
                    <i className="search-icon" />
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
                    render: (text, row) => (
                      <EllipsisLine ellipsisStyle={{ maxWidth: 152 }} linkTo={`/transactionsdetail/${text}`} text={text} />
                    ),
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
                      <div>
                        <styledComp.PCell>
                          <EllipsisLine ellipsisStyle={{ maxWidth: 152 }} text={text} linkTo={`/transactionsdetail/${text}`} />
                        </styledComp.PCell>
                      </div>
                    ),
                  },
                  {
                    key: 4,
                    dataIndex: 'to',
                    className: 'three wide aligned',
                    title: i18n('To'),
                    render: (text, row) => (
                      <div>
                        <EllipsisLine ellipsisStyle={{ maxWidth: 152 }} text={text} linkTo={`/transactionsdetail/${text}`} />
                      </div>
                    ),
                  },
                  {
                    key: 5,
                    className: 'one wide aligned plain_th',
                    dataIndex: 'gasLimit',
                    title: i18n('Quantity'),
                    render: (text) => <styledComp.PCell>aaa</styledComp.PCell>,
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
                    // this.changePage(params.accountid, { ...queries, pageNum: data.activePage });
                  }}
                  activePage={1}
                  totalPages={100}
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
                  activePage={1}
                  onPageChange={(e, data) => {
                    e.preventDefault();
                  }}
                  ellipsisItem={null}
                  firstItem={null}
                  lastItem={null}
                  siblingRange={1}
                  totalPages={10}
                />
              </div>
            </styledComp.TabWrapper>
          );
        })}
      </styledComp.Wrapper>
    );
  }
}

const hoc = compose(withRouter);
export default hoc(FansCoin);
