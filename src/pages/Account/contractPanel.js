/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import { TabPanel, StyledTabel } from './styles';
import 'ace-mode-solidity/build/remix-ide/mode-solidity';
import 'ace-builds/src-noconflict/theme-github';
import { i18n } from '../../utils';

const AceEditorStyle = {
  width: '100%',
};
const Wrapper = styled.div`
  .contentHeader {
    height: 48px;
    line-height: 48px;
    padding-left: 17px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px 4px 0px 0px;
    color: rgba(0, 0, 0, 0.87);
    font-size: 16px;
    font-weight: bold;
  }

  .abiContainer {
    height: 200px;
    width: 100%;
  }
  .abiItem {
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    display: block;
    color: #1e2022;
    resize: both;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow: auto;
    font-size: 16px;
    height: 200px;
    max-height: 400px;
  }
  .textAreaContainer {
    width: 100%;
    padding: 15px;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    font-size: 16px;
    font-weight: 400;
    color: #585858;
    line-height: 22px;
    height: 200px;
    max-height: 400px;
    outline: none;
    resize: none;
  }
  .footerContainer {
    text-align: right;
    .footerInner {
      display: inline-block;
    }
  }
  .submitBtn {
    height: 36px;
    padding: 0 18px;
    line-height: 36px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
    text-align: center;
    outline: none;
    cursor: pointer;
    border: 1px solid rgba(224, 225, 226, 1);
    margin-left: 8px;
    &.clickable {
      background: rgba(30, 61, 228, 1);
      color: #fff;
    }
    &.unclickable {
      color: rgba(0, 0, 0, 0.6);
      background: #fff;
    }
  }
`;
class ContractPanel extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      activated: false,
    };
  }

  componentDidUpdate() {
    const { isActive } = this.props;
    if (isActive) {
      const { activated } = this.state;
      if (!activated) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          activated: true,
          showSourceCode: true,
        });
      }
    }
  }

  sourceCodeClick() {
    this.setState({
      showSourceCode: true,
    });
  }

  abiClick() {
    this.setState({
      showSourceCode: false,
    });
  }

  render() {
    const { isActive, contractInfo } = this.props;
    const { activated, showSourceCode } = this.state;
    if (!activated) {
      return null;
    }

    return (
      <Wrapper>
        <TabPanel className={isActive ? 'ui bottom attached segment active tab' : 'ui bottom attached segment tab'}>
          <StyledTabel>
            <div className="ui fluid card">
              <div className="content">
                {showSourceCode ? (
                  <div className="editorContainer">
                    <div className="contentHeader">{i18n('app.common.sourceCode')}</div>
                    <AceEditor
                      style={AceEditorStyle}
                      mode="solidity"
                      theme="github"
                      name="UNIQUE_ID_OF_DIV"
                      editorProps={{ $blockScrolling: true }}
                      showGutter
                      showPrintMargin={false}
                      highlightActiveLine={false}
                      onChange={this.handleSourceChange}
                      value={contractInfo.sourceCode}
                      readOnly
                    />
                  </div>
                ) : (
                  <div>
                    <div className="contentHeader">{i18n('app.common.abi')}</div>
                    <div className="content abiContainer">
                      <textarea
                        spellCheck="false"
                        rows="5"
                        name="inputData"
                        value={contractInfo.abi}
                        className="textAreaContainer"
                        readOnly
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="footerContainer">
              <div className="footerInner">
                <button
                  type="button"
                  className={showSourceCode ? 'submitBtn clickable' : 'submitBtn unclickable'}
                  onClick={() => this.sourceCodeClick()}
                >
                  {i18n('app.common.sourceCode')}
                </button>
                <button
                  type="button"
                  className={showSourceCode ? 'submitBtn unclickable' : 'submitBtn clickable'}
                  onClick={() => this.abiClick()}
                >
                  {i18n('app.common.abi')}
                </button>
              </div>
            </div>
          </StyledTabel>
        </TabPanel>
      </Wrapper>
    );
  }
}

ContractPanel.propTypes = {
  // accountid: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  contractInfo: PropTypes.object,
};

ContractPanel.defaultProps = {};

export default ContractPanel;
