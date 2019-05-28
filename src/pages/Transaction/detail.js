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

function Detail({ match }) {
  const { txnhash } = match.params;
  return (
    <div className="page-transaction-detail">
      <Wrapper>
        <HeadBar>
          <h1>Transaction</h1>
          <p>{txnhash}</p>
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
