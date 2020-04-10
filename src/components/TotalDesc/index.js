import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { i18n } from '../../utils';

// eslint-disable-next-line react/prefer-stateless-function
class TotalDesc extends Component {
  render() {
    const { listLimit, total } = this.props;

    let showLimit = false;
    if (listLimit && total > listLimit) {
      showLimit = true;
    }

    if (showLimit) {
      return (
        <div className="total">
          {i18n('pagination.limited', {
            param: {
              total,
              listLimit,
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
  total: PropTypes.number.isRequired,
  listLimit: PropTypes.number,
};

TotalDesc.defaultProps = {
  listLimit: undefined,
};

const getTotalPage = (count, limit, listLimit) => {
  const countShow = Math.min(count, listLimit);
  return Math.ceil(countShow / limit);
};

export { TotalDesc, getTotalPage };
