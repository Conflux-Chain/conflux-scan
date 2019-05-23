import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import SearchBox from '../SearchBox';

const Wrapper = styled.header`
  width: 100%;
  padding: 10px 0;
  text-align: center;
  border-bottom: 1px solid #ccc;
`;

const Logo = styled.div``;

const Menu = styled.ul`
  display: flex;
  margin: 10px auto;
  justify-content: center;
  align-content: center;

  li {
    list-style: none;
    margin: 0 10px;
  }
`;

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { lang: props.locale };
    this.changeLanguage = this.changeLanguage.bind(this);
  }

  changeLanguage(event) {
    const { changeLanguage } = this.props;
    this.setState({ lang: event.target.value });
    changeLanguage(event.target.value);
  }

  render() {
    const { lang } = this.state;
    return (
      <Wrapper>
        <Logo />
        <SearchBox />
        <Menu>
          <li>
            <Link to="/">
              <FormattedMessage id="app.head.menu.home" />
            </Link>
          </li>
          <li>
            <Link to="/blocktxn">
              <FormattedMessage id="app.head.menu.blocksAndTxs" />
            </Link>
          </li>
          <li>
            <Link to="/directory">
              <FormattedMessage id="app.head.menu.directory" />
            </Link>
          </li>
          <li>
            <Link to="/more">
              <FormattedMessage id="app.head.menu.more" />
            </Link>
          </li>
          <li>
            <select value={lang} onChange={this.changeLanguage}>
              <option value="en">英文</option>
              <option value="zh">中文</option>
            </select>
          </li>
        </Menu>
      </Wrapper>
    );
  }
}

Header.propTypes = {
  locale: PropTypes.string.isRequired,
  changeLanguage: PropTypes.func.isRequired,
};
export default injectIntl(Header);
