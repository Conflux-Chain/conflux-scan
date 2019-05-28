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

const StyledTabel = styled.table`
  margin-top: 20px;
  width: 100%;
  tr > td {
    padding-left: 3.2em !important;
    border: none !important;
    font-size: 16px !important;
  }

  &.right {
    margin-left: 16px;
  }
  td.collapsing {
    font-weight: bold !important;
    padding: 1.2em 5em 1.2em 2em !important;
    background: #edf2f9 !important;
  }
`;

const HeadBar = styled.div`
  width: 100%;
  font-size: 16px;
  margin-bottom: 10px;
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

const IconFace = styled.div`
  margin-left: 16px;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 16px;
    height: 16px;
  }
  &:hover {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.54);
    svg {
      color: #fff;
    }
  }
`;

const TabZone = styled.div`
  position: relative;
  width: 100%;
`;

const PCell = styled.div`
  margin: 0 !important;
`;

const TabWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
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
      </div>
    ),
  },
  {
    key: 3,
    dataIndex: 'drei',
    title: 'Blocks',
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
    title: 'Blocks',
    render: (text) => <div className="ui label">{text}</div>,
  },
];
const dataSource = [
  { key: 1, ein: '80580', zwei: '0xe969a6fc05897123123', drei: 'Alichs' },
  { key: 2, ein: '80581', zwei: '0xe969a6fc05897124124', drei: 'Schwarz' },
];

function Detail({ match }) {
  const { blockhash } = match.params;
  return (
    <div className="page-block-detail">
      <Wrapper>
        <HeadBar>
          <h1>Block</h1>
          <p>{blockhash}</p>
        </HeadBar>
        <StyledTabel className="ui basic padded table">
          <tbody className="">
            <tr className="">
              <td className="collapsing">Block Height:</td>
              <td className="">22</td>
            </tr>
            <tr className="">
              <td className="collapsing">Epoch Number:</td>
              <td className="">15</td>
            </tr>
            <tr className="">
              <td className="collapsing">Difficulty:</td>
              <td className="">12</td>
            </tr>
            <tr className="">
              <td className="collapsing">Miner:</td>
              <td className="">11</td>
            </tr>
            <tr className="">
              <td className="collapsing">Block Hash:</td>
              <td className="">11</td>
            </tr>
            <tr className="">
              <td className="collapsing">Present Hash:</td>
              <td className="">11</td>
            </tr>
            <tr className="">
              <td className="collapsing">Nonce:</td>
              <td className="">11</td>
            </tr>
            <tr className="">
              <td className="collapsing">Gas Limit:</td>
              <td className="">11</td>
            </tr>
            <tr className="">
              <td className="collapsing">Time:</td>
              <td className="">11</td>
            </tr>
            <tr className="">
              <td className="collapsing">Size:</td>
              <td className="">11</td>
            </tr>
          </tbody>
        </StyledTabel>

        <TabZone>
          <div className="ui attached tabular menu">
            <a className="active item">Transactions</a>
            <a className="item">Referee Block</a>
          </div>
          <div className="ui bottom attached segment active tab">
            <div className="ui fluid card">
              <div className="content">
                <DataList showHeader columns={columns} dataSource={dataSource} />
              </div>
            </div>
            <TabWrapper>
              <Pagination
                prevItem={{
                  'aria-label': 'Previous item',
                  content: 'Previous',
                }}
                nextItem={{
                  'aria-label': 'Next item',
                  content: 'Next',
                }}
                defaultActivePage={5}
                totalPages={10}
              />
            </TabWrapper>
          </div>
          <div className="ui bottom attached segment tab">Tab 2 Content</div>
          <div className="ui bottom attached segment tab">Tab 3 Content</div>
        </TabZone>
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
