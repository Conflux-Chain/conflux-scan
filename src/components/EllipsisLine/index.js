import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const SingleLine = styled.div`
  .wrap {
    display: flex;
    font-size: 16px;
    .ellipsis {
      max-width: 114px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: rgba(0, 0, 0, 0.87);
      font-style: normal;
      font-weight: 400;
    }
    .link {
      color: #405ae7;
    }
    .long {
      max-width: 204px;
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
const UnitTag = styled.i`
  font-style: normal;
  margin-left: 5px;
  font-weight: normal;
`;
const PrefixTag = styled.i`
  font-style: normal;
  margin-right: 5px;
  font-weight: normal;
`;

function EllipsisLine({ prefix, unit, isPivot, isLong, linkTo, text, textInout }) {
  return (
    <SingleLine>
      <div className="wrap">
        {prefix && <PrefixTag>{prefix}</PrefixTag>}
        {!linkTo ? (
          <div className={isLong ? 'ellipsis long' : 'ellipsis'}>{text}</div>
        ) : (
          <div className={isLong ? 'ellipsis link long' : 'ellipsis link'}>
            <Link to={linkTo}>{text}</Link>
          </div>
        )}
        {isPivot && <PivotTag>Pivot</PivotTag>}
        {textInout && <InOutTag>{textInout}</InOutTag>}
        <UnitTag>{unit}</UnitTag>
      </div>
    </SingleLine>
  );
}
EllipsisLine.propTypes = {
  prefix: PropTypes.string,
  linkTo: PropTypes.string,
  unit: PropTypes.string,
  text: PropTypes.string,
  textInout: PropTypes.string,
  isPivot: PropTypes.bool,
  isLong: PropTypes.bool,
};
EllipsisLine.defaultProps = {
  prefix: '',
  linkTo: null,
  unit: null,
  text: '',
  textInout: '',
  isPivot: false,
  isLong: false,
};

export default EllipsisLine;
