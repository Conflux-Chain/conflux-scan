import React, { Component } from 'react';
import styled from 'styled-components';
import Immutable from 'immutable';
import superagent from 'superagent';
import { injectIntl, FormattedMessage, intlShape } from 'react-intl';
import moreBlue from '../../assets/images/icons/more_blue.svg';
import moreRed from '../../assets/images/icons/more_red.svg';
import LineChart from '../../components/LineChart';
import { toFixed, toThousands, i18n } from '../../utils';
import dashboard1 from '../../assets/images/dashboard1.png';
import dashboard2 from '../../assets/images/dashboard2.png';
import dashboard3 from '../../assets/images/dashboard3.png';
import dashboard4 from '../../assets/images/dashboard4.png';
import media from '../../globalStyles/media';
import { reqStatistics, reqStatisticsItem } from '../../utils/api';
import noticeIcon from '../../assets/images/icons/notice-icon.svg';
import { isMainnet } from '../../constants';

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const BlockContainer = styled.div`
  display: flex;
  width: 100%;
  > div:last-child {
    margin-right: 0;
  }
  ${media.pad`
    flex-direction: column;
    > div {
      margin-right: 0;
    }
  `}
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
  background-image: url(${(props) => props.url});
  background-size: ${(props) => props.width} ${(props) => props.height};
  background-position: top right;
  background-repeat: no-repeat;
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
      font-size: 15px;
      line-height: 18px;
      margin-left: 8px;
      color: rgba(0, 0, 0, 0.87);
    }
    .block-value-unit {
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
  ${media.pad`
    margin-bottom: 16px;
  `}
`;

const LineContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 16px;
  .ui.card {
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
    border: none;
    .header {
      padding-top: 2px;
    }
  }
  .ui.card:nth-child(odd) {
    margin: 0 16px 16px 0;
  }
  .ui.card:nth-child(even) {
    margin: 0 0 16px 0;
  }
  ${media.pad`
    .ui.card:nth-child(odd) {
      margin: 0 0 16px 0;
    }
  `}
`;

const NoticeDiv = styled.div`
  padding: 12px 24px;
  margin-top: 16px;
  background:rgba(255,255,255,1);
  box-shadow:0px 1px 3px 0px rgba(0,0,0,0.12);
  border-radius:4px;
  color: #000;
  display: flex;

  > .notice-content {
    flex: 1;
    font-size: 16px;
    line-height: 28px;
  }

  > i {
    background-image: url("${noticeIcon}");
    width: 18px;
    height: 20px;
    flex-shrink: 0;
    margin-right: 16px;
    margin-top: 5px;
  }

  a {
    color: #1E3DE4;
    margin-left: 5px;
  }
`;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: Immutable.fromJS({
        tps: [],
        difficulty: [],
        blockTime: [],
        hashRate: [],
      }),
      duration: Immutable.fromJS({
        tps: 'day',
        difficulty: 'day',
        blockTime: 'day',
        hashRate: 'day',
      }),
      summary: Immutable.fromJS({}),
      showMaintaining: false,
    };
  }

  componentDidMount() {
    this.fetchStatistic();
    this.fetchLineDataAll();
  }

  onChangeDuration(name, value) {
    const { duration } = this.state;
    const newDuration = duration.set(name, value);
    this.setState({
      duration: newDuration,
    });
    this.fetchLineData(name, value);
  }

  async fetchStatistic() {
    const { code, result } = await reqStatistics({
      span: 24 * 60 * 60,
    });
    if (!code) {
      const data = {};
      Object.keys(result).forEach((key) => {
        data[key] = {
          trend: result[key].trend,
          val: result[key].value,
        };
      });
      this.setState({
        summary: Immutable.fromJS(data),
      });
    }
  }

  async fetchLineDataAll(duration = 'day') {
    const { code, result = {} } = await reqStatisticsItem({
      duration,
    });
    if (code === 0) {
      const tpsList = result.list.map((v) => ({ time: v.timestamp, value: v.tps }));
      const difficultyList = result.list.map((v) => ({ time: v.timestamp, value: v.difficulty }));
      const blockTimeList = result.list.map((v) => ({ time: v.timestamp, value: v.blockTime }));
      const hashRateList = result.list.map((v) => ({ time: v.timestamp, value: v.hashRate }));

      const data = Immutable.fromJS({
        tps: tpsList,
        difficulty: difficultyList,
        blockTime: blockTimeList,
        hashRate: hashRateList,
      });

      this.setState({
        data,
      });

      if (tpsList.length === 0) {
        this.setState({
          showMaintaining: true,
        });
      }
    }
    return result;
  }

  async fetchLineData(name, duration) {
    const { code, result } = await reqStatisticsItem({
      duration,
    });
    let { data } = this.state;
    if (!code) {
      const list = result.list.map((v) => {
        return {
          time: v.timestamp,
          value: v[name],
        };
      });
      data = data.set(name, Immutable.fromJS(list));
      this.setState({
        data,
      });
    }
    return result;
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

  render() {
    const { data, duration, summary, showMaintaining } = this.state;
    const { intl } = this.props;
    return (
      <Container>
        {showMaintaining && (
          <div className="message message-important-light">
            <span>{intl.formatMessage({ id: 'system maintaining, please visit later' })}</span>
          </div>
        )}
        <BlockContainer>
          <Block key="tps" width="216px" height="44px" url={dashboard1}>
            <span className="block-title">
              <FormattedMessage id="app.pages.dashboard.tps" />
            </span>
            <div className="block-content">
              <span className="block-value">{toFixed(summary.getIn(['tps', 'val']), summary.getIn(['tps', 'val']) > 1 ? 2 : 6)}</span>
              <span className={summary.getIn(['tps', 'trend']) >= 0 ? 'block-diff-up' : 'block-diff-down'}>
                {this.formatTrend(toFixed(summary.getIn(['tps', 'trend']), 2))}
                <span className={summary.getIn(['tps', 'trend']) >= 0 ? 'icon-arrow-up' : 'icon-arrow-down'} />
              </span>
            </div>
          </Block>
          <Block key="difficulty" width="174px" height="58px" url={dashboard2}>
            <span className="block-title">
              <FormattedMessage id="app.pages.dashboard.difficulty" />
            </span>
            <div className="block-content">
              <span className="block-value">{toThousands(toFixed(summary.getIn(['difficulty', 'val']), 0))}</span>
              <span className={summary.getIn(['difficulty', 'trend']) >= 0 ? 'block-diff-up' : 'block-diff-down'}>
                {this.formatTrend(toFixed(summary.getIn(['difficulty', 'trend']), 2))}
                <span className={summary.getIn(['difficulty', 'trend']) >= 0 ? 'icon-arrow-up' : 'icon-arrow-down'} />
              </span>
            </div>
          </Block>
          <Block key="blockTime" width="155px" height="58px" url={dashboard3}>
            <span className="block-title">
              <FormattedMessage id="app.pages.dashboard.blockTime" />
            </span>
            <div className="block-content">
              <span className="block-value-unit">
                <span className="block-value">{toFixed(summary.getIn(['blockTime', 'val']), 2)}</span>
                <span className="block-unit">
                  <FormattedMessage id="app.pages.dashboard.blockTimeUnit" />
                </span>
              </span>
              <span className={summary.getIn(['blockTime', 'trend']) >= 0 ? 'block-diff-up' : 'block-diff-down'}>
                {this.formatTrend(toFixed(summary.getIn(['blockTime', 'trend']), 2))}
                <span className={summary.getIn(['blockTime', 'trend']) >= 0 ? 'icon-arrow-up' : 'icon-arrow-down'} />
              </span>
            </div>
          </Block>
          <Block key="hashRate" width="151px" height="59px" url={dashboard4}>
            <span className="block-title">
              <FormattedMessage id="app.pages.dashboard.hashRate" />
            </span>
            <div className="block-content">
              <span className="block-value">{toFixed(summary.getIn(['hashRate', 'val']), 2)}</span>
              <span className={summary.getIn(['hashRate', 'trend']) >= 0 ? 'block-diff-up' : 'block-diff-down'}>
                {this.formatTrend(toFixed(summary.getIn(['hashRate', 'trend']), 2))}
                <span className={summary.getIn(['hashRate', 'trend']) >= 0 ? 'icon-arrow-up' : 'icon-arrow-down'} />
              </span>
            </div>
          </Block>
        </BlockContainer>
        {!isMainnet ? (
          <NoticeDiv>
            <i />
            <div className="notice-content">
              <div>{i18n('app.pages.index.notice1')}</div>
              <div>{i18n('app.pages.index.notice2')}</div>
            </div>
          </NoticeDiv>
        ) : null}
        <LineContainer>
          <LineChart
            title={intl.formatMessage({ id: 'app.pages.dashboard.tps' })}
            data={data.get('tps').toJS()}
            duration={duration.get('tps')}
            echartOpt={{
              'grid.left': '50px',
            }}
            onChangeDuration={(value) => this.onChangeDuration('tps', value)}
          />
          <LineChart
            title={intl.formatMessage({ id: 'app.pages.dashboard.difficulty' })}
            data={data.get('difficulty').toJS()}
            duration={duration.get('difficulty')}
            echartOpt={{
              'grid.left': '80px',
            }}
            onChangeDuration={(value) => this.onChangeDuration('difficulty', value)}
          />
          <LineChart
            title={intl.formatMessage({ id: 'app.pages.dashboard.blockTime' })}
            data={data.get('blockTime').toJS()}
            duration={duration.get('blockTime')}
            onChangeDuration={(value) => this.onChangeDuration('blockTime', value)}
          />
          <LineChart
            title={intl.formatMessage({ id: 'app.pages.dashboard.hashRate' })}
            data={data.get('hashRate').toJS()}
            duration={duration.get('hashRate')}
            echartOpt={{
              'grid.left': '75px',
            }}
            onChangeDuration={(value) => this.onChangeDuration('hashRate', value)}
          />
        </LineContainer>
      </Container>
    );
  }
}

Home.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(Home);
