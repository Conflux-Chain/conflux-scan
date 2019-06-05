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
import { initSse, closeSource, sendRequest } from '../../utils';

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: flex-start;
`;

const StyledTabel = styled.div`
  margin-top: 20px;
  width: calc(50% - 6px);

  &.right {
    margin-left: 16px;
  }
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
  margin-right: 16px;
  svg {
    width: 23px;
    height: 23px;
  }
`;
const PCell = styled.div`
  margin: 0 !important;
  font-size: 14px;
  font-family: ProximaNova-Regular;
  color: rgba(0, 0, 0, 0.87);
  font-weight: 400;
  height: 17px;
  line-height: 19px;
`;

const StyledButton = styled.button`
  color: rgba(0, 0, 0, 0.87) !important;
  background: #e3eef9 !important;
  font-size: 14px !important;
  font-family: ProximaNova-Bold !important;
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
  font-family: ProximaNova-Semibold;
  font-weight: bolder !important;
  color: rgba(0, 0, 0, 0.56);
  max-width: 100px;
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
            <EllipsisLine linkTo={`/accountdetail/${text}`} text={'Miner ' + text} />
            <PCell>{row.transactionCount} txns</PCell>
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
            <EllipsisLine prefix="From" linkTo={`/accountdetail/${text}`} text={text} />
            <EllipsisLine is2ndLine prefix="To" linkTo={`/accountdetail/${row.to}`} text={row.to} />
          </div>
        ),
      },
      {
        key: 4,
        className: 'two wide center aligned',
        dataIndex: 'gasPrice',
        title: 'Blocks',
        render: (text) => <StyledLabel>{'GAS ' + text}</StyledLabel>,
      },
    ];
    return (
      <div className="page-block-txn">
        <Wrapper>
          <StyledTabel className="left">
            <div className="ui card" style={{ width: '100%' }}>
              <div className="content">
                <div className="header">{locale === 'zh' ? '区块' : 'Blocks'}</div>
              </div>
              <div className="content">
                {!BlockList.length && <TableLoading />}
                <DataList columns={BlockColumns} dataSource={BlockList} />
              </div>
              <div className="extra content">
                <Link to="/blocks">
                  <StyledButton className="ui fluid violet button ">{locale === 'zh' ? '查看所有区块' : 'View All Blocks'}</StyledButton>
                </Link>
              </div>
            </div>
          </StyledTabel>
          <StyledTabel className="right">
            <div className="ui card" style={{ width: '100%' }}>
              <div className="content">
                <div className="header">{locale === 'zh' ? '交易' : 'Transactions'}</div>
              </div>
              <div className="content">
                {!TxList.length && <TableLoading />}
                <DataList columns={TxColumns} dataSource={TxList} />
              </div>
              <div className="extra content">
                <Link to="/transactions">
                  <StyledButton className="ui fluid violet button ">
                    {locale === 'zh' ? '查看所有交易' : 'View All Transactions'}
                  </StyledButton>
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
