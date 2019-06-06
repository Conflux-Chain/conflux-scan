import React, { Component } from 'react';
import NodeMap from '../../components/NodeMap';
import exampleData from '../../components/NodeMap/example';

class More extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      scatterData: [],
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        scatterData: exampleData,
      });
      console.log('sync');
    }, 2000);
  }

  render() {
    const { scatterData } = this.state;
    return (
      <div id="map-div">
        <NodeMap
          scatterData={scatterData}
          style={{
            height: 800,
            width: 1000,
          }}
        />
      </div>
    );
  }
}
export default More;
