// Header Component

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import styled from 'styled-components';
import { Dropdown, Menu } from 'semantic-ui-react';

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

const LangSelector = styled(Menu)`
  margin-top: 15px !important;
  width: 125px;
  height: 40px;
  border-radius: 40px !important;
`;

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { lang: props.intl.locale };
    this.changeLanguage = this.changeLanguage.bind(this);
  }

  changeLanguage(event, data) {
    const { changeLanguage } = this.props;
    this.setState({ lang: data.value });
    changeLanguage(data.value);
  }

  render() {
    const { lang } = this.state;
    const options = [{ key: 1, text: 'English', value: 'en' }, { key: 2, text: '中文', value: 'zh' }];

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
        <LangSelector compact>
          <Dropdown options={options} simple item defaultValue={lang} onChange={this.changeLanguage} />
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
