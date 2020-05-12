import React, { PureComponent } from 'react';
import { Dropdown } from 'semantic-ui-react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

const DropDownDiv = styled.div`
  .ui.selection.dropdown {
    border: 1px solid rgba(224, 225, 226, 1);
    min-height: 36px;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .ui.selection.dropdown .menu {
    max-height: 200px;
    overflow: auto;
  }
  .ui.selection.dropdown .menu > .item {
    padding: 13px 13px 13px 11px !important;
    color: #212121;
    white-space: nowrap;
    width: auto;
    min-width: fit-content;
  }
  .ui.dropdown:not(.button) > .default.text {
    color: rgba(0, 0, 0, 0.87);
  }

  .ui.dropdown .menu .selected.item {
    font-weight: bold;
    color: #1e3de4;
  }
  .ui.selection.active.dropdown:hover {
    border-color: #e0e1e2;
  }
  .ui.fluid.dropdown > .dropdown.icon {
    top: 8px;
  }
  .token-content {
    display: flex;
    > span {
      font-size: 16px;
      line-height: 19px;
    }
    .token-content-left {
      flex: 1;
      margin-right: 20px;
    }
    .token-content-right {
      flex-shrink: 0;
    }
    .img-wrap {
      width: 19px;
      height: 19px;
      margin-right: 5px;
      position: relative;
    }
    img {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      max-width: 19px;
      max-height: 19px;
    }
  }

  .token-tag {
    border-radius: 2px;
    color: #fff;
    padding-left: 5px;
    padding-right: 5px;
    min-width: 14px;
    height: 21px;
    position: absolute;
    background: #1783ff;
    top: 9px;
    margin-left: 16px;
    z-index: 90;
    pointer-events: none;
    font-style: normal;
    font-size: 12px;
    font-weight: bold;
    line-height: 22px;
    text-align: center;
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

  componentDidMount() {
    this.syncLeftPos();
  }

  componentDidUpdate(prevProps) {
    // eslint-disable-next-line react/destructuring-assignment
    if (prevProps.intl.locale !== this.props.intl.locale) {
      const txtElem = this.wrapper.current.querySelector('.text');
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        tagLeftPos: txtElem.offsetWidth + 10,
      });
    }
  }

  handleChange = (e, { value }) => {
    const { onChange } = this.props;
    onChange(value);
    // this.syncLeftPos();
  };

  syncLeftPos() {
    this.setState({
      showTag: false,
    });
    setTimeout(() => {
      if (this.wrapper.current) {
        const txtElem = this.wrapper.current.querySelector('.text');
        this.setState({
          tagLeftPos: txtElem.offsetWidth + 10,
          showTag: true,
        });
      }
    }, 10);
  }

  render() {
    const { showTag, tagLeftPos } = this.state;

    const { intl, options, placeholder, value, text, blueVal } = this.props;
    const viewOpts = options.map((v) => {
      return {
        key: v.value,
        value: v.value,
        text: v.text,
        content: (
          <div className="token-content">
            <i className="img-wrap">
              <img src={v.imgSrc} />
            </i>
            <span className="token-content-left">{v.label1}</span>
            <span className="token-content-right">{v.label2}</span>
          </div>
        ),
      };
    });

    const txtShow =
      intl.formatMessage({
        id: text,
      }) || '';

    const cfg = {
      placeholder,
      fluid: true,
      // search: true,
      selectOnBlur: false,
      selection: true,
      options: viewOpts,
      onChange: this.handleChange,
      text: txtShow,
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
        >
          {blueVal}
        </i>
      </DropDownDiv>
    );
  }
}

TokenSelect.propTypes = {
  accountid: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf({
    value: PropTypes.string,
    text: PropTypes.string,
    content: PropTypes.element,
  }).isRequired,
  blueVal: PropTypes.number,
  intl: PropTypes.objectOf({
    locale: PropTypes.string,
  }).isRequired,
  text: PropTypes.string.isRequired,
};

TokenSelect.defaultProps = {
  onChange: () => {},
  blueVal: 0,
  placeholder: '',
};

export default injectIntl(TokenSelect);
