import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { injectIntl } from 'react-intl';
import { Popup } from 'semantic-ui-react';
import JSONPretty from 'react-json-pretty';
import { hex2utf8 } from '../../utils/transaction';
import { i18n } from '../../utils';
import 'react-json-pretty/themes/monikai.css';

const stylePopup = {
  background: '#0B0B0B',
  fontSize: '12px',
  color: 'rgba(255,255,255,0.87)',
  lineHeight: '14px',
  width: '240px',
};
const Wrap = styled.div`
  .textAreaContainer {
    max-width: 100%;
    max-height: 200px;
    padding: 15px;
    border-radius: 4px;
    border: 1px solid #979797;
    font-size: 16px;
    font-weight: 400;
    color: #585858;
    line-height: 22px;
    outline: none;
    margin-top: 0px;
    white-space: pre-wrap;
    word-wrap: break-word;
    white-space: pre-wrap; /*css-3*/
    white-space: -moz-pre-wrap; /*Mozilla,since1999*/
    white-space: -pre-wrap; /*Opera4-6*/
    white-space: -o-pre-wrap; /*Opera7*/
    overflow: auto;
  }
  .__json-pretty-error__ {
    margin-top: 0px;
    background: #f9f9f9;
    line-height: 1.3;
    color: #585858;
    white-space: pre-wrap; /* Since CSS 2.1 */
    white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
    white-space: -pre-wrap; /* Opera 4-6 */
    white-space: -o-pre-wrap;
    word-wrap: break-word;
    border-radius: 4px;
    border: 1px solid #979797;
    padding: 10px;
    height: 166px;
    overflow-y: auto;
  }
  .custom-json-pretty {
    margin-top: 0px;
    background: #f9f9f9;
    line-height: 1.3;
    color: #585858;
    white-space: pre-wrap; /* Since CSS 2.1 */
    white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
    white-space: -pre-wrap; /* Opera 4-6 */
    white-space: -o-pre-wrap;
    word-wrap: break-word;
    border-radius: 4px;
    border: 1px solid #979797;
    padding: 10px;
    height: 166px;
    overflow-y: auto;

    .__json-key__ {
      color: #000;
    }
    .__json-value__ {
      color: #032f62;
    }
    .__json-string__ {
      color: #032f62;
    }
    .__json-boolean__ {
      color: #1e2022;
    }
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

  getStrByType(byteCode, type, decodedDataStr) {
    let str = '';
    switch (type) {
      case 'original':
        str = byteCode;
        break;
      case 'utf8':
        str = hex2utf8(byteCode);
        break;
      case 'decodeInputData':
        str = decodedDataStr;
        break;
      default:
        break;
    }
    return str;
  }

  update() {
    const { byteCode, inputType, decodedDataStr } = this.props;
    let strDecoded = this.getStrByType(byteCode, inputType, decodedDataStr);
    this.setState({ strDecoded: strDecoded });
  }

  render() {
    const { strDecoded } = this.state;
    let str;
    try {
      str = JSON.stringify(JSON.parse(strDecoded), null, 2);
    } catch (error) {
      str = strDecoded;
    }
    return (
      <Wrap>
        {/* <Popup
          trigger={<pre className="textAreaContainer">{str}</pre>}
          content={i18n('app.pages.txns.inputTips')}
          style={stylePopup}
          position="top center"
          wide
          inverted
        /> */}

        {<JSONPretty id="json-pretty" data={str} themeClassName="custom-json-pretty" />}
      </Wrap>
    );
  }
}

InputData.propTypes = {
  byteCode: PropTypes.string,
  inputType: PropTypes.string.isRequired,
  decodedDataStr: PropTypes.string,
};
InputData.defaultProps = {
  byteCode: '',
  decodedDataStr: '',
};
export default injectIntl(InputData);
