import React, { Component } from 'react';
import styled from 'styled-components';
import Immutable from 'immutable';
import moreBlue from '../../assets/images/icons/more_blue.svg';
import moreRed from '../../assets/images/icons/more_red.svg';
import LineChart from '../../components/LineChart';
import { toFixed, toThousands } from '../../utils';

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const BlockContainer = styled.div`
  display: flex;
  width: 100%;
  > div:last-child {
    margin-right: 0px;
  }
`;
const Block = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 28px 24px;
  background: #ffffff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  margin-right: 16px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.87);
  .black-title {
    font-size: 16px;
  }
  .block-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    .block-value {
      font-size: 24px;
      line-height: 28px;
      font-weight: 700;
    }
    .block-unit {
      font-size: 14px;
      line-height: 18px;
      margin-left: 8px;
      color: rgba(0, 0, 0, 0.87);
    }
    .block-rate {
      display: flex;
      align-items: baseline;
    }
    .block-diff-up {
      font-size: 16px;
      color: #1e3de4;
    }
    .block-diff-down {
      font-size: 16px;
      color: #b00020;
    }
    .icon-arrow-up {
      display: inline-block;
      background-image: url(${moreBlue});
      background-size: 11px auto;
      background-repeat: no-repeat;
      transform: scaleX(-1) rotate(-90deg);
      width: 11px;
      height: 12px;
      margin-left: 6px;
    }
    .icon-arrow-down {
      display: inline-block;
      background-image: url(${moreRed});
      background-size: 11px auto;
      background-repeat: no-repeat;
      transform: scaleX(-1) rotate(90deg);
      width: 11px;
      height: 12px;
      margin-left: 6px;
    }
  }
`;

const LineContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 16px;
  .ui.card:nth-child(odd) {
    margin: 0 16px 16px 0;
  }
  .ui.card:nth-child(even) {
    margin: 0 0 16px 0;
  }
`;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: Immutable.fromJS({
        tps: [
          {
            value: 0.01609657947686117,
            time: 1559021323,
          },
          {
            value: 0.017953321364452424,
            time: 1559021884,
          },
          {
            value: 0.015238095238095238,
            time: 1559022410,
          },
          {
            value: 0.016227180527383367,
            time: 1559022903,
          },
          {
            value: 0.017977528089887642,
            time: 1559023352,
          },
        ],
        difficulty: [
          {
            value: 0.01609657947686117,
            time: 1559021323,
          },
          {
            value: 0.017953321364452424,
            time: 1559021884,
          },
          {
            value: 0.015238095238095238,
            time: 1559022410,
          },
          {
            value: 0.016227180527383367,
            time: 1559022903,
          },
          {
            value: 0.017977528089887642,
            time: 1559023352,
          },
        ],
        blockTime: [
          {
            value: 0.01609657947686117,
            time: 1559021323,
          },
          {
            value: 0.017953321364452424,
            time: 1559021884,
          },
          {
            value: 0.015238095238095238,
            time: 1559022410,
          },
          {
            value: 0.016227180527383367,
            time: 1559022903,
          },
          {
            value: 0.017977528089887642,
            time: 1559023352,
          },
        ],
        hashRate: [
          {
            value: 0.01609657947686117,
            time: 1559021323,
          },
          {
            value: 0.017953321364452424,
            time: 1559021884,
          },
          {
            value: 0.015238095238095238,
            time: 1559022410,
          },
          {
            value: 0.016227180527383367,
            time: 1559022903,
          },
          {
            value: 0.017977528089887642,
            time: 1559023352,
          },
        ],
      }),
      duration: Immutable.fromJS({
        tps: 'day',
        difficulty: 'hour',
        blockTime: 'month',
        hashRate: 'all',
      }),
      summary: Immutable.fromJS({
        tps: {
          val: 774.26,
          trend: 4.2999,
        },
        difficulty: {
          val: 200570130,
          trend: -13.8888,
        },
        blockNum: {
          val: 4.678,
          trend: 0,
        },
        hashRate: {
          val: 42.9544,
          trend: 16.11888,
        },
      }),
    };
  }

  componentDidMount() {
    console.log('mount');
  }

  onChangeDuration(name, value) {
    console.log(value);
    const { duration } = this.state;
    const newDuration = duration.set(name, value);
    this.setState({
      duration: newDuration,
    });
  }

  formatTrend(value) {
    if (isNaN(value)) {
      return `+ 0 %`;
    }
    if (value < 0) {
      return `- ${Math.abs(value)} %`;
    }
    return `+ ${value} %`;
  }

  mapKeyToTitle(key) {
    switch (key) {
      case 'tps':
        return 'TPS';
      case 'difficulty':
        return 'Difficulty';
      case 'blockTime':
        return 'Block Time';
      case 'hashRate':
        return 'Hash Rate';
      default:
        return 'TPS';
    }
  }

  renderSummary() {
    const { summary } = this.state;
    return summary
      .map((value, key) => {
        if (key !== 'hashRate') {
          return (
            <Block key={key}>
              <span className="block-title">{this.mapKeyToTitle(key)}</span>
              <div className="block-content">
                <span className="block-value">
                  {key === 'difficulty' ? toThousands(summary.getIn([key, 'val'])) : toFixed(summary.getIn([key, 'val']), 2)}
                </span>
                <span className={value.get('trend') >= 0 ? 'block-diff-up' : 'block-diff-down'}>
                  {this.formatTrend(toFixed(summary.getIn([key, 'trend']), 2))}
                  <span className={value.get('trend') >= 0 ? 'icon-arrow-up' : 'icon-arrow-down'} />
                </span>
              </div>
            </Block>
          );
        }
        return (
          <Block key={key}>
            <span className="block-title">{this.mapKeyToTitle(key)}</span>
            <div className="block-content">
              <span className="block-rate">
                <span className="block-value">{toFixed(summary.getIn([key, 'val']), 2)}</span>
                <span className="block-unit">MH/s</span>
              </span>
              <span className={value.get('trend') >= 0 ? 'block-diff-up' : 'block-diff-down'}>
                {this.formatTrend(toFixed(summary.getIn([key, 'trend']), 2))}
                <span className={value.get('trend') >= 0 ? 'icon-arrow-up' : 'icon-arrow-down'} />
              </span>
            </div>
          </Block>
        );
      })
      .toList();
  }

  render() {
    const { data, duration } = this.state;
    return (
      <Container>
        <BlockContainer>{this.renderSummary()}</BlockContainer>
        <LineContainer>
          <LineChart
            title="TPS"
            data={data.get('tps').toJS()}
            duration={duration.get('tps')}
            onChangeDuration={(value) => this.onChangeDuration('tps', value)}
          />
          <LineChart
            title="Difficulty"
            data={data.get('difficulty').toJS()}
            duration={duration.get('difficulty')}
            onChangeDuration={(value) => this.onChangeDuration('difficulty', value)}
          />
          <LineChart
            title="Block Time"
            data={data.get('blockTime').toJS()}
            duration={duration.get('blockTime')}
            onChangeDuration={(value) => this.onChangeDuration('blockTime', value)}
          />
          <LineChart
            title="Hash Rate"
            data={data.get('hashRate').toJS()}
            duration={duration.get('hashRate')}
            onChangeDuration={(value) => this.onChangeDuration('hashRate', value)}
          />
        </LineContainer>
      </Container>
    );
  }
}
export default Home;
