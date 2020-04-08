/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Icon } from 'semantic-ui-react';
import media from '../../globalStyles/media';
import { i18n } from '../../utils';

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  ${media.mobile`
    width: 95%;
    margin: 0 auto;
  `}
`;

const StyledTabel = styled.div`
  /* margin-top: 20px;
  width: 100%;
  background: #fff;
  border-radius: 4px !important;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.12) !important; */
  ${media.mobile`
    margin: 0 auto;
    overflow-x: scroll;
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
    ${media.mobile`
      padding: 0.1em 2em 0.1em 2em !important;
    `}
    background: #edf2f9 !important;
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

  .inputContainer {
    width: 400px;
    height: 36px;
    border-radius: 4px;
  }

  .inputItem {
    padding-left: 5px !important;
    &::placeholder {
      color: #898989;
      font-size: 16px;
      line-height: 19px;
    }
  }

  .ui.disabled.input {
    opacity: 1;
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
  }

  .customBtn {
    background: #fff;
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    color: #000;
    font-size: 16px;
    font-weight: bold;
    line-height: 36px;
    text-align: center;
    border: 1px solid rgba(224, 225, 226, 1);
    &.disabled {
      color: rgba(0, 0, 0, 0.5);
    }
  }

  .removeText {
    color: rgba(64, 90, 231, 1);
    margin-top: 10px;
    &.disabled {
      color: rgba(64, 90, 231, 0.5);
    }
  }

  .fixed-first {
    width: 443px;
  }

  .redAsterisk {
    position: absolute;
    color: red;
    top: 4px;
    left: -8px;
  }
  .asteriskContainer {
    display: inline-block;
    text-align: top;
  }

  .relativeContainer {
    position: relative;
    &.disabled {
      opacity: 40%;
    }
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

const IconItem = styled.div`
  display: inline-block;
  width: 42px;
  height: 42px;
  background-image: url(${(props) => props.url});
  background-repeat: no-repeat;
  background-size: cover;
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

  .ui.dropdown {
    width: 100%;
    justify-content: space-around;
    border: 1px solid #e0e1e2;
    border-radius: 4px !important;

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

const filterKeys = ['General Contract', 'ERC20', 'ERC777', 'FansCoin'];
class ContractUpdate extends Component {
  fileInputRef = React.createRef();

  constructor(...args) {
    super(...args);
    this.state = {
      defaultContractIcon:
        'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIxMDBweCIgaGVpZ2h0PSIxMDBweCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+ICAgICAgICA8dGl0bGU+55S75p2/5aSH5Lu9PC90aXRsZT4gICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+ICAgIDxnIGlkPSLnlLvmnb/lpIfku70iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPiAgICAgICAgPGcgaWQ9ImNvbnRyYWN0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNS4wMDAwMDAsIDMyLjAwMDAwMCkiPiAgICAgICAgICAgIDxnIGlkPSJDb250cmFjdCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDAuMTQyODU3KSIgZmlsbC1ydWxlPSJub256ZXJvIj4gICAgICAgICAgICAgICAgPHBhdGggZD0iTTE3LjYxNDE4LDE0LjU2NDczMjEgTDQ3LjExNzk2MjgsMTQuNTY0NzMyMSBDNDguNzQxMDM5NSwxNC41NjQ3MzIxIDQ5LjMyOTYxNjIsMTQuNzMzNzYzOCA0OS45MjI5NjY5LDE1LjA1MTAzMiBDNTAuNTE2MzE3NiwxNS4zNjgzODExIDUwLjk4MjA2NTIsMTUuODM0MTI4NSA1MS4yOTkzMzM0LDE2LjQyNzQ3OSBDNTEuNjE2NjgyNiwxNy4wMjA4Mjk2IDUxLjc4NTcxNDMsMTcuNjA5NDA2MSA1MS43ODU3MTQzLDE5LjIzMjQ4MjQgTDUxLjc4NTcxNDMsMzUuNzg5ODM5IEM1MS43ODU3MTQzLDM3LjQxMjkxNTMgNTEuNjE2NjgyNiwzOC4wMDE0OTE5IDUxLjI5OTQxNDMsMzguNTk0ODQyNCBDNTAuOTgyMDY1MiwzOS4xODgxOTMgNTAuNTE2MzE3NiwzOS42NTM5NDA0IDQ5LjkyMjk2NjksMzkuOTcxMjA4NSBDNDkuMzI5NjE2Miw0MC4yODg1NTc2IDQ4Ljc0MTAzOTUsNDAuNDU3NTg5MyA0Ny4xMTc5NjI4LDQwLjQ1NzU4OTMgTDE3LjYxNDE4LDQwLjQ1NzU4OTMgQzE1Ljk5MTEwMzMsNDAuNDU3NTg5MyAxNS40MDI1MjY2LDQwLjI4ODU1NzYgMTQuODA5MTc1OSwzOS45NzEyODk0IEMxNC4yMTU4MjUyLDM5LjY1Mzk0MDQgMTMuNzUwMDc3NywzOS4xODgxOTMgMTMuNDMyODA5NSwzOC41OTQ4NDI0IEMxMy4xMTU0NjAzLDM4LjAwMTQ5MTkgMTIuOTQ2NDI4NiwzNy40MTI5MTUzIDEyLjk0NjQyODYsMzUuNzg5ODM5IEwxMi45NDY0Mjg2LDE5LjIzMjQ4MjQgQzEyLjk0NjQyODYsMTcuNjA5NDA2MSAxMy4xMTU0NjAzLDE3LjAyMDgyOTYgMTMuNDMyNzI4NSwxNi40Mjc0NzkgQzEzLjc1MDA3NzcsMTUuODM0MTI4NSAxNC4yMTU4MjUyLDE1LjM2ODM4MTEgMTQuODA5MTc1OSwxNS4wNTExMTI5IEMxNS40MDI1MjY2LDE0LjczMzc2MzggMTUuOTkxMTAzMywxNC41NjQ3MzIxIDE3LjYxNDE4LDE0LjU2NDczMjEgWiIgaWQ9Iui3r+W+hCIgZmlsbD0iI0MyRUJGRiI+PC9wYXRoPiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTEuMTQwOTY1OCw4LjA5MTUxNzg2IEw0MC42NDQ3NDg1LDguMDkxNTE3ODYgQzQyLjI2NzgyNTIsOC4wOTE1MTc4NiA0Mi44NTY0MDE5LDguMjYwNTQ5NTMgNDMuNDQ5NzUyNiw4LjU3NzgxNzcgQzQ0LjA0MzEwMzMsOC44OTUxNjY3OCA0NC41MDg4NTA5LDkuMzYwOTE0MTkgNDQuODI2MTE5MSw5Ljk1NDI2NDczIEM0NS4xNDM0NjgzLDEwLjU0NzYxNTMgNDUuMzEyNSwxMS4xMzYxOTE4IDQ1LjMxMjUsMTIuNzU5MjY4MSBMNDUuMzEyNSwyOS4zMTY2MjQ3IEM0NS4zMTI1LDMwLjkzOTcwMSA0NS4xNDM0NjgzLDMxLjUyODI3NzYgNDQuODI2MiwzMi4xMjE2MjgxIEM0NC41MDg4NTA5LDMyLjcxNDk3ODcgNDQuMDQzMTAzMywzMy4xODA3MjYxIDQzLjQ0OTc1MjYsMzMuNDk3OTk0MiBDNDIuODU2NDAxOSwzMy44MTUzNDMzIDQyLjI2NzgyNTIsMzMuOTg0Mzc1IDQwLjY0NDc0ODUsMzMuOTg0Mzc1IEwxMS4xNDA5NjU4LDMzLjk4NDM3NSBDOS41MTc4ODkwNCwzMy45ODQzNzUgOC45MjkzMTIzNCwzMy44MTUzNDMzIDguMzM1OTYxNjQsMzMuNDk4MDc1MiBDNy43NDI2MTA5NSwzMy4xODA3MjYxIDcuMjc2ODYzNDIsMzIuNzE0OTc4NyA2Ljk1OTU5NTE3LDMyLjEyMTYyODEgQzYuNjQyMTY1MDksMzEuNTI4Mjc3NiA2LjQ3MzIxNDI5LDMwLjkzOTcwMSA2LjQ3MzIxNDI5LDI5LjMxNjYyNDcgTDYuNDczMjE0MjksMTIuNzU5MjY4MSBDNi40NzMyMTQyOSwxMS4xMzYxOTE4IDYuNjQyMjQ2MDEsMTAuNTQ3NjE1MyA2Ljk1OTUxNDI2LDkuOTU0MjY0NzMgQzcuMjc2ODYzNDIsOS4zNjA5MTQxOSA3Ljc0MjYxMDk1LDguODk1MTY2NzggOC4zMzU5NjE2NCw4LjU3Nzg5ODYyIEM4LjkyOTMxMjM0LDguMjYwNTQ5NTMgOS41MTc4ODkwNCw4LjA5MTUxNzg2IDExLjE0MDk2NTgsOC4wOTE1MTc4NiBMMTEuMTQwOTY1OCw4LjA5MTUxNzg2IFoiIGlkPSLot6/lvoQiIGZpbGw9IiM1NzlBRkYiPjwvcGF0aD4gICAgICAgICAgICAgICAgPHBhdGggZD0iTTM0LjE3MTUzNDIsMCBDMzUuNzk0NjExLDAgMzYuMzgzMTg3NywwLjE2OTAzMTY3NiAzNi45NzY1Mzg0LDAuNDg2Mjk5ODQzIEMzNy41Njk4ODkxLDAuODAzNjQ4OTI2IDM4LjAzNTYzNjYsMS4yNjkzOTYzMyAzOC4zNTI5MDQ4LDEuODYyNzQ2ODcgQzM4LjY3MDI1NCwyLjQ1NjA5NzQxIDM4LjgzOTI4NTcsMy4wNDQ2NzM5NiAzOC44MzkyODU3LDQuNjY3NzUwMjYgTDM4LjgzOTI4NTcsMjEuMjI1MTA2OSBDMzguODM5Mjg1NywyMi44NDgxODMyIDM4LjY3MDI1NCwyMy40MzY3NTk3IDM4LjM1Mjk4NTcsMjQuMDMwMTEwMyBDMzguMDM1NjM2NiwyNC42MjM0NjA4IDM3LjU2OTg4OTEsMjUuMDg5MjA4MiAzNi45NzY1Mzg0LDI1LjQwNjQ3NjQgQzM2LjM4MzE4NzcsMjUuNzIzODI1NSAzNS43OTQ2MTEsMjUuODkyODU3MSAzNC4xNzE1MzQyLDI1Ljg5Mjg1NzEgTDQuNjY3NzUxNDgsMjUuODkyODU3MSBDMy4wNDQ2NzQ3NSwyNS44OTI4NTcxIDIuNDU2MDk4MDUsMjUuNzIzODI1NSAxLjg2Mjc0NzM2LDI1LjQwNjU1NzMgQzEuMjY5Mzk2NjYsMjUuMDg5MjA4MiAwLjgwMzY0OTEzNSwyNC42MjM0NjA4IDAuNDg2MzgwODg1LDI0LjAzMDExMDMgQzAuMTY4OTUwODA1LDIzLjQzNjc1OTcgMCwyMi44NDgxODMyIDAsMjEuMjI1MTA2OSBMMCw0LjY2Nzc1MDI2IEMwLDMuMDQ0NjczOTYgMC4xNjkwMzE3MiwyLjQ1NjA5NzQxIDAuNDg2Mjk5OTcsMS44NjI3NDY4NyBDMC44MDM2NDkxMzUsMS4yNjkzOTYzMyAxLjI2OTM5NjY2LDAuODAzNjQ4OTI2IDEuODYyNzQ3MzYsMC40ODYzODA3NTggQzIuNDU2MDk4MDUsMC4xNjg5NTA3NjEgMy4wNDQ2NzQ3NSwwIDQuNjY3NzUxNDgsMCBMMzQuMTcxNTM0MiwwIFoiIGlkPSLot6/lvoQiIGZpbGw9IiMxNzMyRTYiPjwvcGF0aD4gICAgICAgICAgICAgICAgPHBhdGggZD0iTTExLjkyMTUwMyw2LjQ3MzIxNDI4IEwyOC41MzYwODYzLDYuNDczMjE0MjggTDI4LjUzNjA4NjMsNi40NzMyMTQyOCBDMjguODYzODAwMSw2LjQ3MzIxNDI4IDI5LjEyOTQ2NDMsNi45MDc5Mzc1NSAyOS4xMjk0NjQzLDcuNDQ0MTk2NDMgQzI5LjEyOTQ2NDMsNy45ODA0NTUzIDI4Ljg2MzgwMDEsOC40MTUxNzg1NyAyOC41MzYwODYzLDguNDE1MTc4NTcgTDExLjkyMTUwMyw4LjQxNTE3ODU3IEwxMS45MjE1MDMsOC40MTUxNzg1NyBDMTEuNTkzNzg5Miw4LjQxNTE3ODU3IDExLjMyODEyNSw3Ljk4MDQ1NTMgMTEuMzI4MTI1LDcuNDQ0MTk2NDMgQzExLjMyODEyNSw2LjkwNzkzNzU1IDExLjU5Mzc4OTIsNi40NzMyMTQyOCAxMS45MjE1MDMsNi40NzMyMTQyOCBMMTEuOTIxNTAzLDYuNDczMjE0MjggWiBNMTEuOTUwNTQ5NSwxMi4xMzcyNzY4IEwyNi44ODg3MzYzLDEyLjEzNzI3NjggTDI2Ljg4ODczNjMsMTIuMTM3Mjc2OCBDMjcuMjMyNDkyLDEyLjEzNzI3NjggMjcuNTExMTYwNywxMi41NzIwMDAxIDI3LjUxMTE2MDcsMTMuMTA4MjU4OSBDMjcuNTExMTYwNywxMy42NDQ1MTc4IDI3LjIzMjQ5MiwxNC4wNzkyNDExIDI2Ljg4ODczNjMsMTQuMDc5MjQxMSBMMTEuOTUwNTQ5NSwxNC4wNzkyNDExIEwxMS45NTA1NDk0LDE0LjA3OTI0MTEgQzExLjYwNjc5MzgsMTQuMDc5MjQxMSAxMS4zMjgxMjUsMTMuNjQ0NTE3OCAxMS4zMjgxMjUsMTMuMTA4MjU4OSBDMTEuMzI4MTI1LDEyLjU3MjAwMDEgMTEuNjA2NzkzOCwxMi4xMzcyNzY4IDExLjk1MDU0OTQsMTIuMTM3Mjc2OCBMMTEuOTUwNTQ5NSwxMi4xMzcyNzY4IFogTTExLjk3NTQ0NjUsMTcuODAxMzM5MyBMMjAuMzkwNjI1LDE3LjgwMTMzOTMgTDIwLjM5MDYyNSwxNy44MDEzMzkzIEMyMC43NDgxMzA5LDE3LjgwMTMzOTMgMjEuMDM3OTQ2NCwxOC4yMzYwNjI2IDIxLjAzNzk0NjQsMTguNzcyMzIxNCBDMjEuMDM3OTQ2NCwxOS4zMDg1ODAzIDIwLjc0ODEzMDksMTkuNzQzMzAzNiAyMC4zOTA2MjUsMTkuNzQzMzAzNiBMMTEuOTc1NDQ2NSwxOS43NDMzMDM2IEwxMS45NzU0NDY0LDE5Ljc0MzMwMzYgQzExLjYxNzk0MDUsMTkuNzQzMzAzNiAxMS4zMjgxMjUsMTkuMzA4NTgwMyAxMS4zMjgxMjUsMTguNzcyMzIxNCBDMTEuMzI4MTI1LDE4LjIzNjA2MjYgMTEuNjE3OTQwNSwxNy44MDEzMzkzIDExLjk3NTQ0NjQsMTcuODAxMzM5MyBMMTEuOTc1NDQ2NSwxNy44MDEzMzkzIFoiIGlkPSLlvaLnirYiIGZpbGw9IiNGRkZGRkYiPjwvcGF0aD4gICAgICAgICAgICA8L2c+ICAgICAgICAgICAgPGcgaWQ9InNwYXJrIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzLjU3MTQyOSwgMy43MTQyODYpIiBmaWxsPSIjRkZGRkZGIj4gICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0i5qSt5ZyG5b2iIiBjeD0iMS4wNzE0Mjg1NyIgY3k9IjEuMDcxNDI4NTciIHI9IjEuMDcxNDI4NTciPjwvY2lyY2xlPiAgICAgICAgICAgICAgICA8Y2lyY2xlIGlkPSLmpK3lnIblvaLlpIfku70iIGN4PSIxLjA3MTQyODU3IiBjeT0iNy4zMjE0Mjg1NyIgcj0iMS4wNzE0Mjg1NyI+PC9jaXJjbGU+ICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9IuakreWchuW9ouWkh+S7vS0yIiBjeD0iMS4wNzE0Mjg1NyIgY3k9IjEzLjU3MTQyODYiIHI9IjEuMDcxNDI4NTciPjwvY2lyY2xlPiAgICAgICAgICAgIDwvZz4gICAgICAgIDwvZz4gICAgPC9nPjwvc3ZnPg==',
      iconSource: '',
      selectedContractType: 'General Contract',
    };
  }

  componentDidMount() {}

  handleImageChange(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        iconSource: reader.result,
      });
    };

    reader.readAsDataURL(file);
  }

  removePhoto() {
    this.setState({
      iconSource: '',
    });
  }

  render() {
    const {
      match: { params },
    } = this.props;
    const { defaultContractIcon, iconSource, selectedContractType } = this.state;
    const displayTest = {
      display: 'none',
    };
    return (
      <div>
        <Wrapper>
          <HeadBar>
            <h1>{i18n('app.pages.contract.edit')}</h1>
            <p>{params.address}</p>
          </HeadBar>
          <StyledTabel>
            <table className="ui celled structured table">
              <tbody className="tbodyContainer">
                <tr className="centered">
                  <td className="collapsing top">{i18n('app.pages.contract.address')}</td>
                  <td className="aligned top fixed-first">
                    <div className="ui input disabled inputContainer">
                      <input className="inputItem" type="text" placeholder={params.address} />
                    </div>
                  </td>
                  <td rowSpan="3" className="center aligned init">
                    <div className="iconContainer">
                      <IconItem url={iconSource || defaultContractIcon} />
                    </div>
                  </td>
                  <td rowSpan="3" className="center aligned init">
                    <div>
                      <input
                        type="file"
                        name="File"
                        style={displayTest}
                        accept="image/*"
                        ref={this.fileInputRef}
                        onChange={(e) => {
                          this.handleImageChange(e);
                        }}
                      />
                      <button type="button" className="customBtn" onClick={() => this.fileInputRef.current.click()}>
                        {i18n('app.pages.contract.uploadIcon')}
                      </button>
                      <div
                        className="removeText"
                        onClick={() => {
                          this.removePhoto();
                        }}
                      >
                        {i18n('app.pages.contract.removePhoto')}
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="collapsing">{i18n('Name(Eng/中文)')}</td>
                  <td className="aligned">
                    <div className="ui input inputContainer">
                      <input className="inputItem" type="text" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="collapsing bottom">{i18n('app.directory.website.title')}</td>
                  <td className="aligned bottom">
                    <div className="ui input inputContainer">
                      <input className="inputItem" type="text" />
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
                      {i18n('app.pages.contract.contractType')}
                      <Icon name="asterisk" className="redAsterisk" size="mini" />
                    </div>
                  </td>
                  <td className="aligned top fixed-first">
                    <div className="ui input disabled inputContainer">
                      <FilterSelector>
                        <div className="ui dropdown link item">
                          <span>{selectedContractType}</span>
                          <i className="dropdown icon" />
                          <div className="menu transition visible">
                            {filterKeys.map((name, index) => (
                              <div
                                key={name}
                                className="item priority"
                                role="button"
                                tabIndex={index}
                                onClick={() => this.setState({ selectedContractType: name })}
                                onKeyPress={() => this.setState({ selectedContractType: name })}
                              >
                                {name}
                              </div>
                            ))}
                          </div>
                        </div>
                      </FilterSelector>
                    </div>
                  </td>
                  <td rowSpan="4" className="center aligned init">
                    <div className="iconContainer">
                      <IconItem url={iconSource || defaultContractIcon} />
                    </div>
                  </td>
                  <td rowSpan="4" className="center aligned init">
                    <div>
                      <input
                        type="file"
                        name="File"
                        style={displayTest}
                        accept="image/*"
                        ref={this.fileInputRef}
                        onChange={(e) => {
                          this.handleImageChange(e);
                        }}
                      />
                      <button
                        type="button"
                        className={selectedContractType === 'General Contract' ? 'customBtn disabled' : 'customBtn'}
                        onClick={() => (selectedContractType === 'General Contract' ? false : this.fileInputRef.current.click())}
                      >
                        {i18n('app.pages.contract.uploadIcon')}
                      </button>
                      <div
                        className={selectedContractType === 'General Contract' ? 'removeText disabled' : 'removeText'}
                        onClick={() => {
                          selectedContractType === 'General Contract' ? false : this.removePhoto();
                        }}
                      >
                        {i18n('app.pages.contract.removePhoto')}
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="collapsing">
                    <div className={selectedContractType === 'General Contract' ? 'relativeContainer disabled' : 'relativeContainer'}>
                      {i18n('app.pages.contract.tokenName')}
                      <Icon name="asterisk" className="redAsterisk" size="mini" />
                    </div>
                  </td>
                  <td className="aligned">
                    <div className="ui input inputContainer">
                      <input className="inputItem" type="text" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="collapsing">
                    <div className={selectedContractType === 'General Contract' ? 'relativeContainer disabled' : 'relativeContainer'}>
                      {i18n('app.pages.contract.tokenSymbol')}
                      <Icon name="asterisk" className="redAsterisk" size="mini" />
                    </div>
                  </td>
                  <td className="aligned">
                    <div className="ui input inputContainer">
                      <input className="inputItem" type="text" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="collapsing bottom">
                    <div className={selectedContractType === 'General Contract' ? 'relativeContainer disabled' : 'relativeContainer'}>
                      {i18n('app.pages.contract.decimals')}
                      <Icon name="asterisk" className="redAsterisk" size="mini" />
                    </div>
                  </td>
                  <td className="aligned bottom">
                    <div className="ui input inputContainer">
                      <input className="inputItem" type="text" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </StyledTabel>
        </Wrapper>
      </div>
    );
  }
}
ContractUpdate.propTypes = {
  match: PropTypes.objectOf(PropTypes.string),
};
ContractUpdate.defaultProps = {
  match: {},
};
export default withRouter(ContractUpdate);
