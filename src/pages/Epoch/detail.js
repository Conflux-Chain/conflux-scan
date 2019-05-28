import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Pagination } from 'semantic-ui-react';
import DataList from '../../components/DataList';
import EllipsisLine from '../../components/EllipsisLine';
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
    title: 'Epoch',
  },
  {
    key: 2,
    dataIndex: 'drei',
    title: 'Position',
    render: (text, row) => (
      <div>
        <PCell>
          <EllipsisLine isPivot text={row.zwei} />
        </PCell>
      </div>
    ),
  },
  {
    key: 3,
    dataIndex: 'drei',
    title: 'Hash',
    render: (text, row) => (
      <div>
        <PCell>{row.drei}</PCell>
      </div>
    ),
  },
  {
    key: 4,
    className: 'two wide aligned',
    dataIndex: 'drei',
    title: 'Difficulty',
    render: (text) => <div className="ui label">{text}</div>,
  },
  {
    key: 5,
    className: 'two wide aligned',
    dataIndex: 'drei',
    title: 'Miner',
    render: (text) => <div className="ui label">{text}</div>,
  },
  {
    key: 6,
    className: 'two wide aligned',
    dataIndex: 'drei',
    title: 'Gas Limit',
    render: (text) => <div className="ui label">{text}</div>,
  },
  {
    key: 7,
    className: 'two wide aligned',
    dataIndex: 'drei',
    title: 'Age',
    render: (text) => <div className="ui label">{text}</div>,
  },
  {
    key: 8,
    className: 'two wide aligned',
    dataIndex: 'drei',
    title: 'Tx Count',
    render: (text) => <div className="ui label">{text}</div>,
  },
];
const dataSource = [
  { key: 1, ein: '80580', zwei: '0xe969a6fc05897123123', drei: 'Alichs' },
  { key: 2, ein: '80581', zwei: '0xe969a6fc05897124124', drei: 'Schwarz' },
];

function Detail({ match }) {
  const { epochid } = match.params;
  return (
    <div className="page-epoch-detail">
      <Wrapper>
        <HeadBar>
          <h1>Epoch</h1>
          <p>{epochid}</p>
        </HeadBar>
        <StyledTabel>
          <div className="ui fluid card">
            <div className="content">
              <DataList showHeader columns={columns} dataSource={dataSource} />
            </div>
          </div>
        </StyledTabel>
      </Wrapper>
    </div>
  );
}
Detail.propTypes = {
  match: PropTypes.objectOf(PropTypes.string),
};
Detail.defaultProps = {
  match: {},
};
export default Detail;
