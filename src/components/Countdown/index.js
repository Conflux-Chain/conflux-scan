import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { injectIntl, FormattedMessage } from 'react-intl';

function Countdown(props) {
  const {
    timestamp,
    intl: { locale },
  } = props;
  let nowTime = moment(timestamp);
  const beforeTime = moment();

  let yearUnit = beforeTime.diff(nowTime, 'years');
  let monthUnit = beforeTime.subtract(yearUnit, 'years').diff(nowTime, 'months');
  let dayUnit = beforeTime.subtract(monthUnit, 'months').diff(nowTime, 'days');
  let hourUnit = beforeTime.subtract(dayUnit, 'days').diff(nowTime, 'hours');
  let minuteUnit = beforeTime.subtract(hourUnit, 'hours').diff(nowTime, 'minutes');
  let secondUnit = beforeTime.subtract(minuteUnit, 'minutes').diff(nowTime, 'seconds');

  let labelStr = '';
  if (yearUnit > 1) labelStr = locale === 'zh' ? `${yearUnit}年前` : `${yearUnit} years ago`;
  else if (monthUnit > 1) labelStr = locale === 'zh' ? `${monthUnit}月前` : `${monthUnit} monthes ago`;
  else if (dayUnit > 1) labelStr = locale === 'zh' ? `${dayUnit}天前` : `${dayUnit} days ago`;
  else
    labelStr =
      locale === 'zh' ? `${hourUnit}小时${minuteUnit}分钟${secondUnit}秒前` : `${hourUnit} hrs ${minuteUnit} min ${secondUnit} secs ago`;

  return <span>{labelStr}</span>;
}
Countdown.propTypes = {
  timestamp: PropTypes.number,
  intl: PropTypes.shape({
    lang: PropTypes.string,
  }),
};
Countdown.defaultProps = {
  timestamp: new Date().getTime(),
  intl: { lang: 'zh' },
};

export default injectIntl(Countdown);
