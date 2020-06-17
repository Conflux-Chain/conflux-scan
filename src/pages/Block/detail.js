import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import superagent from 'superagent';
import moment from 'moment';
import BigNumber from 'bignumber.js';
import { Popup } from 'semantic-ui-react';
import Pagination from '../../components/Pagination';
import Countdown from '../../components/Countdown';
import TableLoading from '../../components/TableLoading';
import DataList from '../../components/DataList';
import EllipsisLine from '../../components/EllipsisLine';
import { convertToValueorFee, converToGasPrice, i18n, getContractList, tranferToLowerCase, wait } from '../../utils';
import media from '../../globalStyles/media';
import * as commonCss from '../../globalStyles/common';
import {
  reqBlock,
  reqBlockTransactionList,
  reqBlockRefereeBlockList,
  reqContractListInfo,
  reqConfirmationRiskByHash,
} from '../../utils/api';
import { errorCodes } from '../../constants';
import AddressEllipseLine from '../../components/AddressEllipseLine';
import SecurityLevel from '../../components/SecurityLevel';

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  ${media.mobile`
    width: 95%;
    margin: 0 auto;
  `}
`;

const StyledTabelWrapper = styled.div`
  overflow: hidden;
  .ui.fluid.card {
    box-shadow: none;
    border: 1px solid rgba(0, 0, 0, 0.08);
  }
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
      padding: 16px 16px !important;
      padding-right: 0 !important;
    }
    &.right-pad {
      padding-right: 16px !important;
    }
  }
  &.right {
    margin-left: 16px;
  }
`;

const StyledTabel = styled.div`
  /* margin-top: 20px;
  width: 100%;
  background: #fff;
  border-radius: 4px !important;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.12) !important; */
  ${media.mobile`
    margin: 0 auto;
    overflow-x: scroll;
  `}

  tr > td {
    padding-left: 3.2em !important;
    border: none !important;
    font-size: 16px !important;
    background: #fff !important;
  }

  &.right {
    margin-left: 16px;
  }
  td.collapsing {
    font-weight: bold !important;
    padding: 0.5em 5em 0.5em 2em !important;
    ${media.mobile`
      padding: 0.1em 2em 0.1em 2em !important;
    `}
    background: #edf2f9 !important;
  }
  td.top {
    padding-top: 2em !important;
  }
  td.bottom {
    padding-bottom: 2em !important;
  }
  tr > td > a {
    font-weight: bold;
  }
`;

const HeadBar = styled.div`
  width: 100%;
  font-size: 16px;
  margin-top: 16px;
  margin-bottom: 10px;
  flex-wrap: wrap;
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
    margin-right: 12px;
  }
`;

const TabZone = styled.div`
  margin-top: 16px;
  position: relative;
  width: 100%;
  button {
    outline: none;
    border: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }
`;

const PCell = styled.div`
  margin: 0 !important;
`;

const TabWrapper = styled.div`
  margin-top: 1em;
  display: flex;
  justify-content: flex-end;
  ${media.mobile`
    justify-content: center;
  `}
  ${commonCss.paginatorMixin}
`;
const TabContent = styled.div`
  margin-top: -1px;
  margin-left: 1px;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px 1px;
  .ui.segment[class*='bottom attached'] {
    box-shadow: none;
  }
`;
const ContractCell = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;
  font-weight: normal;
`;

const pageSize = 10;

class Detail extends Component {
  constructor(...args) {
    super(...args);
    this.getInitstate = () => ({
      currentTab: 1,
      TxTotalCount: 0,
      refereeBlockList: [],
      blockDetail: {},
      TxList: [],
      isLoading: true,
      curPage: 1,
      refBlockCurPage: 1,
      refTotal: 0,
      blockServerTimestamp: 0,
      txServerTimestamp: 0,
    });
    this.state = this.getInitstate();
    this.getBlockHash = this.getBlockHash.bind(this);
  }

  componentDidMount() {
    this.fetchBlockDetail(this.getBlockHash(), { activePage: 1 });
    this.fetchReffereBlock(this.getBlockHash(), { refBlockCurPage: 1 });
  }

  componentDidUpdate(prevProps) {
    const blockhash = this.getBlockHash();
    const prevBlockHash = tranferToLowerCase(prevProps.match.params.blockhash);
    // eslint-disable-next-line react/destructuring-assignment
    if (blockhash !== prevBlockHash) {
      // eslint-disable-next-line  react/no-did-update-set-state
      this.setState(this.getInitstate());
      this.fetchBlockDetail(blockhash, { activePage: 1 });
      this.fetchReffereBlock(blockhash, { refBlockCurPage: 1 });
    }
  }

  async getConfirmRisk(blockHash) {
    let looping = true;
    let riskLevel;
    while (looping) {
      // eslint-disable-next-line no-await-in-loop
      riskLevel = await reqConfirmationRiskByHash(blockHash);
      this.setState({
        riskLevel,
      });
      if (riskLevel === '') {
        // eslint-disable-next-line no-await-in-loop
        await wait(1000);
      } else if (riskLevel === 'lv0') {
        looping = false;
      } else {
        // eslint-disable-next-line no-await-in-loop
        await wait(10 * 1000);
      }
    }
  }

  getBlockHash() {
    const {
      match: { params },
    } = this.props;
    const { blockhash } = params;
    return tranferToLowerCase(blockhash);
  }

  fetchBlockDetail(blockHash, { activePage }) {
    const { history } = this.props;
    this.setState({ isLoading: true });

    reqBlock({ hash: blockHash }, { showError: false }).then((body) => {
      if (body.code === 0) {
        this.setState({
          blockDetail: body.result,
          isLoading: false,
        });
        this.getConfirmRisk(blockHash);
      } else if (body.code === errorCodes.BlockNotFoundError) {
        history.push(`/search-notfound?searchId=${blockHash}`);
      }
    });

    reqBlockTransactionList(
      {
        blockHash,
        page: activePage,
        pageSize,
      },
      { showError: false }
    ).then((body) => {
      if (body.code === 0) {
        const txList = body.result.list.filter((v) => !!v);
        this.setState({
          TxList: txList,
          TxTotalCount: body.result.total,
          curPage: activePage,
          txServerTimestamp: body.serverTimestamp,
        });
        reqContractListInfo(getContractList(txList));
      }
    });
  }

  fetchReffereBlock(blockHash, { refBlockCurPage }) {
    this.setState({ isLoading: true });

    reqBlockRefereeBlockList(
      {
        page: refBlockCurPage,
        pageSize,
        referredBy: blockHash,
      },
      { showError: false }
    ).then((body) => {
      if (body.code === 0) {
        this.setState({
          refTotal: body.result.total,
          refereeBlockList: body.result.list.filter((v) => !!v),
          isLoading: false,
          refBlockCurPage,
          blockServerTimestamp: body.serverTimestamp,
        });
      }
    });
  }

  render() {
    const {
      blockDetail,
      TxList,
      TxTotalCount,
      isLoading,
      currentTab,
      refereeBlockList,
      curPage,
      refBlockCurPage,
      refTotal,
      riskLevel,
      blockServerTimestamp,
      txServerTimestamp,
    } = this.state;

    const TxColumns = [
      {
        key: 1,
        className: 'two wide',
        dataIndex: 'hash',
        title: i18n('Hash'),
        render: (text) => <EllipsisLine popUpCfg={{ position: 'top left' }} linkTo={`/transactionsdetail/${text}`} text={text} />,
      },
      {
        key: 2,
        className: 'two wide aligned',
        dataIndex: 'from',
        title: i18n('From'),
        render: (text) => <AddressEllipseLine address={text} />,
      },
      {
        key: 3,
        className: 'two wide aligned',
        dataIndex: 'to',
        title: i18n('To'),
        render: (text, row) => {
          return <AddressEllipseLine contractCreated={row.contractCreated} type="to" address={row.to} />;
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
        dataIndex: 'gasPrice',
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
        render: (text, row) => <Countdown baseTime={txServerTimestamp} timestamp={row.syncTimestamp} />,
      },
    ];

    const RefColumns = [
      {
        key: 1,
        dataIndex: 'epochNumber',
        title: i18n('Epoch'),
        className: 'one wide aligned',
        render: (text) => <EllipsisLine linkTo={`/epochsdetail/${text}`} text={text} />,
      },
      {
        key: 2,
        title: i18n('Position'),
        dataIndex: 'blockIndex',
        className: 'one wide aligned plain_th',
        render: (text, row) => (
          <div>
            <PCell>{1 + text}</PCell>
          </div>
        ),
      },
      {
        key: 3,
        dataIndex: 'hash',
        title: i18n('Hash'),
        className: 'one wide aligned',
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
        render: (text) => <EllipsisLine linkTo={`/address/${text}`} text={text} />,
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
        render: (text, row) => <Countdown baseTime={blockServerTimestamp} timestamp={row.syncTimestamp} />,
      },
      {
        key: 8,
        className: 'two wide left aligned plain_th',
        dataIndex: 'transactionCount',
        title: i18n('Tx Count'),
        render: (text) => <PCell>{text}</PCell>,
      },
    ];

    return (
      <div className="page-block-detail">
        <Wrapper>
          <HeadBar>
            <h1>{i18n('Block')}</h1>
            <p>{this.getBlockHash()}</p>
          </HeadBar>
          {isLoading ? (
            <TableLoading />
          ) : (
            <StyledTabel>
              <table className="ui basic table">
                <tbody className="">
                  <tr className="">
                    <td className="collapsing top">{i18n('Block Height')}</td>
                    <td className="top">{blockDetail.height}</td>
                  </tr>
                  <tr className="">
                    <td className="collapsing">{i18n('Epoch')}</td>
                    <td className="">
                      <Link to={`/epochsdetail/${blockDetail.epochNumber}`}>{blockDetail.epochNumber}</Link>
                    </td>
                  </tr>
                  <tr className="">
                    <td className="collapsing">{i18n('Difficulty')}</td>
                    <td className="">{blockDetail.difficulty}</td>
                  </tr>
                  <tr className="">
                    <td className="collapsing">{i18n('Miner')}</td>
                    <td className="">
                      <Link to={`/address/${blockDetail.miner}`}>{blockDetail.miner}</Link>
                    </td>
                  </tr>
                  <tr className="">
                    <td className="collapsing">{i18n('Security')}</td>
                    <td className="">
                      <SecurityLevel riskLevel={riskLevel} />
                    </td>
                  </tr>
                  <tr className="">
                    <td className="collapsing">{i18n('Block Hash')}</td>
                    <td className="">{blockDetail.hash}</td>
                  </tr>
                  <tr className="">
                    <td className="collapsing">{i18n('Parent Hash')}</td>
                    <td className="">
                      <Link to={`/blocksdetail/${blockDetail.parentHash}`}>{blockDetail.parentHash}</Link>
                    </td>
                  </tr>
                  <tr className="">
                    <td className="collapsing">{i18n('Nonce')}</td>
                    <td className="">{blockDetail.nonce}</td>
                  </tr>
                  <tr className="">
                    <td className="collapsing">{i18n('Gas Limit')}</td>
                    <td className="">{blockDetail.gasLimit}</td>
                  </tr>
                  <tr className="">
                    <td className="collapsing">{i18n('app.pages.blocks.packTime')}</td>
                    <td className="">{moment(blockDetail.syncTimestamp * 1000).format('YYYY-MM-DD HH:mm:ss')}</td>
                  </tr>
                  <tr className="">
                    <td className="collapsing bottom">{i18n('Size')}</td>
                    <td className="bottom">{blockDetail.size}</td>
                  </tr>
                </tbody>
              </table>
            </StyledTabel>
          )}
          <TabZone>
            <div className="ui attached tabular menu">
              <button type="button" className={currentTab === 1 ? 'active item' : 'item'} onClick={() => this.setState({ currentTab: 1 })}>
                {i18n('Transactions')}
                {`(${TxTotalCount})`}
              </button>
              <button
                className={currentTab === 2 ? 'active item' : 'item'}
                type="button"
                onClick={() => {
                  this.setState({ currentTab: 2 });
                }}
              >
                {i18n('Reference Blocks')}
                {`(${refTotal})`}
              </button>
            </div>

            <TabContent>
              <div className={currentTab === 1 ? 'ui bottom attached segment active tab' : 'ui bottom attached segment tab'}>
                <StyledTabelWrapper>
                  <div className="ui fluid card">
                    <div className="content">
                      <DataList isMobile showHeader columns={TxColumns} dataSource={TxList} />
                    </div>
                  </div>
                </StyledTabelWrapper>
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
                        this.fetchBlockDetail(this.getBlockHash(), data);
                      }}
                      activePage={curPage}
                      totalPages={Math.ceil(TxTotalCount / pageSize)}
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
                      activePage={curPage}
                      onPageChange={(e, data) => {
                        e.preventDefault();
                        this.fetchBlockDetail(this.getBlockHash(), data);
                      }}
                      ellipsisItem={null}
                      firstItem={null}
                      lastItem={null}
                      siblingRange={1}
                      totalPages={Math.ceil(TxTotalCount / pageSize)}
                    />
                  </div>
                </TabWrapper>
              </div>
              <div className={currentTab === 2 ? 'ui bottom attached segment active tab' : 'ui bottom attached segment tab'}>
                <StyledTabelWrapper>
                  <div className="ui fluid card">
                    <div className="content">
                      <DataList isMobile showHeader columns={RefColumns} dataSource={refereeBlockList} />
                    </div>
                  </div>
                </StyledTabelWrapper>
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
                        this.fetchReffereBlock(this.getBlockHash(), { refBlockCurPage: data.activePage });
                      }}
                      activePage={refBlockCurPage}
                      totalPages={Math.ceil(refTotal / pageSize)}
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
                      activePage={refBlockCurPage}
                      onPageChange={(e, data) => {
                        e.preventDefault();
                        this.fetchReffereBlock(this.getBlockHash(), { refBlockCurPage: data.activePage });
                      }}
                      ellipsisItem={null}
                      firstItem={null}
                      lastItem={null}
                      siblingRange={1}
                      totalPages={Math.ceil(refTotal / pageSize)}
                    />
                  </div>
                </TabWrapper>
              </div>
            </TabContent>
          </TabZone>
        </Wrapper>
      </div>
    );
  }
}
Detail.propTypes = {
  match: PropTypes.objectOf(PropTypes.string),
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
Detail.defaultProps = {
  match: {},
};
export default withRouter(Detail);
