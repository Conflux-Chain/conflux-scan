import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { i18n } from '../../utils';

const Wrapper = styled.div`
  .risk-svg {
    display: inline-block;
    &.lv0 {
      background: linear-gradient(270deg, rgba(89, 191, 156, 1) 0%, rgba(229, 244, 86, 1) 100%);
    }
    &.lv1 {
      background: linear-gradient(270deg, rgba(228, 247, 88, 1) 0%, rgba(255, 196, 42, 1) 100%);
    }
    &.lv2 {
      background: linear-gradient(270deg, rgba(255, 208, 65, 1) 0%, rgba(236, 96, 87, 1) 100%);
    }
    &.lv3 {
      background: linear-gradient(270deg, rgba(236, 96, 87, 1) 0%, rgba(141, 58, 74, 1) 100%);
    }
  }

  .risk-wrapper {
    position: relative;
    display: inline-block;
  }

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }
  .risk-svg-last-circle {
    animation: blinker 1s linear infinite;
  }

  .risk-status {
    vertical-align: middle;
    margin-left: 8px;
    font-size: 16px;
    font-weight: 600;
    display: inline-block;
    &.lv0 {
      color: #59bf9c;
    }
    &.lv1 {
      color: #bfde5b;
    }
    &.lv2 {
      color: #ffc324;
    }
    &.lv3 {
      color: #ec6057;
    }
  }
`;

function SecurityLevel(props) {
  const { riskLevel } = props;
  let securityLevel = '';
  if (riskLevel === 'lv0') {
    securityLevel = i18n('security.High');
  } else if (riskLevel === 'lv1') {
    securityLevel = i18n('security.Medium');
  } else if (riskLevel === 'lv2') {
    securityLevel = i18n('security.Low');
  } else if (riskLevel === 'lv3') {
    securityLevel = i18n('security.Very low');
  }

  const riskSvg = (
    <svg viewBox="0 0 50 10" width="50px" height="10px" className={`risk-svg ${riskLevel}`}>
      <defs>
        <mask id="mask" x="0" y="0" width="50" height="10">
          <rect x="-5" y="-5" width="55" height="15" fill="#fff" />
          <circle cx="5" cy="5" r="5" />
          <circle cx="18" cy="5" r="5" />
          <circle cx="31" cy="5" r="5" />
          <circle cx="43" cy="5" r="5" className="risk-svg-last-circle" />
        </mask>
      </defs>
      <rect x="0" y="0" width="50" height="10" mask="url(#mask)" fill="#fff" />
    </svg>
  );

  return (
    <Wrapper>
      <div className="risk-wrapper">
        {riskSvg}
        <div className="risk-opacity-filter" />
      </div>
      <div className={`risk-status ${riskLevel}`}>{securityLevel}</div>
    </Wrapper>
  );
}

SecurityLevel.propTypes = {
  riskLevel: PropTypes.string.isRequired,
};

export default SecurityLevel;
