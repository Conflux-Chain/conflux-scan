import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { i18n } from '../../utils';

// eslint-disable-next-line react/prefer-stateless-function
class TotalDesc extends Component {
  render() {
    const { total } = this.props;

    return (
      <div className="total">
        {i18n('pagination.total', {
          param: {
            total,
          },
        })}
      </div>
    );
  }
}

TotalDesc.propTypes = {
  total: PropTypes.number.isRequired,
};

TotalDesc.defaultProps = {};

export default TotalDesc;
