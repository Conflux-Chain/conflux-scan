// Header Component

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import styled from 'styled-components';
import classnames from 'classnames';

import SearchBox from '../SearchBox';
import LogoBlack from '../../assets/images/logo-b@2.png';

const Wrapper = styled.header`
  width: 100%;
  padding: 0 25px;
  text-align: left;
  height: 72px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  background-color: #fff;
`;

const Logo = styled.div`
  margin-top: 24px;
  margin-right: 30px;
  img {
    width: 130px;
    transition: 0.4s transform;

    &:hover {
      //transform: scale(1.05);
    }
  }
`;

const SearchBoxContainer = styled.div`
  width: 100%;
  margin-top: 17px;
`;

const LangSelector = styled.div.attrs({
  className: 'ui menu compact',
})`
  margin-top: 15px !important;
  width: 125px;
  padding-bottom: 16px;
  border: none !important;
  box-shadow: none !important;

  .ui.dropdown {
    width: 100%;
    justify-content: space-around;
    border: 1px solid #ccc;
    border-radius: 40px !important;

    .menu > .item {
      outline: none;
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

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { lang: props.intl.locale };
  }

  changeLanguage(data) {
    const { changeLanguage } = this.props;
    this.setState({ lang: data });
    changeLanguage(data);
  }

  render() {
    const { lang } = this.state;
    const langs = [{ value: 'en', text: 'English' }, { value: 'zh', text: '中文' }];

    return (
      <Wrapper>
        <Logo>
          <NavLink to="/">
            <img src={LogoBlack} alt="Conflux Logo" />
          </NavLink>
        </Logo>
        <SearchBoxContainer>
          <SearchBox />
        </SearchBoxContainer>
        <LangSelector>
          <div className="ui dropdown link item">
            <span className="text">{langs.find((v) => v.value === lang).text}</span>
            <i className="dropdown icon" />
            <div className="menu transition visible">
              {langs
                .filter((v) => v.value !== lang)
                .map((l) => (
                  <div
                    className="item"
                    onClick={() => this.changeLanguage(l.value)}
                    onKeyPress={() => this.changeLanguage(l.value)}
                    role="menuitem"
                    tabIndex={0}
                    key={l.value}
                  >
                    {l.text}
                  </div>
                ))}
            </div>
          </div>
        </LangSelector>
      </Wrapper>
    );
  }
}

Header.propTypes = {
  intl: intlShape.isRequired,
  changeLanguage: PropTypes.func.isRequired,
};
export default injectIntl(Header);
