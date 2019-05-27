import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const SingleLine = styled.div`
  .wrap {
    display: flex;
    .ellipsis {
      width: 134px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

function EllipsisLine({ isPivot, text }) {
  return (
    <SingleLine>
      <p className="wrap">
        <div className="ellipsis">{text}</div>
        {isPivot && <div className="ui mini green label">Pivot</div>}
      </p>
    </SingleLine>
  );
}
EllipsisLine.propTypes = {
  text: PropTypes.string,
  isPivot: PropTypes.bool,
};
EllipsisLine.defaultProps = {
  text: '',
  isPivot: false,
};

export default EllipsisLine;
