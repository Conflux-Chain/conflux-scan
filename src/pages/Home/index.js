import React, { Component } from 'react';
import styled from 'styled-components';
import Immutable from 'immutable';
import moreBlue from '../../assets/images/icons/more_blue.svg';
import moreRed from '../../assets/images/icons/more_red.svg';
import LineChart from '../../components/LineChart';

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const BlockContainer = styled.div`
  display: flex;
  width: 100%;
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
      color: #311b92;
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
      }),
      duration: Immutable.fromJS({
        tps: 'day',
      }),
    };
    this.onChangeTpsDuration = this.onChangeTpsDuration.bind(this);
  }

  componentDidMount() {
    console.log('mount');
  }

  onChangeTpsDuration(tpsDuration) {
    console.log(tpsDuration);
    const { duration } = this.state;
    const newDuration = duration.set('tps', tpsDuration);
    this.setState({
      duration: newDuration,
    });
  }

  render() {
    const { data, duration } = this.state;
    return (
      <Container>
        <BlockContainer>
          <Block>
            <span className="block-title">TPS</span>
            <div className="block-content">
              <span className="block-value">774.26</span>
              <span className="block-diff-up">
                + 4.2 %
                <span className="icon-arrow-up" />
              </span>
            </div>
          </Block>
          <Block>
            <span className="block-title">Difficulty</span>
            <div className="block-content">
              <span className="block-value">200,570,130</span>
              <span className="block-diff-down">
                - 13.88 %
                <span className="icon-arrow-down" />
              </span>
            </div>
          </Block>
          <Block>
            <span className="block-title">Block Time</span>
            <div className="block-content">
              <span className="block-value">4.67</span>
              <span className="block-diff-up">
                + 0 %
                <span className="icon-arrow-up" />
              </span>
            </div>
          </Block>
          <Block>
            <span className="block-title">Hash Rate</span>
            <div className="block-content">
              <span className="block-rate">
                <span className="block-value">42.95</span>
                <span className="block-unit">MH/s</span>
              </span>
              <span className="block-diff-up">
                + 16.11 %
                <span className="icon-arrow-up" />
              </span>
            </div>
          </Block>
        </BlockContainer>
        <LineContainer>
          <LineChart title="TPS" data={data.get('tps').toJS()} duration={duration.get('tps')} onChangeDuration={this.onChangeTpsDuration} />
        </LineContainer>
      </Container>
    );
  }
}
export default Home;
