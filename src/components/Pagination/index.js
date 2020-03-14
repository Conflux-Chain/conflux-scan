import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'semantic-ui-react';

function PaginationComp(props) {
  return (
    <Pagination
      {...{
        ...props,
        onPageChange(e, data) {
          if (data.activePage > 0) {
            props.onPageChange(e, data);
          }
        },
      }}
    />
  );
}

PaginationComp.propTypes = {
  onPageChange: PropTypes.func.isRequired,
};

export default PaginationComp;
