import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Popup } from 'semantic-ui-react';
import styled from 'styled-components';
import uniq from 'lodash/uniq';
import DataList from '../../components/DataList';
import Countdown from '../../components/Countdown';
import EllipsisLine from '../../components/EllipsisLine';
import TableLoading from '../../components/TableLoading';
import media from '../../globalStyles/media';
import Dag from '../../components/Dag';
import { converToGasPrice3Fixed, i18n, getContractList } from '../../utils';
import { reqTransactionList, reqBlockList, reqContractListInfo } from '../../utils/api';
import AddressEllipseLine from '../../components/AddressEllipseLine';

const RowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
`;
const ColumnWrapper = styled.div`
  display: flex;
  ${media.mobile`
    flex-wrap: wrap;
    justify-content: center;
  `}
`;

const DagWrapper = styled.div`
  #dag-viewer {
    height: 240px;
    width: 100%;
    > canvas {
      border-radius: 4px;
    }
  }
`;

const AbsWrapper = styled.div`
  position: relative;
  height: 0;
`;
const TitleWrapper = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  color: white;
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  > h1 {
    margin: 0;
    font-size: 20px;
    color: white;
  }
`;

const SmallerIconFace = styled.div`
  margin-right: 16px;
  width: 32px;
  height: 32px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 24px;
    height: 24px;
  }
`;

const StyledTabel = styled.div`
  margin-top: 20px;
  width: calc(50% - 6px);
  &.right {
    margin-left: 16px;
  }
  ${media.pad`
    &.right {
      margin-left: auto;
    }
  `}

  ${media.mobile`
    width: 95%;
    margin: 0 auto;
    display: block;
    margin-bottom: 16px;

    .content table {
      margin-left: -1em;
    }
  `}
`;
const IconFace = styled.div`
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  float: left;
  margin: 0 16px;
  svg {
    width: 23px;
    height: 23px;
  }
`;
const PCell = styled.div`
  margin: 0 !important;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.87);
  font-weight: 400;
  height: 17px;
  line-height: 19px;
  white-space: nowrap;
`;

const StyledButton = styled.button`
  color: rgba(0, 0, 0, 0.87) !important;
  background: #e3eef9 !important;
  font-size: 14px !important;
  font-family: 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
  font-weight: bold !important;
  &:hover {
    color: #fff !important;
    background: #1e3de4 !important;
  }
`;
const StyledLabel = styled.div.attrs({
  className: 'ui label',
})`
  font-size: 12px;
  font-family: 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: bolder !important;
  color: rgba(0, 0, 0, 0.56);
  max-width: 100px;
`;
const StyledMobile = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;
const FloatGas = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
`;

const EllipsisLinewrap = styled.div`
  display: flex;
  align-items: center;
  > span {
    max-width: 114px;
    min-width: 100px;
    flex: 1;
  }

  .prefix-tag {
    font-style: normal;
    margin-right: 5px;
    min-width: 32px;
    font-size: 14px !important;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.87);
    margin-right: 8px;
    flex-shrink: 0;
  }
`;

class BlockAndTxn extends Component {
  constructor() {
    super();
    this.state = {
      BlockList: [],
      TxList: [],
      showLoading: true,
      plusTimeCount: 0,
    };

    this.timerId = null;
    this.beginCountDown = () => {
      this.timerId = setInterval(() => {
        const { plusTimeCount } = this.state;
        this.setState({
          plusTimeCount: plusTimeCount + 1,
        });
      }, 1000);
    };
  }

  componentDidMount() {
    this.fetchInitList({ looping: false }).then(() => {
      this.beginCountDown();
    });

    this.loopFetchTimer = setInterval(() => {
      if (window.navigator.onLine) {
        this.fetchInitList({
          looping: true,
        });
      }
    }, 10 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
    clearInterval(this.loopFetchTimer);
  }

  fetchInitList({ looping = false }) {
    let extra = {};
    if (looping) {
      extra = {
        showError: false,
        showNetWorkError: false,
      };
    }

    const req1 = reqBlockList(
      {
        page: 1,
        pageSize: 10,
      },
      extra
    ).then((body) => {
      if (body.code === 0) {
        this.setState({
          showLoading: false,
          BlockList: body.result.list.filter((v) => !!v),
        });
      }
    });

    const req2 = reqTransactionList(
      {
        page: 1,
        pageSize: 10,
      },
      extra
    ).then((body) => {
      if (body.code === 0) {
        const txList = body.result.list.filter((v) => !!v);
        this.setState({
          TxList: txList,
          plusTimeCount: 0,
        });

        reqContractListInfo(getContractList(txList));
      }
    });

    return Promise.all([req1, req2]);
  }

  render() {
    const { BlockList, TxList, showLoading, plusTimeCount } = this.state;
    const MBlockColumns = [
      {
        key: 2,
        dataIndex: 'hash',
        className: 'five wide left aligned',
        title: 'Blocks',
        render: (text, row) => (
          <StyledMobile>
            <IconFace>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#iconqukuaigaoduxuanzhong" />
              </svg>
            </IconFace>
            <div>
              <EllipsisLine isLong linkTo={`/blocksdetail/${row.hash}`} isPivot={row.pivotHash === row.hash} text={row.hash} />
              <PCell>
                <Countdown timestamp={row.timestamp * 1000} />
              </PCell>
              <EllipsisLine prefix={i18n('Miner')} linkTo={`/address/${row.miner}`} text={row.miner} />
              <FloatGas>
                <PCell>
                  {row.transactionCount} {row.transactionCount <= 1 ? i18n('txn') : i18n('txns')}
                </PCell>
              </FloatGas>
            </div>
          </StyledMobile>
        ),
      },
    ];
    const BlockColumns = [
      {
        key: 2,
        dataIndex: 'hash',
        className: 'five wide left aligned',
        title: 'Blocks',
        render: (text, row) => (
          <div>
            <IconFace>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#iconqukuaigaoduxuanzhong" />
              </svg>
            </IconFace>
            <EllipsisLine position="top left" isLong linkTo={`/blocksdetail/${text}`} isPivot={row.pivotHash === row.hash} text={text} />
            <PCell>
              <Countdown timestamp={row.timestamp * 1000} />
            </PCell>
          </div>
        ),
      },
      {
        key: 3,
        dataIndex: 'miner',
        className: 'one wide left aligned',
        title: 'Blocks',
        render: (text, row) => (
          <div>
            <EllipsisLine
              prefix={i18n('Miner')}
              linkTo={`/address/${text}`}
              text={
                (/* fmt */) => {
                  return ' ' + text;
                }
              }
            />
            <PCell>
              {row.transactionCount} {row.transactionCount <= 1 ? i18n('txn') : i18n('txns')}
            </PCell>
          </div>
        ),
      },
      {
        key: 4,
        className: 'two wide right aligned',
        dataIndex: 'viel',
        title: 'Blocks',
      },
    ];
    const MTxColumns = [
      {
        key: 2,
        dataIndex: 'hash',
        className: 'five wide left aligned',
        title: 'Blocks',
        render: (text, row) => (
          <StyledMobile>
            <IconFace>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#iconjinrijiaoyiliang" />
              </svg>
            </IconFace>
            <div>
              <EllipsisLine linkTo={`/transactionsdetail/${row.hash}`} isPivot={row.pivotHash === row.hash} text={row.hash} />
              <PCell>
                <Countdown timestamp={row.timestamp * 1000 + plusTimeCount * 1000} />
              </PCell>
              <EllipsisLinewrap>
                <i className="prefix-tag">{i18n('From')}</i>
                <span>
                  <AddressEllipseLine address={row.from} />
                </span>
              </EllipsisLinewrap>
              <EllipsisLinewrap>
                <i className="prefix-tag">{i18n('To')}</i>
                <span>
                  <AddressEllipseLine contractCreated={row.contractCreated} type="to" address={row.to} />
                </span>
              </EllipsisLinewrap>
              <FloatGas>
                <StyledLabel>{converToGasPrice3Fixed(row.value) + ' CFX'}</StyledLabel>
              </FloatGas>
            </div>
          </StyledMobile>
        ),
      },
    ];
    const TxColumns = [
      {
        key: 2,
        dataIndex: 'hash',
        className: 'five wide left aligned',
        title: 'Blocks',
        render: (text, row) => (
          <div>
            <IconFace>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#iconjinrijiaoyiliang" />
              </svg>
            </IconFace>
            <EllipsisLine linkTo={`/transactionsdetail/${text}`} isPivot={row.pivotHash === row.hash} text={text} />
            <PCell>
              <Countdown timestamp={row.timestamp * 1000} />
            </PCell>
          </div>
        ),
      },
      {
        key: 3,
        dataIndex: 'from',
        className: 'one wide left aligned',
        title: 'Blocks',
        render: (text, row) => {
          return (
            <div style={{ height: 36 }}>
              <EllipsisLinewrap>
                <i className="prefix-tag">{i18n('From')}</i>
                <span>
                  <AddressEllipseLine address={row.from} />
                </span>
              </EllipsisLinewrap>
              <EllipsisLinewrap>
                <i className="prefix-tag">{i18n('To')}</i>
                <span>
                  <AddressEllipseLine contractCreated={row.contractCreated} type="to" address={row.to} />
                </span>
              </EllipsisLinewrap>
            </div>
          );
        },
      },
      {
        key: 4,
        className: 'two wide center aligned',
        dataIndex: 'gasPrice',
        title: 'Blocks',
        render: (text, row) => {
          return <StyledLabel>{converToGasPrice3Fixed(row.value) + ' CFX'}</StyledLabel>;
        },
      },
    ];
    return (
      <div className="page-block-txn">
        <RowWrapper>
          <DagWrapper>
            <Dag>
              <AbsWrapper>
                <TitleWrapper>
                  <SmallerIconFace>
                    <svg className="icon" aria-hidden="true">
                      <use xlinkHref="#iconqukuaigaoduxuanzhong" />
                    </svg>
                  </SmallerIconFace>
                  <h1>{i18n('app.pages.blockAndTx.blocks')}</h1>
                </TitleWrapper>
              </AbsWrapper>
            </Dag>
          </DagWrapper>
          <ColumnWrapper>
            <StyledTabel className="left">
              <div className="ui card" style={{ width: '100%' }}>
                <div className="content">
                  <div className="header">{i18n('app.pages.blockAndTx.blocks')}</div>
                </div>
                <div className="content">
                  {showLoading && <TableLoading />}
                  <DataList columns={window.innerWidth > 576 ? BlockColumns : MBlockColumns} dataSource={BlockList} />
                </div>
                <div className="extra content">
                  <Link to="/blocks">
                    <StyledButton className="ui fluid violet button ">{i18n('app.pages.blockAndTx.viewAllBlocks')}</StyledButton>
                  </Link>
                </div>
              </div>
            </StyledTabel>
            <StyledTabel className="right">
              <div className="ui card" style={{ width: '100%' }}>
                <div className="content">
                  <div className="header">{i18n('Transactions')}</div>
                </div>
                <div className="content">
                  {showLoading && <TableLoading />}
                  <DataList columns={window.innerWidth > 576 ? TxColumns : MTxColumns} dataSource={TxList} />
                </div>
                <div className="extra content">
                  <Link to="/transactions">
                    <StyledButton className="ui fluid violet button ">{i18n('app.pages.blockAndTx.viewAllTransactions')}</StyledButton>
                  </Link>
                </div>
              </div>
            </StyledTabel>
          </ColumnWrapper>
        </RowWrapper>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    contractManagerCache: state.common.contractManagerCache,
  };
}

export default connect(mapStateToProps)(BlockAndTxn);
