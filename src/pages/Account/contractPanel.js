import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { TabPanel } from './styles';

class ContractPanel extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      activated: false,
    };
  }

  componentDidUpdate() {
    const { isActive } = this.props;
    if (isActive) {
      const { activated } = this.state;
      if (!activated) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          activated: true,
        });
      }
    }
  }

  render() {
    const { isActive } = this.props;
    const { activated } = this.state;

    if (!activated) {
      return null;
    }

    return <TabPanel className={isActive ? 'ui bottom attached segment active tab' : 'ui bottom attached segment tab'} />;
  }
}

ContractPanel.propTypes = {
  // accountid: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
};

ContractPanel.defaultProps = {};

export default ContractPanel;
