import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import superagent from 'superagent';
import { injectIntl, FormattedMessage } from 'react-intl';
import DataList from '../../components/DataList';
import Countdown from '../../components/Countdown';
import EllipsisLine from '../../components/EllipsisLine';
import TableLoading from '../../components/TableLoading';
import '../../assets/semantic-ui/semantic.css';
import media from '../../globalStyles/media';
import { converToGasPrice3Fixed, initSse, closeSource, sendRequest, i18n } from '../../utils';

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: flex-start;
  ${media.mobile`
    flex-wrap: wrap;
    justify-content: center;
  `}
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

class BlockAndTxn extends Component {
  constructor() {
    super();
    this.state = {
      BlockList: [],
      TxList: [],
    };
  }

  componentDidMount() {
    this.fetchInitList();
    initSse(this, '/proxy/fetchBlockandTxList?pageNum=1&pageSize=10');
  }

  componentWillUnmount() {
    closeSource();
  }

  async fetchInitList() {
    const { code, result } = (await sendRequest({
      url: '/proxy/fetchInitBlockandTxList',
      query: {
        pageNum: 1,
        pageSize: 10,
      },
    })).body;
    if (!code) {
      this.setState({
        BlockList: result.find((item) => Object.keys(item)[0] === 'block/list')['block/list'],
        TxList: result.find((item) => Object.keys(item)[0] === 'transaction/list')['transaction/list'],
      });
    }
  }

  render() {
    const {
      intl: { locale },
    } = this.props;
    const { BlockList, TxList } = this.state;
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
              <EllipsisLine isLong linkTo={`/blocksdetail/${text}`} isPivot={row.isPivot} text={text} />
              <PCell>
                <Countdown timestamp={row.timestamp * 1000} />
              </PCell>
              <EllipsisLine linkTo={`/accountdetail/${text}`} text={'Miner ' + text} />
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
            <EllipsisLine isLong linkTo={`/blocksdetail/${text}`} isPivot={row.isPivot} text={text} />
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
              linkTo={`/accountdetail/${text}`}
              text={(fmt) => {
                return ' ' + text;
              }}
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
              <EllipsisLine linkTo={`/transactionsdetail/${text}`} isPivot={row.isPivot} text={text} />
              <PCell>
                <Countdown timestamp={row.timestamp * 1000} />
              </PCell>
              <EllipsisLine prefix={i18n('From')} linkTo={`/accountdetail/${text}`} text={text} />
              <EllipsisLine is2ndLine prefix={i18n('To')} linkTo={`/accountdetail/${row.to}`} text={row.to} />
              <FloatGas>
                <StyledLabel>{converToGasPrice3Fixed(row.gasPrice) + ' CFX'}</StyledLabel>
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
            <EllipsisLine linkTo={`/transactionsdetail/${text}`} isPivot={row.isPivot} text={text} />
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
        render: (text, row) => (
          <div>
            <EllipsisLine prefix={i18n('From')} linkTo={`/accountdetail/${text}`} text={text} />
            <EllipsisLine is2ndLine prefix={i18n('To')} linkTo={`/accountdetail/${row.to}`} text={row.to} />
          </div>
        ),
      },
      {
        key: 4,
        className: 'two wide center aligned',
        dataIndex: 'gasPrice',
        title: 'Blocks',
        render: (text) => <StyledLabel>{converToGasPrice3Fixed(text) + ' CFX'}</StyledLabel>,
      },
    ];
    return (
      <div className="page-block-txn">
        <Wrapper>
          <StyledTabel className="left">
            <div className="ui card" style={{ width: '100%' }}>
              <div className="content">
                <div className="header">{i18n('app.pages.blockAndTx.blocks')}</div>
              </div>
              <div className="content">
                {!BlockList.length && <TableLoading />}
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
                {!TxList.length && <TableLoading />}
                <DataList columns={window.innerWidth > 576 ? TxColumns : MTxColumns} dataSource={TxList} />
              </div>
              <div className="extra content">
                <Link to="/transactions">
                  <StyledButton className="ui fluid violet button ">{i18n('app.pages.blockAndTx.viewAllTransactions')}</StyledButton>
                </Link>
              </div>
            </div>
          </StyledTabel>
        </Wrapper>
      </div>
    );
  }
}
BlockAndTxn.propTypes = {
  intl: PropTypes.shape({
    lang: PropTypes.string,
  }),
};
BlockAndTxn.defaultProps = {
  intl: {
    lang: 'zh',
  },
};

export default injectIntl(BlockAndTxn);
