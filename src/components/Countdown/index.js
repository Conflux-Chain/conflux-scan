import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { injectIntl, FormattedMessage } from 'react-intl';

const Text = styled.span`
  font-weight: 400;
  white-space: nowrap;
`;

function Countdown(props) {
  const {
    timestamp,
    intl: { locale },
    baseTime,
  } = props;
  let nowTime = moment(timestamp);
  const beforeTime = moment(baseTime);

  const yearUnit = beforeTime.diff(nowTime, 'years');
  const monthUnit = beforeTime.diff(nowTime, 'months');
  const dayUnit = beforeTime.diff(nowTime, 'days');

  const hourUnit = beforeTime.diff(nowTime, 'hours');
  const minuteUnit = beforeTime.subtract(hourUnit, 'hours').diff(nowTime, 'minutes');
  const secondUnit = beforeTime.subtract(minuteUnit, 'minutes').diff(nowTime, 'seconds');

  let labelStr = '';
  if (yearUnit > 1) labelStr = locale === 'zh' ? `${yearUnit} 年前` : `${yearUnit} ${yearUnit === 1 ? 'year' : 'years'} ago`;
  else if (monthUnit > 1) labelStr = locale === 'zh' ? `${monthUnit} 月前` : `${monthUnit} ${monthUnit === 1 ? 'month' : 'monthes'} ago`;
  else if (dayUnit > 1) labelStr = locale === 'zh' ? `${dayUnit} 天前` : `${dayUnit} ${dayUnit === 1 ? 'day' : 'days'} ago`;
  else
    labelStr =
      locale === 'zh'
        ? `${hourUnit} 小时 ${minuteUnit} 分钟 ${secondUnit} 秒前`
        : `${hourUnit} ${hourUnit <= 1 ? 'hr' : 'hrs'} ${minuteUnit} ${minuteUnit <= 1 ? 'min' : 'mins'} ${secondUnit} ${
            secondUnit <= 1 ? 'sec' : 'secs'
          } ago`;

  return <Text>{labelStr}</Text>;
}
Countdown.propTypes = {
  timestamp: PropTypes.number,
  intl: PropTypes.shape({
    lang: PropTypes.string,
    locale: PropTypes.string,
  }),
  baseTime: PropTypes.number.isRequired,
};
Countdown.defaultProps = {
  timestamp: new Date().getTime(),
  intl: { lang: 'zh' },
};

export default injectIntl(Countdown);
