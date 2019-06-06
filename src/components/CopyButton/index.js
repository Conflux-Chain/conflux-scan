import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { injectIntl } from 'react-intl';

const Wrap = styled.div`
  margin-left: 10px;
  display: inline-block;
`;
const IconFace = styled.div`
  margin-left: 16px;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 16px;
    height: 16px;
  }
  &.iconface {
    display: inline-flex;
  }
  &:hover {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.54);
    svg {
      color: #fff;
    }
  }
`;

const IconCopy = styled.span`
  position: relative;
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
  .i1 {
    width: 11px;
    height: 11px;
    border: 2px solid #1e3de4;
    border-radius: 3px;
    display: block;
    position: absolute;
    top: 1px;
    left: 2px;
    background: #fff;
  }
  .i2 {
    width: 10px;
    height: 11px;
    display: block;
    position: absolute;
    top: 6px;
    left: 6px;
    background: #fff;
  }
  .i3 {
    width: 11px;
    height: 11px;
    border: 2px solid #1e3de4;
    border-radius: 3px;
    display: block;
    position: absolute;
    top: 7px;
    left: 7px;
    background: #fff;
  }
`;

class CopyButton extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      tempTip: '',
    };
    this.onClickIcon = this.onClickIcon.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseLeave() {
    this.setState({
      tempTip: '',
    });
  }

  onClickIcon() {
    const textArea = document.createElement('textarea');
    //
    // *** This styling is an extra step which is likely not required. ***
    //
    // Why is it here? To ensure:
    // 1. the element is able to have focus and selection.
    // 2. if element was to flash render it has minimal visual impact.
    // 3. less flakyness with selection and copying which **might** occur if
    //    the textarea element is not visible.
    //
    // The likelihood is the element won't even render, not even a
    // flash, so some of these are just precautions. However in
    // Internet Explorer the element is visible whilst the popup
    // box asking the user for permission for the web page to
    // copy to the clipboard.
    //

    // Place in top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;

    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';

    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;

    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';

    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = 'transparent';

    const { txtToCopy } = this.props;
    textArea.value = txtToCopy;

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        this.setState({
          tempTip: 'app.comp.copyButton.copySuccess',
        });
      }
    } catch (err) {
      console.log(err);
      console.log('Oops, unable to copy');
    }

    document.body.removeChild(textArea);
  }

  render() {
    const { toolTipId, intl, style, renderIcon, btnType } = this.props;
    const { tempTip } = this.state;
    const tooltip = intl.formatMessage({
      id: tempTip || toolTipId,
    });

    return (
      <Wrap
        style={style}
        data-inverted=""
        data-tooltip={tooltip}
        data-position="bottom left"
        onClick={this.onClickIcon}
        onMouseLeave={this.onMouseLeave}
      >
        {renderIcon(btnType)}
      </Wrap>
    );
  }
}
CopyButton.propTypes = {
  toolTipId: PropTypes.string.isRequired,
  txtToCopy: PropTypes.string.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  style: PropTypes.shape({
    marginLeft: PropTypes.string,
  }),
  btnType: PropTypes.string,
  renderIcon: PropTypes.func,
};
CopyButton.defaultProps = {
  intl: {
    formatMessage: () => {},
  },
  style: {},
  btnType: '',
  renderIcon: (btnType) => {
    if (btnType === 'two') {
      return (
        <IconCopy>
          <i className="i1" />
          <i className="i2" />
          <i className="i3" />
        </IconCopy>
      );
    }
    return (
      <IconFace className="iconface">
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#iconfuzhi" />
        </svg>
      </IconFace>
    );
  },
};

export default injectIntl(CopyButton);
export { IconFace };
