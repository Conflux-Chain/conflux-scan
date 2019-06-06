import React, { Component } from 'react';
// import styled from 'styled-components';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

/* eslint react/destructuring-assignment: 0 */
class NodeMap extends Component {
  constructor(...args) {
    super(...args);
    this.setRefWrap = (c) => {
      this.refWrap = c;
    };
    const intlName1 = () => {
      return this.props.intl.formatMessage({
        id: 'app.comp.nodeMap.scatter.name',
      });
    };
    const { scatterData } = this.props;

    this.option = {
      // title: {
      //   text: 'World Population (2010)',
      //   subtext: 'from United Nations, Total population, both sexes combined, as of 1 July (thousands)',
      //   sublink: 'http://esa.un.org/wpp/Excel-Data/population.htm',
      //   left: 'center',
      //   top: 'top'
      // },
      tooltip: {
        trigger: 'item',
        formatter: function(params) {
          let value = (params.value + '').split('.');
          value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,') + '.' + value[1];
          return params.seriesName + '<br/>' + params.name + ' : ' + value;
        },
      },
      toolbox: {
        show: false,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      geo: {
        map: 'world',
        label: {
          show: false,
        },
        roam: true,
        itemStyle: {
          areaColor: '#ece9f7',
          color: '#ece9f7',
          borderColor: '#333',
        },
        emphasis: {
          label: { show: false },
          itemStyle: {
            areaColor: '#ece9f7',
            color: '#ece9f7',
            borderColor: '#333',
          },
        },
      },
      visualMap: {
        type: 'continuous',
        min: 0,
        max: 120,
        text: ['High', 'Low'],
        realtime: false,
        calculable: true,
        color: ['orangered', 'yellow', 'lightskyblue'],
      },
      series: [
        {
          name: intlName1(),
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: scatterData,
          activeOpacity: 1,
          // symbolSize: 10,
          symbolSize: function(data) {
            // console.log(data)
            return Math.max(5, data[2] / 5);
          },
          // itemStyle: {
          //   normal: {
          //     borderColor: '#fff',
          //     color: '#577ceb',
          //   },
          // },
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke',
          },
          // hoverAnimation: true,
          label: {
            normal: {
              formatter: '{b}',
              position: 'right',
              show: false,
            },
            emphasis: {
              show: true,
            },
          },
          itemStyle: {
            normal: {
              color: '#f4e925',
              shadowBlur: 10,
              shadowColor: '#333',
            },
          },
        },
      ],
    };

    this.updateOption = () => {
      const series = this.option.series.slice();
      series[0].data = this.props.scatterData;
      series[0].name = intlName1();

      const newOption = { ...this.option };
      this.option = newOption;
    };
  }

  componentDidMount() {
    Promise.all([import('./mapdata/geojson/world.json'), import('echarts')]).then(([worldMap, echarts]) => {
      echarts.registerMap('world', worldMap.default, {});

      this.nodeMap = echarts.init(this.refWrap);
      this.updateOption();
      this.nodeMap.setOption(this.option);
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.scatterData !== prevProps.scatterData || this.props.intl !== prevProps.intl) {
      this.updateOption();
      this.nodeMap.setOption({
        series: this.option.series,
      });
    }
  }

  render() {
    return <div ref={this.setRefWrap} style={this.props.style} />;
  }
}

/* eslint react/forbid-prop-types: 0 */
NodeMap.propTypes = {
  intl: PropTypes.object,
  style: PropTypes.object,
  scatterData: PropTypes.array,
};
NodeMap.defaultProps = {
  scatterData: [],
  style: {},
  intl: {},
};

export default injectIntl(NodeMap);
