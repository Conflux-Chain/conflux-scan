import React, { Component } from 'react';
import styled from 'styled-components';
import DataList from '../../components/DataList';
import Countdown from '../../components/Countdown';
import EllipsisLine from '../../components/EllipsisLine';
import '../../assets/semantic-ui/semantic.css';
import { initSse } from './util';

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
  svg {
    width: 23px;
    height: 23px;
  }
`;
const PCell = styled.div`
  margin: 0 !important;
`;

const StyledButton = styled.button`
  color: rgba(0, 0, 0, 0.56) !important;
  background: #e0e1e2 !important;
  &:hover {
    color: #fff !important;
    background: #1e3de4 !important;
  }
`;

const columns = [
  {
    key: 1,
    dataIndex: 'ein',
    title: 'Blocks',
    // className: 'two wide',
    render: (text, row) => (
      <IconFace>
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#iconjinrijiaoyiliang" />
        </svg>
      </IconFace>
    ),
  },
  {
    key: 2,
    dataIndex: 'drei',
    title: 'Blocks',
    render: (text, row) => (
      <div>
        <PCell>
          <EllipsisLine isPivot text={row.zwei} />
        </PCell>
        <PCell>{row.drei}</PCell>
      </div>
    ),
  },
  {
    key: 3,
    dataIndex: 'drei',
    title: 'Blocks',
    render: (text, row) => (
      <div>
        <EllipsisLine text={row.zwei} />
        <PCell>{row.drei}</PCell>
      </div>
    ),
  },
  {
    key: 4,
    className: 'two wide right aligned',
    dataIndex: 'drei',
    title: 'Blocks',
    render: (text) => <div className="ui label">{text}</div>,
  },
];
const dataSource = [
  { key: 1, ein: '80580', zwei: '0xe969a6fc05897123123', drei: 'Alichs' },
  { key: 2, ein: '80581', zwei: '0xe969a6fc05897124124', drei: 'Schwarz' },
];

class BlockAndTxn extends Component {
  constructor() {
    super();
    this.state = {
      // dataSource: [],
      timestamp: new Date().getTime(),
    };
  }

  componentDidMount() {
    initSse(this);
  }

  render() {
    const { timestamp } = this.state;
    return (
      <div className="page-block-txn">
        <Wrapper>
          <StyledTabel className="left">
            <div className="ui card" style={{ width: '100%' }}>
              <div className="content">
                <div className="header">
                  Blocks
                  <Countdown timestamp={timestamp.toString()} />
                </div>
              </div>
              <div className="content">
                <DataList showHeader columns={columns} dataSource={dataSource} />
              </div>
              <div className="extra content">
                <StyledButton className="ui fluid violet button ">View All Blocks</StyledButton>
              </div>
            </div>
          </StyledTabel>
          <StyledTabel className="right">
            <div className="ui card" style={{ width: '100%' }}>
              <div className="content">
                <div className="header">Transactions</div>
              </div>
              <div className="content">
                <DataList columns={columns} dataSource={dataSource} />
              </div>
              <div className="extra content">
                <StyledButton className="ui fluid violet button ">View All Transactions</StyledButton>
              </div>
            </div>
          </StyledTabel>
        </Wrapper>
      </div>
    );
  }
}
export default BlockAndTxn;
