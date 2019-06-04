// Navbar Component

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: fixed;
  top: 72px;
  left: 0;
  bottom: 0;
  width: 120px;
  max-height: calc(100vh - 72px);
  padding: 0;
  text-align: center;
  background-color: #1f204c;
  z-index: 999;
  overflow-x: hidden;
  overflow-y: auto;
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

function Navbar(props) {
  const { location } = props;
  const blocktxnPaths = ['blocktxn', 'blocks', 'blocksdetail', 'transactions', 'transactionsdetail', 'accountdetail', 'epochsdetail'];
  const directoryPaths = ['directory', 'topholders'];

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
          <NavLink
            to="/blocktxn"
            activeClassName="actived"
            isActive={() => !!blocktxnPaths.find((v) => location.pathname.indexOf('/' + v) === 0)}
          >
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#iconqukuaigaoduxuanzhong" />
            </svg>
            <FormattedMessage id="app.navbar.blocksAndTxs" />
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/directory"
            activeClassName="actived"
            isActive={() => !!directoryPaths.find((v) => location.pathname.indexOf('/' + v) === 0)}
          >
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

Navbar.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
};

Navbar.defaultProps = {
  location: {
    pathname: window.location.pathname,
  },
};

export default withRouter(injectIntl(Navbar));
