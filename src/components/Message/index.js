import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrap = styled.div`
  .message {
    padding: 12px;
    font-size: 16px;
    line-height: 16px;
    border-radius: 4px;
    color: #fff;
    & > i,
    & > span {
      vertical-align: middle;
      display: inline-block;
    }
    & > i {
      width: 20px;
      margin-right: 12px;
    }
  }
  .message-notice {
    background: #2f69a5;
  }
  .message-important {
    background: #e76a25;
  }
  .message-error {
    background: #d43429;
  }
  .message-success {
    background: #4a9e81;
  }
  .message-system {
    background: #ffc801;
    color: #3e3e3e;
  }
  .message-notice-light {
    background: #f0f3f7;
    color: #2f69a5;
  }
  .message-important-light {
    background: #ffebd4;
    color: #e76a25;
  }
  .message-error-light {
    background: #ffe7e5;
    color: #d43429;
  }
  .message-success-light {
    background: #dffaf0;
    color: #4a9e81;
  }
`;

class Message extends PureComponent {
  render() {
    const { type, children } = this.props;

    let iconType;
    switch (type) {
      case 'message-notice':
      case 'message-important':
      case 'message-notice-light':
      case 'message-important-light':
      case 'message-system':
        iconType = 'info circle';
        break;
      case 'message-error':
      case 'message-error-light':
        iconType = 'remove circle';
        break;
      case 'message-success':
      case 'message-success-light':
        iconType = 'check circle';
        break;
      default:
        iconType = '';
    }

    return (
      <Wrap>
        <div className={`message ${type}`}>
          <i className={`${iconType} icon`} />
          <span>{children}</span>
        </div>
      </Wrap>
    );
  }
}

Message.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  type: PropTypes.string.isRequired,
};
export default Message;
