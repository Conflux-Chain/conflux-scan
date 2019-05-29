import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import echarts from 'echarts';
import { toFixed } from '../../utils';

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
  width: 592px !important;
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
    this.renderChart();
  }

  formatTime() {
    const { formatString, data } = this.props;
    return data.map((item) => moment(item.time * 1000).format(formatString));
  }

  renderChart() {
    const { formatString, data, title } = this.props;
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
          return moment(params[0].data.time * 1000).format(formatString) + '<br />' + toFixed(params[0].data.value, 3);
        },
      },
      xAxis: {
        type: 'category',
        data: this.formatTime(),
        splitLine: {
          show: false,
        },
        boundaryGap: false,
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: false,
        },
      },
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
          <div id={title + 'chart'} style={{ width: '540px', height: '250px' }} />
        </div>
      </Container>
    );
  }
}
LineChart.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  duration: PropTypes.string,
  formatString: PropTypes.string,
  onChangeDuration: PropTypes.func.isRequired,
};
LineChart.defaultProps = {
  duration: 'day',
  formatString: 'YYYY/MM/DD',
};

export default LineChart;
