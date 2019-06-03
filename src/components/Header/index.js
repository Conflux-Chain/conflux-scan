// Header Component

import React, { Component, useState } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import styled from 'styled-components';

import SearchBox from '../SearchBox';
import LogoImage from '../../assets/images/logo-b@2.png';

const Wrapper = styled.header`
  display: flex;
  width: 100%;
  height: 72px;
  padding: 0 25px;
  justify-content: space-between;
  text-align: left;
  border-bottom: 1px solid #ccc;
  background-color: #fff;
`;

const Logo = styled.div`
  margin-top: 23px;
  margin-right: 30px;

  img {
    width: 130px;
  }
`;

const SearchBoxContainer = styled.div`
  width: 100%;
  margin-top: 17px;
`;

const LangSelector = styled.div.attrs({
  className: 'ui menu compact',
})`
  margin-top: 14px !important;
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

function Header(props) {
  console.log('header', props);
  const { changeLanguage, intl } = props;
  const langs = ['en', 'zh'];

  return (
    <Wrapper>
      <Logo>
        <NavLink to="/">
          <img src={LogoImage} alt="Conflux Logo" />
        </NavLink>
      </Logo>
      <SearchBoxContainer>
        <SearchBox />
      </SearchBoxContainer>
      <LangSelector>
        <div className="ui dropdown link item">
          <span className="text">
            <FormattedMessage id={'app.header.lang.' + intl.locale} />
          </span>
          <i className="dropdown icon" />
          <div className="menu transition visible">
            {langs
              .filter((v) => v !== intl.locale)
              .map((lang) => (
                <div
                  className="item"
                  onClick={() => changeLanguage(lang)}
                  onKeyPress={() => changeLanguage(lang)}
                  role="menuitem"
                  tabIndex={0}
                  key={lang}
                >
                  <FormattedMessage id={'app.header.lang.' + lang} />
                </div>
              ))}
          </div>
        </div>
      </LangSelector>
    </Wrapper>
  );
}

Header.propTypes = {
  intl: intlShape.isRequired,
  changeLanguage: PropTypes.func.isRequired,
};

export default injectIntl(Header);
