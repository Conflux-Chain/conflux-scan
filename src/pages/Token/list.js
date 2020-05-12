import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Popup } from 'semantic-ui-react';
import Pagination from '../../components/Pagination';
import DataList from '../../components/DataList';
import TableLoading from '../../components/TableLoading';
import EllipsisLine from '../../components/EllipsisLine';
import { i18n, devidedByDecimals } from '../../utils';
import media from '../../globalStyles/media';
import * as commonCss from '../../globalStyles/common';
import { reqContractMangerList, reqTotalSupply, reqTokenQuery } from '../../utils/api';
import { TotalDesc } from '../../components/TotalDesc';
import tokenIcon from '../../assets/images/icons/tokenIcon.png';

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const TabWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

const StyledTabel = styled.div`
  width: 100%;
  ${media.mobile`
    width: 95%;
    margin: 0 auto;
  `}

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
  ${commonCss.paginatorMixin}
`;

const HeadBar = styled.div`
  width: 100%;
  font-size: 16px;
  ${media.mobile`
    width: 95%;
    margin: 0 auto;
    margin-bottom: 24px;
  `}
  margin-bottom: 24px;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  * {
    display: inline-block;
    margin: 0;
  }
  h1 {
    color: #000;
    font-size: 20px;
    line-height: 24px;
    margin-right: 24px;
  }
  > img {
    margin-top: -2px;
    margin-right: 17px;
    width: 24px;
    height: 24px;
  }
`;

const CellTxt = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;
  font-weight: normal;
  > img {
    max-width: 24px;
    max-height: 24px;
    margin-right: 5px;
  }
`;

/* eslint react/destructuring-assignment: 0 */
let curPageBase = 1;
document.addEventListener('clean_state', () => {
  curPageBase = 1;
});

const pageSize = 10;
/* eslint react/no-access-state-in-setstate: 0 */
class List extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      tokenList: [],
      TotalCount: 0,
      curPage: curPageBase,
      tokenMaps: {},
      totalSupplyMaps: {},
    };
  }

  componentDidMount() {
    const { curPage } = this.state;
    this.fetchTxList({ activePage: curPage });
  }

  componentWillUnmount() {
    curPageBase = this.state.curPage;
  }

  fetchTxList({ activePage }) {
    this.setState({ isLoading: true });

    reqContractMangerList({
      page: activePage,
      pageSize,
      fields: ['tokenIcon', 'tokenName', 'tokenSymbol', 'icon'],
    }).then((body) => {
      if (body.code === 0) {
        this.setState({
          tokenList: body.result.list,
          TotalCount: body.result.total,
          curPage: activePage,
        });
        document.dispatchEvent(new Event('scroll-to-top'));
      }

      body.result.list.forEach(async (v) => {
        const tokenResult = await reqTokenQuery({ address: v.address }, { showError: false });
        if (tokenResult.code === 0) {
          this.setState({
            tokenMaps: {
              ...this.state.tokenMaps,
              [v.address]: tokenResult.result,
            },
          });
          const totalSupply = await reqTotalSupply({ address: v.address });
          this.setState({
            totalSupplyMaps: {
              ...this.state.totalSupplyMaps,
              [v.address]: devidedByDecimals(totalSupply, tokenResult.result.decimals),
            },
          });
        }
      });

      this.setState({ isLoading: false });
    });
  }

  render() {
    const { tokenList, TotalCount, isLoading, curPage, totalSupplyMaps, tokenMaps } = this.state;
    const columns = [
      {
        key: 1,
        className: 'one wide aligned',
        dataIndex: '',
        title: i18n('#'),
        render: (text, row, index) => {
          return <CellTxt>{(curPage - 1) * pageSize + index + 1}</CellTxt>;
        },
      },
      {
        key: 2,
        className: 'two wide aligned',
        dataIndex: 'name',
        title: i18n('Token'),
        render: (text, row) => {
          return (
            <CellTxt>
              {row.tokenIcon && <img src={row.tokenIcon} />}
              <Link to={`/token/${row.address}`}>{text}</Link>
            </CellTxt>
          );
        },
      },
      {
        key: 3,
        className: 'two wide aligned',
        dataIndex: '',
        title: i18n('Transfer'),
        render: (text, row) => {
          if (tokenMaps[row.address]) {
            return <span>{tokenMaps[row.address].transferCount}</span>;
          }
          return null;
          // if (row.contractCreated) {
          //   return (
          //     <div>
          //       <Popup
          //         trigger={<ContractCell>{i18n('Contract Creation')}</ContractCell>}
          //         content={row.contractCreated}
          //         position="top left"
          //         hoverable
          //       />
          //     </div>
          //   );
          // }
          // return <EllipsisLine linkTo={`/address/${text}`} text={text} />;
        },
      },
      {
        key: 4,
        className: 'two wide aligned',
        dataIndex: 'totalSupply',
        title: i18n('Total Supply'),
        render: (text, row) => {
          if (tokenMaps[row.address] && totalSupplyMaps[row.address]) {
            return (
              <span>
                {totalSupplyMaps[row.address]}&nbsp;{tokenMaps[row.address].symbol}
              </span>
            );
          }
          return null;
        },
      },
      {
        key: 5,
        className: 'two wide aligned',
        dataIndex: 'accountCount',
        title: i18n('Holders'),
        render: (text, row) => {
          if (tokenMaps[row.address]) {
            return <span>{tokenMaps[row.address].accountCount}</span>;
          }
          return null;
        },
      },
      {
        key: 6,
        className: 'two wide aligned',
        dataIndex: 'address',
        title: i18n('Contract'),
        render: (text) => <EllipsisLine linkTo={`/address/${text}`} text={text} />,
      },
    ];

    return (
      <Wrapper>
        <HeadBar>
          {/* <IconFace>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#iconjinrijiaoyiliang" />
            </svg>
          </IconFace> */}
          <img src={tokenIcon} />
          <h1>{i18n('Token')}</h1>
        </HeadBar>
        <TabWrapper>
          <StyledTabel>
            <div className="ui fluid card">
              <div className="content">
                {isLoading && <TableLoading />}
                <DataList isMobile showHeader columns={columns} dataSource={tokenList} />
              </div>
            </div>
            <div className="page-pc">
              <TotalDesc total={TotalCount} />
              <Pagination
                style={{ float: 'right' }}
                ellipsisItem={null}
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
                  this.fetchTxList(data);
                }}
                activePage={curPage}
                totalPages={Math.ceil(TotalCount / pageSize)}
              />
            </div>
            <div className="page-h5">
              <TotalDesc total={TotalCount} />
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
                activePage={curPage}
                onPageChange={(e, data) => {
                  e.preventDefault();
                  this.fetchTxList(data);
                }}
                ellipsisItem={null}
                firstItem={null}
                lastItem={null}
                siblingRange={1}
                totalPages={Math.ceil(TotalCount / pageSize)}
              />
            </div>
          </StyledTabel>
        </TabWrapper>
      </Wrapper>
    );
  }
}
export default List;
