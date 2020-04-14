/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Icon, Popup } from 'semantic-ui-react';
import AceEditor from 'react-ace';
import media from '../../globalStyles/media';
import { i18n } from '../../utils';
import TableLoading from '../../components/TableLoading';
import { reqContractCreate } from '../../utils/api';
import { defaultContractIcon, defaultTokenIcon, contractTypes, contractTypeCodeGeneral } from '../../constants';
import 'ace-mode-solidity/build/remix-ide/mode-solidity';
import 'ace-builds/src-noconflict/theme-github';
import { toast } from '../../components/Toast';

const stylePopup = {
  background: '#0B0B0B',
  fontSize: '12px',
  color: 'rgba(255,255,255,0.87)',
  lineHeight: '14px',
};
const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  button {
    border: none;
  }
  ${media.mobile`
    width: 95%;
    margin: 0 auto;
  `}

  .redAsterisk {
    position: absolute;
    display: inline-block;
    top: 0px;
    left: -8px;
    width: 9px;
    height: 22px;
    font-size: 18px;
    font-weight: 600;
    color: #df0000;
    line-height: 22px;
    &.tab {
      top: -3px;
    }
  }
  .asteriskContainer {
    display: inline-block;
    text-align: top;
  }

  .relativeContainer {
    position: relative;
    &.disabled {
      opacity: 0.4; /* Standard compliant browsers */
      -moz-opacity: 0.4; /* Firefox and Mozilla browsers */
      -webkit-opacity: 0.4; /* WebKit browser e.g. Safari */
      filter: alpha(opacity=40);
    }
    > span:last-child {
      white-space: normal;
    }
  }

  .inputContainer {
    width: 400px;
    height: 36px;
    border-radius: 4px;
    ${media.pad`
      width: auto
    `}
  }

  .inputItem {
    padding: 0px !important;
    padding-left: 5px !important;
    height: 100%;
    &::placeholder {
      color: #898989;
      font-size: 16px;
      line-height: 19px;
    }
  }

  .ui.disabled.input {
    opacity: 1;
    -moz-opacity: 1; /* Firefox and Mozilla browsers */
    -webkit-opacity: 1; /* WebKit browser e.g. Safari */
    filter: alpha(opacity=100);
  }

  .submitBtn {
    width: 200px;
    height: 36px;
    line-height: 36px;
    background: #1e3de4;
    border-radius: 4px;
    color: #fff;
    font-size: 14px;
    font-weight: 400;
    text-align: center;
    outline: none;
    cursor: pointer;
    &.disabled {
      background: #d8d8d8;
      border: 1px solid rgba(224, 225, 226, 1);
      cursor: auto;
    }
    ${media.mobile`
      margin-bottom: 10px;
    `}
  }

  .ui.segment[class*='bottom attached']:last-child {
    margin-bottom: 1rem;
  }

  .dropdownContainer {
    margin-left: -1px !important;
    border: 1px solid rgba(34, 36, 38, 0.15) !important;
  }
`;

const StyledTabel = styled.div`
  ${media.mobile`
    margin: 0 auto;
    overflow-x: scroll;
    overflow-y: hidden;
  `}

  tr > td {
    padding-left: 43px !important;
    border: none !important;
    font-size: 16px !important;
    background: #fff !important;
  }

  tr > td.init {
    padding-left: initial !important;
  }

  &.right {
    margin-left: 16px;
  }
  td.collapsing {
    width: 200px !important;
    font-weight: bold !important;
    padding: 0.5em 0em 0.5em 2em !important;
    background: #edf2f9 !important;
    ${media.pad`
      padding: 0.1em 2em 0.1em 2em !important;
      min-width: 200px !important;
    `}
  }
  td.top {
    padding-top: 15px !important;
  }
  td.bottom {
    padding-bottom: 14px !important;
  }
  tr > td > a {
    font-weight: bold;
  }

  .ui.table td {
    padding-top: 7px;
    padding-bottom: 0px;
    padding-left: 0px;
  }

  .iconContainer {
    width: 79px;
    height: 79px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f7f7f7;
    margin-left: 130px;
    ${media.pad`
      margin-left: 30px;
    `}
  }

  .customBtn {
    width: 200px;
    height: 36px;
    border-radius: 4px;
    color: #000;
    font-size: 16px;
    font-weight: bold;
    line-height: 36px;
    text-align: center;
    border: 1px solid rgba(224, 225, 226, 1);
    cursor: pointer;
    text-overflow: ellipsis;
    white-space: nowrap;
    outline: none;
    background: #fff;
    &.disabled {
      color: rgba(0, 0, 0, 0.5);
      cursor: auto;
    }
    ${media.pad`
      width: auto;
    `}
  }

  .removeText {
    color: rgba(64, 90, 231, 1);
    margin-top: 10px;
    cursor: pointer;
    &.disabled {
      color: rgba(64, 90, 231, 0.5);
      cursor: auto;
    }
  }

  .fixed-first {
    /* width: 443px; */
  }

  .editorContainer {
    width: 100% !important;
  }
`;

const HeadBar = styled.div`
  width: 100%;
  font-size: 16px;
  margin-top: 16px;
  margin-bottom: 26px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  ${media.mobile`
    flex-direction: column;
    align-items: flex-start;
  `}

  * {
    display: inline-block;
    margin: 0;
  }
  h1 {
    color: #000;
    font-size: 20px;
    margin-right: 12px;
  }
`;

const IconItem = styled.img`
  display: inline-block;
  width: 41px;
`;
const FilterSelector = styled.div.attrs({
  className: 'ui menu compact',
})`
  width: 200px;
  height: 36px;
  border: none !important;
  box-shadow: none !important;
  padding-bottom: 10px !important;
  background: transparent !important;
  ${media.pad`
    width: auto;
  `}

  .ui.dropdown {
    width: 100%;
    justify-content: space-between;
    border: 1px solid #e0e1e2;
    border-radius: 4px !important;
    padding: 0 12px 0 5px !important;
    ${media.pad`
      width: auto;
    `}

    .menu > .item {
      outline: none;
    }

    .menu > .item.priority {
      &:hover {
        background: rgba(0, 0, 0, 0.12) !important;
        font-weight: bold !important;
        color: #1e3de4 !important;
      }
    }
  }

  .menu.visible {
    display: none !important;
    top: calc(100% + 8px);
  }

  &:hover {
    .menu.visible {
      display: block !important;
    }
  }
`;

const TabZone = styled.div`
  margin-top: 16px;
  position: relative;
  width: 100%;
  button {
    outline: none;
    border: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }
`;

const TabContent = styled.div`
  margin-top: -1px;
  margin-left: 1px;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px 1px;
  .ui.segment[class*='bottom attached'] {
    box-shadow: none;
  }
`;

const StyledTabelWrapper = styled.div`
  overflow: hidden;
  .ui.fluid.card {
    box-shadow: none;
    border: 1px solid rgba(0, 0, 0, 0.08);
  }
  .content {
    padding: 0 !important;
  }
  thead tr th {
    background: rgba(0, 0, 0, 0.05) !important;
  }
  tr th {
    padding: 16px 20px !important;
    padding-right: 0 !important;
    &:last-of-type {
      padding: 16px 16px !important;
      padding-right: 0 !important;
    }
    &.right-pad {
      padding-right: 16px !important;
    }
  }
  &.right {
    margin-left: 16px;
  }

  .abiContainer {
    height: 250px;
    width: 100%;
    border: none;
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
    border-radius: 0px 0px 4px 4px;
    font-size: 16px;
    font-weight: 400;
    color: #585858;
    line-height: 22px;
    height: 200px;
    max-height: 400px;
    outline: none;
    resize: none;
    border: none;
  }
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
`;

const ContentBottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
  ${media.mobile`
    flex-direction: column;
    justify-content: center;
  `}
  .relativeContainer {
    margin-left: 8px;
  }
  .leftContainer {
    div {
      display: inline-block;
    }
    .inputContainer {
      margin-left: 12px;
      ${media.mobile`
        margin-left: 0px;
      `}
    }
    .labelText {
      font-weight: bold;
      color: #151515;
      font-size: 16px;
      line-height: 19px;
      ${media.mobile`
        margin-left: 8px;
      `}
    }
    ${media.mobile`
      margin-bottom: 10px;
    `}
  }
`;

const AceEditorStyle = {
  width: '100%',
};
class ContractUpdate extends Component {
  fileContractInputRef = React.createRef();

  fileTokenInputRef = React.createRef();

  constructor(...args) {
    super(...args);
    this.state = {
      iconContractSource: '',
      iconTokenSource: '',
      currentTab: 1,
      nameTagVal: '',
      websiteVal: '',
      selectedContractTypeCode: 0,
      tokenNameVal: '',
      tokenSymbolVal: '',
      tokenDecimalsVal: '',
      sourceCode: '',
      abiVal: '',
      passwordVal: '',
      canSubmit: false,
      addressVal: '',
    };
    this.handleSourceChange = this.handleSourceChange.bind(this);
  }

  componentDidMount() {}

  componentDidUpdate() {}

  getContractStrByType(type) {
    return contractTypes[type] || '';
  }

  getKeyByContractValue(contractName) {
    // eslint-disable-next-line no-restricted-syntax
    for (let [key, value] of Object.entries(contractTypes)) {
      if (value === contractName) {
        return key;
      }
    }
    return 0;
  }

  handleContractIconChange(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        iconContractSource: reader.result,
      });
    };

    reader.readAsDataURL(file);
  }

  handleTokenIconChange(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        iconTokenSource: reader.result,
      });
    };

    reader.readAsDataURL(file);
  }

  handleAddressChange(e) {
    this.setState(
      {
        addressVal: e.target.value,
      },
      () => {
        this.updateCanSubmit();
      }
    );
  }

  handleNameChange(e) {
    this.setState(
      {
        nameTagVal: e.target.value,
      },
      () => {
        this.updateCanSubmit();
      }
    );
  }

  handleWebsiteChange(e) {
    this.setState(
      {
        websiteVal: e.target.value,
      },
      () => {
        this.updateCanSubmit();
      }
    );
  }

  handleTokenNameChange(e) {
    this.setState(
      {
        tokenNameVal: e.target.value,
      },
      () => {
        this.updateCanSubmit();
      }
    );
  }

  handleTokenSymbolChange(e) {
    this.setState(
      {
        tokenSymbolVal: e.target.value,
      },
      () => {
        this.updateCanSubmit();
      }
    );
  }

  handleTokenDecimalsChange(e) {
    this.setState(
      {
        tokenDecimalsVal: e.target.value,
      },
      () => {
        this.updateCanSubmit();
      }
    );
  }

  handleSourceChange(sourceCode) {
    this.setState(
      {
        sourceCode,
      },
      () => {
        this.updateCanSubmit();
      }
    );
  }

  handleAbiChange(e) {
    this.setState(
      {
        abiVal: e.target.value,
      },
      () => {
        this.updateCanSubmit();
      }
    );
  }

  handlePasswordChange(e) {
    this.setState(
      {
        passwordVal: e.target.value,
      },
      () => {
        this.updateCanSubmit();
      }
    );
  }

  removeContractPhoto() {
    this.setState({
      iconContractSource: '',
    });
  }

  removeTokenPhoto() {
    this.setState({
      iconTokenSource: '',
    });
  }

  updateCanSubmit() {
    const {
      selectedContractTypeCode,
      nameTagVal,
      abiVal,
      tokenNameVal,
      tokenSymbolVal,
      tokenDecimalsVal,
      sourceCode,
      passwordVal,
    } = this.state;
    let isSubmitable = false;
    // eslint-disable-next-line eqeqeq
    if (selectedContractTypeCode == contractTypeCodeGeneral) {
      if (nameTagVal && sourceCode && abiVal && passwordVal) {
        isSubmitable = true;
      }
    } else if (nameTagVal && sourceCode && abiVal && passwordVal && tokenNameVal && tokenSymbolVal && tokenDecimalsVal) {
      isSubmitable = true;
    }
    this.setState({
      canSubmit: isSubmitable,
    });
    return isSubmitable;
  }

  submitClick() {
    const { history } = this.props;
    const {
      nameTagVal,
      abiVal,
      tokenNameVal,
      tokenSymbolVal,
      tokenDecimalsVal,
      sourceCode,
      passwordVal,
      iconContractSource,
      iconTokenSource,
      websiteVal,
      selectedContractTypeCode,
      addressVal,
    } = this.state;
    const bodyparams = {};
    bodyparams.address = addressVal;
    bodyparams.name = nameTagVal;
    bodyparams.website = websiteVal;
    bodyparams.icon = iconContractSource;
    bodyparams.typeCode = Number(selectedContractTypeCode);
    bodyparams.tokenName = tokenNameVal;
    bodyparams.tokenSymbol = tokenSymbolVal;
    bodyparams.tokenDecimal = Number(tokenDecimalsVal);
    bodyparams.tokenIcon = iconTokenSource;
    bodyparams.sourceCode = sourceCode;
    bodyparams.abi = abiVal;
    bodyparams.password = passwordVal;
    reqContractCreate(bodyparams, { showError: true }).then((response) => {
      if (response.code === 0) {
        toast.success({
          title: 'app.common.success',
          content: 'app.common.submitSucceed',
          conf: {
            timeout: 2000,
          },
        });
        history.replace(`/accountdetail/${response.result.address}`);
      }
    });
  }

  isGeneralContractType() {
    const { selectedContractTypeCode } = this.state;
    // eslint-disable-next-line eqeqeq
    return selectedContractTypeCode == contractTypeCodeGeneral;
  }

  render() {
    const {
      iconContractSource,
      iconTokenSource,
      selectedContractTypeCode,
      currentTab,
      nameTagVal,
      abiVal,
      websiteVal,
      tokenNameVal,
      tokenSymbolVal,
      tokenDecimalsVal,
      sourceCode,
      passwordVal,
      canSubmit,
      addressVal,
    } = this.state;
    const displayNone = {
      display: 'none',
    };
    return (
      <div>
        <Wrapper>
          <HeadBar>
            <h1>{i18n('app.pages.contract.create')}</h1>
          </HeadBar>
          {
            <StyledTabel>
              <table className="ui celled structured table">
                <tbody className="tbodyContainer">
                  <tr className="centered">
                    <td className="collapsing top">
                      <div className="relativeContainer">
                        <span className="redAsterisk">*</span>
                        {i18n('app.pages.contract.address')}
                      </div>
                    </td>
                    <td className="aligned top fixed-first">
                      <div className="ui input inputContainer">
                        <input className="inputItem" type="text" value={addressVal} onChange={(e) => this.handleAddressChange(e)} />
                      </div>
                    </td>
                    <td rowSpan="3" className="center aligned init">
                      <div className="iconContainer">
                        <IconItem url={iconContractSource || defaultContractIcon} />
                      </div>
                    </td>
                    <td rowSpan="3" className="center aligned init">
                      <div>
                        <input
                          type="file"
                          name="File"
                          style={displayNone}
                          accept="image/*"
                          ref={this.fileContractInputRef}
                          onChange={(e) => {
                            this.handleContractIconChange(e);
                          }}
                        />
                        <button type="button" className="customBtn" onClick={() => this.fileContractInputRef.current.click()}>
                          {i18n('app.pages.contract.uploadIcon')}
                        </button>
                        <div
                          className="removeText"
                          onClick={() => {
                            this.removeContractPhoto();
                          }}
                        >
                          {i18n('app.pages.contract.removePhoto')}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="collapsing">
                      <div className="relativeContainer">
                        <span className="redAsterisk">*</span>
                        {i18n('app.pages.contract.nameTag')}
                      </div>
                    </td>
                    <td className="aligned">
                      <div className="ui input inputContainer">
                        <input className="inputItem" type="text" value={nameTagVal} onChange={(e) => this.handleNameChange(e)} />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="collapsing bottom">
                      <div className="relativeContainer">{i18n('app.common.officialSite')}</div>
                    </td>
                    <td className="aligned bottom">
                      <div className="ui input inputContainer">
                        <input className="inputItem" type="text" value={websiteVal} onChange={(e) => this.handleWebsiteChange(e)} />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="ui celled structured table">
                <tbody className="tbodyContainer">
                  <tr className="centered">
                    <td className="collapsing top">
                      <div className="relativeContainer">
                        <span className="redAsterisk">*</span>
                        {i18n('app.pages.contract.contractType')}
                      </div>
                    </td>
                    <td className="aligned top fixed-first">
                      <div className="ui input disabled inputContainer">
                        <FilterSelector>
                          <div className="ui dropdown link item">
                            <span>{i18n(contractTypes[selectedContractTypeCode])}</span>
                            <i className="dropdown icon" />
                            <div className="menu transition visible dropdownContainer">
                              {Object.keys(contractTypes).map((key, index) => (
                                <div
                                  key={key}
                                  className="item priority"
                                  role="button"
                                  tabIndex={index}
                                  onClick={() =>
                                    this.setState({ selectedContractTypeCode: key }, () => {
                                      this.updateCanSubmit();
                                    })
                                  }
                                  onKeyPress={() =>
                                    this.setState({ selectedContractTypeCode: key }, () => {
                                      this.updateCanSubmit();
                                    })
                                  }
                                >
                                  {i18n(contractTypes[key])}
                                </div>
                              ))}
                            </div>
                          </div>
                        </FilterSelector>
                      </div>
                    </td>
                    <td rowSpan="4" className="center aligned init">
                      <div className="iconContainer">
                        <IconItem url={iconTokenSource || defaultTokenIcon} />
                      </div>
                    </td>
                    <td rowSpan="4" className="center aligned init">
                      <div>
                        <input
                          type="file"
                          name="File"
                          style={displayNone}
                          accept="image/*"
                          ref={this.fileTokenInputRef}
                          onChange={(e) => {
                            this.handleTokenIconChange(e);
                          }}
                        />
                        <button
                          type="button"
                          className={this.isGeneralContractType() ? 'customBtn disabled' : 'customBtn'}
                          onClick={() => (this.isGeneralContractType() ? false : this.fileTokenInputRef.current.click())}
                        >
                          {i18n('app.pages.contract.uploadTokenIcon')}
                        </button>
                        <div
                          className={this.isGeneralContractType() ? 'removeText disabled' : 'removeText'}
                          onClick={() => {
                            this.isGeneralContractType() ? false : this.removeTokenPhoto();
                          }}
                        >
                          {i18n('app.pages.contract.removePhoto')}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="collapsing">
                      <div className={this.isGeneralContractType() ? 'relativeContainer disabled' : 'relativeContainer'}>
                        <span className="redAsterisk">*</span>
                        {i18n('app.pages.contract.tokenName')}
                      </div>
                    </td>
                    <td className="aligned">
                      <div className="ui input inputContainer">
                        <input
                          className="inputItem"
                          type="text"
                          value={tokenNameVal}
                          onChange={(e) => this.handleTokenNameChange(e)}
                          readOnly={this.isGeneralContractType()}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="collapsing">
                      <div className={this.isGeneralContractType() ? 'relativeContainer disabled' : 'relativeContainer'}>
                        <span className="redAsterisk">*</span>
                        {i18n('app.pages.contract.tokenSymbol')}
                      </div>
                    </td>
                    <td className="aligned">
                      <div className="ui input inputContainer">
                        <input
                          className="inputItem"
                          type="text"
                          value={tokenSymbolVal}
                          onChange={(e) => this.handleTokenSymbolChange(e)}
                          readOnly={this.isGeneralContractType()}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="collapsing bottom">
                      <div className={this.isGeneralContractType() ? 'relativeContainer disabled' : 'relativeContainer'}>
                        <span className="redAsterisk">*</span>
                        {i18n('app.pages.contract.decimals')}
                      </div>
                    </td>
                    <td className="aligned bottom">
                      <div className="ui input inputContainer">
                        <input
                          className="inputItem"
                          type="number"
                          value={tokenDecimalsVal}
                          onChange={(e) => this.handleTokenDecimalsChange(e)}
                          readOnly={this.isGeneralContractType()}
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <TabZone>
                <div className="ui attached tabular menu">
                  <button
                    type="button"
                    className={currentTab === 1 ? 'active item' : 'item'}
                    onClick={() => this.setState({ currentTab: 1 })}
                  >
                    <div className="relativeContainer">
                      <span className="redAsterisk tab">*</span>
                      {i18n('app.pages.contract.sourceCode')}
                    </div>
                  </button>
                  <button
                    className={currentTab === 2 ? 'active item' : 'item'}
                    type="button"
                    onClick={() => {
                      this.setState({ currentTab: 2 });
                    }}
                  >
                    <div className="relativeContainer">
                      <span className="redAsterisk tab">*</span>
                      {i18n('app.pages.contract.abi')}
                    </div>
                  </button>
                </div>

                <TabContent>
                  <div className={currentTab === 1 ? 'ui bottom attached segment active tab' : 'ui bottom attached segment tab'}>
                    <StyledTabelWrapper>
                      <div className="ui fluid card">
                        <div className="content">
                          <div className="contentHeader" />
                          <AceEditor
                            style={AceEditorStyle}
                            mode="solidity"
                            theme="github"
                            name="UNIQUE_ID_OF_DIV"
                            editorProps={{ $blockScrolling: true }}
                            showGutter
                            showPrintMargin={false}
                            onChange={this.handleSourceChange}
                            value={sourceCode}
                          />
                        </div>
                      </div>
                    </StyledTabelWrapper>
                  </div>
                  <div className={currentTab === 2 ? 'ui bottom attached segment active tab' : 'ui bottom attached segment tab'}>
                    <StyledTabelWrapper>
                      <div className="ui fluid card">
                        <div className="content abiContainer">
                          <div className="contentHeader" />
                          <textarea
                            spellCheck="false"
                            rows="5"
                            name="inputData"
                            value={abiVal}
                            className="textAreaContainer"
                            onChange={(e) => this.handleAbiChange(e)}
                          />
                        </div>
                      </div>
                    </StyledTabelWrapper>
                  </div>
                </TabContent>
              </TabZone>
              <ContentBottomContainer>
                <div className="leftContainer">
                  <div className="relativeContainer labelText">
                    <span className="redAsterisk">*</span>
                    {i18n('app.pages.contract.typeinAdminPassword')}
                  </div>
                  <div className="ui input inputContainer">
                    <input className="inputItem" type="password" value={passwordVal} onChange={(e) => this.handlePasswordChange(e)} />
                  </div>
                </div>
                <div>
                  {canSubmit ? (
                    <button type="button" className="submitBtn" onClick={() => this.submitClick()}>
                      {i18n('app.common.submit')}
                    </button>
                  ) : (
                    <Popup
                      trigger={
                        <button type="button" className="submitBtn disabled" onClick={() => false}>
                          {i18n('app.common.submit')}
                        </button>
                      }
                      content={i18n('app.common.submitTips')}
                      position="top center"
                      inverted
                      style={stylePopup}
                    />
                  )}
                </div>
              </ContentBottomContainer>
            </StyledTabel>
          }
        </Wrapper>
      </div>
    );
  }
}
ContractUpdate.propTypes = {
  history: PropTypes.shape({
    replace: PropTypes.func,
  }).isRequired,
};
ContractUpdate.defaultProps = {};
export default withRouter(ContractUpdate);
