import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const SingleLine = styled.div`
  .wrap {
    display: flex;
    font-size: 16px;
    .ellipsis {
      width: 134px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

const PivotTag = styled.span`
  margin-top: 3px;
  font-size: 12px;
  background: #67a312;
  color: #fff;
  border-radius: 2px;
  padding: 1px 5px;
  height: 17px;
  font-weight: 400;
`;
const InOutTag = styled.span`
  margin-top: 3px;
  font-size: 12px;
  background: #67a312;
  color: #fff;
  border-radius: 2px;
  padding: 1px 5px;
  height: 17px;
  font-weight: 400;
`;

function EllipsisLine({ isPivot, text, textInout }) {
  return (
    <SingleLine>
      <div className="wrap">
        <div className="ellipsis">{text}</div>
        {isPivot && <PivotTag>Pivot</PivotTag>}
        {textInout && <InOutTag>{textInout}</InOutTag>}
      </div>
    </SingleLine>
  );
}
EllipsisLine.propTypes = {
  text: PropTypes.string,
  textInout: PropTypes.string,
  isPivot: PropTypes.bool,
};
EllipsisLine.defaultProps = {
  text: '',
  textInout: '',
  isPivot: false,
};

export default EllipsisLine;
