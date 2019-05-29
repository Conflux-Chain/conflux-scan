import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';

function Countdown({ timestamp }) {
  let nowTime = moment(timestamp);
  const beforeTime = moment();

  let yearUnit = beforeTime.diff(nowTime, 'years');
  let monthUnit = beforeTime.subtract(yearUnit, 'years').diff(nowTime, 'months');
  let dayUnit = beforeTime.subtract(monthUnit, 'months').diff(nowTime, 'days');
  let hourUnit = beforeTime.subtract(dayUnit, 'days').diff(nowTime, 'hours');
  let minuteUnit = beforeTime.subtract(hourUnit, 'hours').diff(nowTime, 'minutes');
  let secondUnit = beforeTime.subtract(minuteUnit, 'minutes').diff(nowTime, 'seconds');

  let labelStr = '';
  if (yearUnit > 1) labelStr = `${yearUnit} 年前`;
  else if (monthUnit > 1) labelStr = `${monthUnit} 月前`;
  else if (dayUnit > 1) labelStr = `${dayUnit} 天前`;
  else labelStr = `${hourUnit} 小时${minuteUnit} 分钟 ${secondUnit} 秒 前`;

  return <span>{labelStr}</span>;
}
Countdown.propTypes = {
  timestamp: PropTypes.number,
};
Countdown.defaultProps = {
  timestamp: new Date().getTime(),
};

export default Countdown;
