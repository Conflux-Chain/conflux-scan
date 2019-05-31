import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import { injectIntl, FormattedMessage } from 'react-intl';

const Wrap = styled.div`
  width: 300px;
  margin-bottom: 10px;
  padding: 15px;
  border-radius: 5px;
  position: relative;
  .toast-title {
    font-size: 16px;
    font-weight: bold;
  }
  .toast-icon {
    float: left;
    font-size: 32px;
    height: 50px;
    width: 50px;
  }
  .close {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 16px;
    height: 16px;
    font-size: 14px;
    &:hover {
      opacity: 0.8;
    }
  }

  // colors
  &.toast-error {
    color: #fff;
    border-color: #dc3545;
    background-color: #dc3545;
  }

  &.toast-success {
    color: #fff;
    border-color: #28a745;
    background-color: #28a745;
  }
`;

function ToastMessage(props) {
  const { title, content, level, onClose } = props;

  let iconClassName;
  if (level === 'error') {
    iconClassName = 'times circle';
  } else if (level === 'success') {
    iconClassName = 'check circle';
  } else {
    iconClassName = 'info circle';
  }

  return (
    <Wrap className={`toast-${level}`}>
      <Icon name={iconClassName} className="toast-icon" />
      <div className="toast-content">
        {title ? (
          <div className="toast-title">
            <FormattedMessage id={title} />
          </div>
        ) : null}
        <div className="toast-body">
          <FormattedMessage id={content} />
        </div>
      </div>
      <Icon name="close icon" className="close" onClick={onClose} />
    </Wrap>
  );
}

ToastMessage.propTypes = {
  level: PropTypes.string.isRequired,
  title: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  content: PropTypes.string.isRequired,
};

ToastMessage.defaultProps = {
  title: '',
};

export default injectIntl(ToastMessage);
