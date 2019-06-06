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
import media from '../../globalStyles/media';

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  ${media.mobile`
    width: 95%;
    margin: 0 auto;
  `}
`;

const StyledTabel = styled.div`
  margin-top: 20px;
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
      padding: 16px 0 !important;
    }
  }
  &.right {
    margin-left: 16px;
  }
`;

const PCell = styled.div`
  margin: 0 !important;
`;

const HeadBar = styled.div`
  margin-top: 24px;
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
    dataIndex: 'position',
    title: 'Position',
    className: 'one wide aligned plain_th',
    render: (text) => 1 + text,
  },
  {
    key: 2,
    dataIndex: 'hash',
    title: 'Hash',
    className: 'two wide aligned',
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
    className: 'one wide aligned plain_th',
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
    className: 'one wide aligned',
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
    className: 'one wide aligned plain_th',
    render: (text) => text,
  },
  {
    key: 6,
    dataIndex: 'timestamp',
    title: 'Age',
    className: 'three wide aligned plain_th',
    render: (text) => (
      <PCell>
        <Countdown timestamp={text * 1000} />
      </PCell>
    ),
  },
  {
    key: 7,
    className: 'one wide left aligned plain_th',
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
    const { code, result } = (await superagent.get(`/proxy/fetchEpochList?pageNum=1&pageSize=20&epochNum=${epochid}`)).body;
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
                <DataList isMobile showHeader columns={columns} dataSource={BlockList} />
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
