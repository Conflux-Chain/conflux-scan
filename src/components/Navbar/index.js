// Navbar Component

import React, { Component } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';

const Wrapper = styled.header`
  width: 100%;
  padding: 10px 0;
  text-align: center;
  border-bottom: 1px solid #ccc;
`;

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

function Navbar() {
  return (
    <Wrapper>
      <Menu>
        <li>
          <NavLink exact to="/" activeClassName="actived">
            <FormattedMessage id="app.head.menu.home" />
          </NavLink>
        </li>
        <li>
          <NavLink to="/blocktxn" activeClassName="actived">
            <FormattedMessage id="app.head.menu.blocksAndTxs" />
          </NavLink>
        </li>
        <li>
          <NavLink to="/directory" activeClassName="actived">
            <FormattedMessage id="app.head.menu.directory" />
          </NavLink>
        </li>
        <li>
          <NavLink to="/more" activeClassName="actived">
            <FormattedMessage id="app.head.menu.more" />
          </NavLink>
        </li>
      </Menu>
    </Wrapper>
  );
}

export default injectIntl(Navbar);
