import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import media from '../../globalStyles/media';

const SingleLine = styled.div`
  .wrap {
    display: flex;
    font-size: 16px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.87);
    line-height: 19px;
    align-items: center;
    .ellipsis {
      text-align: left;
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
      font-weight: 600;
      color: rgba(64, 90, 231, 1);
      &:hover {
        font-weight: 700;
        color: rgba(30, 61, 228, 1);
      }
    }
    .long {
      max-width: 280px;
      ${media.mobile`
        max-width: 200px;
      `}
    }
  }
`;

const PivotTag = styled.span`
  /* margin-top: 3px; */
  font-size: 12px;
  background: #67a312;
  color: #fff;
  border-radius: 2px;
  padding: 0px 5px;
  height: 14px;
  font-weight: 400;
  line-height: 14px;
`;

const InOutTag = styled.span`
  /* margin-top: 3px; */
  font-size: 12px;
  background: rgba(141, 136, 128, 1);
  color: #fff;
  border-radius: 2px;
  height: 14px;
  padding: 0px 5px;
  font-weight: 400;
  line-height: 14px;
`;

const UnitTag = styled.i`
  font-style: normal;
  margin-left: 5px;
  font-size: 16px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.87);
`;

const PrefixTag = styled.i`
  font-style: normal;
  margin-right: 5px;
  font-size: 14px !important;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.87);
  margin-right: 8px;
  flex: none;
`;

function EllipsisLine({ intl, prefix, unit, is2ndLine, isPivot, isLong, linkTo, text, textInout }) {
  const baseStyle = is2ndLine
    ? { background: 'transparent', margin: 0, marginTop: '2px', padding: 0 }
    : { background: 'transparent', margin: 0, padding: 0 };
  let tooltip;
  if (typeof text === 'function') {
    tooltip = text((id) => intl.formatMessage({ id }));
  } else {
    tooltip = text;
  }
  return (
    <div style={baseStyle} data-tooltip={tooltip} data-position="top center">
      <SingleLine>
        <div className="wrap">
          {prefix && <PrefixTag>{prefix}</PrefixTag>}
          {!linkTo ? (
            <div className={isLong ? 'ellipsis long' : 'ellipsis'}>{text}</div>
          ) : (
            <div className={isLong ? 'ellipsis link long' : 'ellipsis link'}>
              <Link to={linkTo}>{tooltip}</Link>
            </div>
          )}
          {isPivot && <PivotTag>Pivot</PivotTag>}
          {textInout && <InOutTag>{textInout}</InOutTag>}
          <UnitTag>{unit}</UnitTag>
        </div>
      </SingleLine>
    </div>
  );
}
EllipsisLine.propTypes = {
  prefix: PropTypes.string,
  linkTo: PropTypes.string,
  unit: PropTypes.string,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  textInout: PropTypes.string,
  isPivot: PropTypes.bool,
  isLong: PropTypes.bool,
  is2ndLine: PropTypes.bool,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};
EllipsisLine.defaultProps = {
  prefix: '',
  linkTo: null,
  unit: null,
  text: '',
  textInout: '',
  isPivot: false,
  isLong: false,
  is2ndLine: false,
};

export default injectIntl(EllipsisLine);
