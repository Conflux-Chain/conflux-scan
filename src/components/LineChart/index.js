import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import echarts from 'echarts';
import set from 'lodash/set';
import { toFixed, changeUnit } from '../../utils';
import media from '../../globalStyles/media';

const numeral = require('numeral');

const Duration = styled.div`
  width: 56px;
  height: 24px;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.16);
  background-color: #fff;
  margin-right: 16px;
  text-align: center;
  color: rgba(0, 0, 0, 0.87);
  cursor: pointer;
  &.active {
    background-color: #1e3de4;
    color: rgba(255, 255, 255, 1);
  }
  margin-top: 16px;
`;

function DurationButton({ text, duration, isActive, onChangeDuration }) {
  return (
    <Duration onClick={() => onChangeDuration(duration)} className={isActive ? 'active' : ''}>
      {text}
    </Duration>
  );
}
DurationButton.propTypes = {
  text: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onChangeDuration: PropTypes.func.isRequired,
};
DurationButton.defaultProps = {
  isActive: false,
};

const Container = styled.div`
  width: calc((100% - 16px) / 2) !important;
  ${media.pad`
    width: 100% !important;
  `}
`;

const DurationContainer = styled.div`
  display: flex;
  justify-content: center;
  > div:last-child {
    margin-right: 0px;
  }
`;

class LineChart extends Component {
  componentDidMount() {
    const { data } = this.props;
    this.renderChart(data);
  }

  componentWillReceiveProps(nextProps) {
    const { data, duration } = this.props;
    if (nextProps.data !== data || nextProps.duration !== duration) {
      this.renderChart(nextProps.data);
    }
  }

  formatTime(data) {
    return data.map((item) => {
      return moment(item.time * 1000).format('YYYY/M/D') + '\n' + moment(item.time * 1000).format('HH:mm');
    });
  }

  renderChart(data) {
    const { title, echartOpt } = this.props;
    const myChart = echarts.init(document.getElementById(title + 'chart'));
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          animation: false,
          label: {
            backgroundColor: '#ccc',
            borderColor: '#aaa',
            borderWidth: 1,
            shadowBlur: 0,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            textStyle: {
              color: '#222',
            },
          },
        },
        formatter: (params) => {
          return (
            moment(params[0].data.time * 1000).format('YYYY/M/D HH:mm') +
            '<br />' +
            toFixed(params[0].data.value, params[0].data.value > 1 ? 3 : 6)
          );
        },
      },
      grid: {
        left: '10%',
      },
      xAxis: {
        type: 'category',
        data: this.formatTime(data),
        axisLabel: {
          interval: (index, value) => {
            const tickNum = window.innerWidth < 992 ? 3 : 5;
            const length = data.length;
            const interval = Math.floor(length / tickNum);

            if (interval === 1) {
              return true;
            }
            if (index % interval === 0 || index === length) {
              return true;
            }
            return false;
          },
          color: 'rgba(0, 0, 0, 0.87)',
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(0, 0, 0, 0.12)',
          },
        },
        splitLine: {
          show: false,
        },
        boundaryGap: false,
      },
      yAxis: {
        type: 'value',
        boundaryGap: false,
        axisLabel: {
          color: 'rgba(0, 0, 0, 0.87)',
          formatter: (value, index) => {
            return changeUnit(numeral(value).format('0.0a'));
          },
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(0, 0, 0, 0.12)',
          },
        },
        splitLine: {
          show: false,
        },
      },
      color: ['#1E3DE4'],
      series: [
        {
          name: '',
          type: 'line',
          showSymbol: false,
          hoverAnimation: false,
          data: data,
        },
      ],
    };
    if (echartOpt) {
      Object.keys(echartOpt).forEach((key) => {
        const val = echartOpt[key];
        set(option, key, val);
      });
    }
    myChart.setOption(option);
  }

  render() {
    const { title, duration, onChangeDuration } = this.props;
    const durationList = [
      {
        text: '1H',
        duration: 'hour',
      },
      {
        text: '1D',
        duration: 'day',
      },
      {
        text: '1M',
        duration: 'month',
      },
      {
        text: 'ALL',
        duration: 'all',
      },
    ];
    return (
      <Container className="ui card">
        <div className="content">
          <div className="header">{title}</div>
        </div>
        <div className="content">
          <DurationContainer>
            {durationList.map((item) => {
              return (
                <DurationButton
                  key={item.duration}
                  text={item.text}
                  duration={item.duration}
                  isActive={duration === item.duration}
                  onChangeDuration={onChangeDuration}
                />
              );
            })}
          </DurationContainer>
          <div id={title + 'chart'} style={{ width: '100%', height: '250px' }} />
        </div>
      </Container>
    );
  }
}
LineChart.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  duration: PropTypes.string,
  onChangeDuration: PropTypes.func.isRequired,
  echartOpt: PropTypes.shape({}),
};
LineChart.defaultProps = {
  duration: 'day',
  echartOpt: {},
};

export default LineChart;
