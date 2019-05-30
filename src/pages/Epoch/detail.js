import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import superagent from 'superagent';
import { Pagination } from 'semantic-ui-react';
import DataList from '../../components/DataList';
import EllipsisLine from '../../components/EllipsisLine';
import Countdown from '../../components/Countdown';
import '../../assets/semantic-ui/semantic.css';

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledTabel = styled.div`
  margin-top: 20px;

  &.right {
    margin-left: 16px;
  }
`;

const PCell = styled.div`
  margin: 0 !important;
`;

const HeadBar = styled.div`
  width: 100%;
  font-size: 16px;
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
    margin-right: 24px;
  }
`;

const columns = [
  {
    key: 1,
    dataIndex: 'ein',
    title: 'Position',
    className: 'plain_th',
  },
  {
    key: 2,
    dataIndex: 'hash',
    title: 'Hash',
    render: (text) => (
      <div>
        <PCell>
          <EllipsisLine linkTo={`/blocksdetail/${text}`} isPivot isLong text={text} />
        </PCell>
      </div>
    ),
  },
  {
    key: 3,
    dataIndex: 'difficulty',
    title: 'Difficulty',
    className: 'plain_th',
    render: (text) => (
      <div>
        <PCell>{text}</PCell>
      </div>
    ),
  },
  {
    key: 4,
    dataIndex: 'miner',
    title: 'Miner',
    render: (text) => (
      <div>
        <PCell>
          <EllipsisLine linkTo={`/accountdetail/${text}`} text={text} />
        </PCell>
      </div>
    ),
  },
  {
    key: 5,
    dataIndex: 'gasLimit',
    title: 'Gas Limit',
    className: 'plain_th',
    render: (text) => text,
  },
  {
    key: 6,
    dataIndex: 'timestamp',
    title: 'Age',
    className: 'plain_th',
    render: (text) => (
      <PCell>
        <Countdown timestamp={text * 1000} />
      </PCell>
    ),
  },
  {
    key: 7,
    className: 'center aligned plain_th',
    dataIndex: 'transactionCount',
    title: 'Tx Count',
    render: (text) => text,
  },
];

class Detail extends Component {
  constructor() {
    super();
    this.state = {
      BlockList: [],
    };
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;
    this.fetchInitList({ epochid: params.epochid });
  }

  async fetchInitList({ epochid }) {
    const { code, result } = (await superagent.get(
      `http://127.0.0.1:3000/proxy/fetchEpochList?pageNum=1&pageSize=20&epochNum=${epochid}`
    )).body;
    if (!code) {
      this.setState({
        BlockList: result.find((item) => Object.keys(item)[0] === 'block/list')['block/list'],
      });
    }
  }

  render() {
    const { BlockList } = this.state;
    const {
      match: { params },
    } = this.props;
    console.log(BlockList);
    return (
      <div className="page-epoch-detail">
        <Wrapper>
          <HeadBar>
            <h1>Epoch</h1>
            <p>{params.epochid}</p>
          </HeadBar>
          <StyledTabel>
            <div className="ui fluid card">
              <div className="content">
                <DataList showHeader columns={columns} dataSource={BlockList} />
              </div>
            </div>
          </StyledTabel>
        </Wrapper>
      </div>
    );
  }
}
Detail.propTypes = {
  match: PropTypes.objectOf(PropTypes.string),
};
Detail.defaultProps = {
  match: {},
};
export default Detail;
