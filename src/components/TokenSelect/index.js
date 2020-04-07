import React, { PureComponent } from 'react';
import { Dropdown } from 'semantic-ui-react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const DropDownDiv = styled.div`
  .ui.selection.dropdown {
    border: 1px solid rgba(224, 225, 226, 1);
  }
  .ui.selection.dropdown .menu > .item {
    padding: 13px 13px 13px 11px !important;
    color: #212121;
  }
  .ui.dropdown .menu .selected.item {
    font-weight: bold;
    color: #1e3de4;
  }
  .ui.selection.active.dropdown:hover {
    border-color: #e0e1e2;
  }

  .token-content {
    display: flex;
    > span {
      font-size: 16px;
      line-height: 19px;
    }
    .token-content-left {
      flex: 1;
    }
    .token-content-right {
      flex-shrink: 0;
    }
    img {
      margin-right: 5px;
      width: 16px;
      height: 16px;
    }
  }

  .token-tag {
    border-radius: 2px;
    color: #fff;
    width: 24px;
    height: 21px;
    position: absolute;
    background: #1783ff;
    top: 12px;
    margin-left: 16px;
  }
  position: relative;
`;

class TokenSelect extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      showTag: false,
      tagLeftPos: 0,
    };
    this.wrapper = React.createRef();
  }

  componentDidMount() {}

  handleChange = (e, { value }) => {
    // this.setState({
    //   value,
    // });
    const { onChange } = this.props;
    onChange(value);
    this.syncLeftPos();
  };

  syncLeftPos() {
    this.setState({
      showTag: false,
    });
    setTimeout(() => {
      const txtElem = this.wrapper.current.querySelector('input + .text');
      this.setState({
        tagLeftPos: txtElem.offsetWidth + 10,
        showTag: true,
      });
    }, 10);
  }

  render() {
    const { showTag, tagLeftPos } = this.state;

    const { options, placeholder, value } = this.props;
    const viewOpts = options.map((v) => {
      return {
        key: v.value,
        value: v.value,
        text: v.text,
        content: (
          <div className="token-content">
            <img src={v.imgSrc} />
            <span className="token-content-left">{v.label1}</span>
            <span className="token-content-right">{v.label2}</span>
          </div>
        ),
      };
    });

    const cfg = {
      placeholder,
      fluid: true,
      search: true,
      selectOnBlur: false,
      selection: true,
      options: viewOpts,
      onChange: this.handleChange,
      // onBlur: this.onBlur
    };
    if (value) {
      cfg.value = value;
    }

    return (
      <DropDownDiv ref={this.wrapper}>
        <Dropdown {...cfg} />
        <i
          className="token-tag"
          style={{
            display: showTag ? 'block' : 'none',
            left: tagLeftPos,
          }}
        />
      </DropDownDiv>
    );
  }
}

TokenSelect.propTypes = {
  accountid: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf({
    value: PropTypes.string,
    text: PropTypes.string,
    content: PropTypes.element,
  }).isRequired,
};

TokenSelect.defaultProps = {};

export default TokenSelect;
