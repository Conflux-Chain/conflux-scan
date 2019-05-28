// Navbar Component

import React, { Component } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';

const Wrapper = styled.div`
  position: fixed;
  top: 72px;
  left: 0;
  bottom: 0;
  width: 120px;
  padding: 0;
  text-align: center;
  background-color: #1f204c;
  z-index: 999;
`;

const Menu = styled.ul`
  display: flex;
  margin: 0 auto;
  padding: 0;
  flex-direction: column;
  justify-content: center;
  align-content: center;

  li {
    display: block;
    list-style: none;

    a {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-content: center;
      height: 120px;
      padding: 10px;
      line-height: 1.2;
      font-size: 12px;
      color: #ffffff;
      transition: all 0.2s ease-in-out;

      &:hover,
      &.actived {
        font-weight: 700;
        background-color: #1e3de4;
      }

      .icon {
        display: block;
        width: 32px;
        height: 32px;
        margin: 6px auto 12px;
        fill: #fff;
        overflow: hidden;
      }
    }
  }
`;

function Navbar() {
  return (
    <Wrapper>
      <Menu>
        <li>
          <NavLink exact to="/" activeClassName="actived">
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icondashboard" />
            </svg>
            <FormattedMessage id="app.navbar.home" />
          </NavLink>
        </li>
        <li>
          <NavLink to="/blocktxn" activeClassName="actived">
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#iconqukuaigaoduxuanzhong" />
            </svg>
            <FormattedMessage id="app.navbar.blocksAndTxs" />
          </NavLink>
        </li>
        <li>
          <NavLink to="/directory" activeClassName="actived">
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#iconbaipishu" />
            </svg>
            <FormattedMessage id="app.navbar.directory" />
          </NavLink>
        </li>
      </Menu>
    </Wrapper>
  );
}

export default injectIntl(Navbar);
