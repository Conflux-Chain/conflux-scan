import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { injectIntl } from 'react-intl';
import { Popup } from 'semantic-ui-react';
import { hex2utf8 } from '../../utils/transaction';
import { i18n } from '../../utils';

const stylePopup = {
  background: '#0B0B0B',
  fontSize: '12px',
  color: 'rgba(255,255,255,0.87)',
  lineHeight: '14px',
};
const Wrap = styled.div`
  .textAreaContainer {
    width: 100%;
    padding: 15px;
    border-radius: 4px;
    border: 1px solid #979797;
    font-size: 16px;
    font-weight: 400;
    color: #585858;
    line-height: 22px;
  }
`;
class InputData extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      strDecoded: '',
    };
  }

  componentDidMount() {
    this.update();
  }

  componentDidUpdate() {
    this.update();
  }

  getStrByType(byteCode, type) {
    let str = '';
    switch (type) {
      case 'original':
        str = byteCode;
        break;
      case 'utf8':
        console.log('utf8 function');
        str = hex2utf8(byteCode);
        break;
      case 'decodeInputData':
        break;
      default:
        break;
    }
    return str;
  }

  update() {
    const { byteCode, inputType } = this.props;
    let strDecoded = this.getStrByType(byteCode, inputType);
    this.setState({ strDecoded: strDecoded });
  }

  render() {
    const { strDecoded } = this.state;
    return (
      <Wrap>
        <Popup
          trigger={<textarea readOnly spellCheck="false" rows="5" name="inputData" value={strDecoded} className="textAreaContainer" />}
          content={i18n('app.pages.txns.inputTips')}
          style={stylePopup}
          position="top center"
          wide
          inverted
        />
      </Wrap>
    );
  }
}

InputData.propTypes = {
  byteCode: PropTypes.string.isRequired,
  inputType: PropTypes.string.isRequired,
};
export default injectIntl(InputData);
