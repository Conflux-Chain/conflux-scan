import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import sortBy from 'lodash/sortBy';
import { Popup } from 'semantic-ui-react';
import Pagination from '../../components/Pagination';
import DataList from '../../components/DataList';
import TableLoading from '../../components/TableLoading';
import EllipsisLine from '../../components/EllipsisLine';
import { i18n, devidedByDecimals } from '../../utils';
import { defaultTokenIcon } from '../../constants';
import media from '../../globalStyles/media';
import * as commonCss from '../../globalStyles/common';
import { reqContractMangerList, reqTokenQuery } from '../../utils/api';
import TotalDesc from '../../components/TotalDesc';
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
  .ellipse-11 {
    display: inline-block;
    vertical-align: middle;
    max-width: 94px;
    text-overflow: hidden;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ellipse-14 {
    display: inline-block;
    vertical-align: middle;
    max-width: 130px;
    text-overflow: hidden;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  > img {
    max-width: 24px;
    max-height: 24px;
    margin-right: 5px;
  }
`;
const CellTxtBold = styled(CellTxt)`
  font-weight: bold;
`;

/* eslint react/destructuring-assignment: 0 */
let curPageBase = 1;
document.addEventListener('clean_state', () => {
  curPageBase = 1;
});

const pageSize = 500;
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
      fields: ['token', 'tokenIcon', 'tokenName', 'tokenSymbol', 'icon'].join(','),
    }).then(async (body) => {
      if (body.code === 0) {
        const tokenList = body.result.list.filter((v) => {
          if (v.token && v.token.name) {
            // token found
            return true;
          }
          return false;
        });
        this.setState({
          tokenList,
          TotalCount: body.result.total,
          curPage: activePage,
        });
        document.dispatchEvent(new Event('scroll-to-top'));

        const mapPromise = tokenList.map(async (v) => {
          const tokenResult = await reqTokenQuery({ address: v.address }, { showError: false });
          if (tokenResult.code === 0) {
            this.setState({
              tokenMaps: {
                ...this.state.tokenMaps,
                [v.address]: tokenResult.result,
              },
            });
          }
        });

        Promise.all(mapPromise)
          .catch(() => {})
          .then(() => {
            this.setState({ isLoading: false });
          });
        await Promise.all(mapPromise);

        const tokenListSort = tokenList.sort((a, b) => {
          const totalSupplya = devidedByDecimals(a.token.totalSupply, a.token.decimals);
          const totalSupplyb = devidedByDecimals(b.token.totalSupply, b.token.decimals);
          return totalSupplyb - totalSupplya;
        });
        this.setState({ tokenList: tokenListSort });
      }
    });
  }

  renderEllipse(text = 0, num) {
    const txt = text.toString();

    if (txt.replace('.', '').length > num) {
      return <Popup trigger={<div className="ellipse-11">{text}</div>} content={text} />;
    }
    return <span style={{ verticalAlign: 'middle' }}>{txt}</span>;
  }

  render() {
    const { tokenList, TotalCount, isLoading, curPage, tokenMaps } = this.state;

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
        className: 'three wide aligned',
        dataIndex: 'name',
        title: i18n('Token'),
        render: (text, row) => {
          let txt = text;
          if (row.token && row.token.symbol) {
            txt = (
              <span>
                {row.token.name}
                &nbsp; ({row.token.symbol})
              </span>
            );
          }

          return (
            <CellTxtBold>
              {<img src={row.tokenIcon || defaultTokenIcon} />}
              <Link to={`/token/${row.address}`}>{txt}</Link>
            </CellTxtBold>
          );
        },
      },
      {
        key: 3,
        className: 'two wide aligned',
        dataIndex: '',
        title: i18n('Transfer'),
        render: (text, row) => {
          if (typeof tokenMaps[row.address] !== 'undefined') {
            return <CellTxt>{this.renderEllipse(tokenMaps[row.address].transferCount, 11)}</CellTxt>;
          }
          return null;
        },
      },
      {
        key: 4,
        className: 'two wide aligned',
        dataIndex: 'totalSupply',
        title: i18n('Total Supply'),
        render: (text, row) => {
          if (row.token && row.token.totalSupply && row.token.decimals) {
            const totalSupply = devidedByDecimals(row.token.totalSupply, row.token.decimals);
            return (
              <CellTxt>
                {this.renderEllipse(totalSupply, 11)}
                <span style={{ verticalAlign: 'middle' }}>
                  &nbsp;
                  {row.token.symbol}
                </span>
              </CellTxt>
            );
          }
          return null;
        },
      },
      {
        key: 5,
        className: 'two wide aligned',
        dataIndex: 'accountTotal',
        title: i18n('Holders'),
        render: (text, row) => {
          if (tokenMaps[row.address] && typeof tokenMaps[row.address].accountTotal !== 'undefined') {
            return <CellTxt>{this.renderEllipse(tokenMaps[row.address].accountTotal, 11)}</CellTxt>;
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
      {
        key: 7,
        dataIndex: '',
        title: '',
        style: {
          width: '1%',
        },
        render: (text) => {},
      },
    ];

    return (
      <Wrapper>
        <HeadBar>
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
            <div className="page-pc" />
            <div className="page-h5">
              <TotalDesc total={TotalCount} />
            </div>
          </StyledTabel>
        </TabWrapper>
      </Wrapper>
    );
  }
}
export default List;
