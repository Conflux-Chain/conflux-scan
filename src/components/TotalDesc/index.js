import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { i18n } from '../../utils';

// eslint-disable-next-line react/prefer-stateless-function
class TotalDesc extends Component {
  render() {
    const { total, searchTimeLimit } = this.props;

    if (searchTimeLimit) {
      return (
        <div className="total">
          {i18n('pagination.totalLimit', {
            param: {
              total,
            },
          })}
        </div>
      );
    }

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
  searchTimeLimit: PropTypes.bool,
  total: PropTypes.number.isRequired,
};

TotalDesc.defaultProps = {
  searchTimeLimit: false,
};

export default TotalDesc;
