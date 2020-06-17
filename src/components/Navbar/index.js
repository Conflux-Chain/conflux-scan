// Navbar Component

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import styled from 'styled-components';
import { compose } from 'redux';
import { connect } from 'react-redux';
import media from '../../globalStyles/media';
import tokenMenu from '../../assets/images/icons/token-menu.svg';

const Wrapper = styled.div`
  position: fixed;
  top: 72px;
  left: 0;
  bottom: 0;
  width: 120px;
  max-height: calc(100vh - 72px);
  padding: 0;
  text-align: center;
  /* background-color: #1f204c; */
  z-index: 99;
  overflow-x: hidden;
  overflow-y: auto;

  ${media.pad`
    top: 56px;
    left: -120px;
    max-height: calc(100vh - 56px);
    transition: 0.2s all ease-out;

    &.show {
      left: 0;
      // animation: bounce-in-left 0.5s forwards;
    }
  `}

  @keyframes bounce-in-left {
    0% {
      transform: translateX(-600px);
      animation-timing-function: ease-in;
    }
    30% {
      transform: translateX(0);
      animation-timing-function: ease-out;
    }
    45% {
      transform: translateX(-40px);
      animation-timing-function: ease-in;
    }
    60% {
      transform: translateX(0);
      animation-timing-function: ease-out;
    }
  }
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
      > img {
        margin-bottom: 12px;
        margin-top: 6px;
      }

      &.hover,
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

  &.testnet li a {
    &.hover,
    &.actived {
      font-weight: 700;
      background-color: #4c5163;
    }
  }
`;

function cleanState() {
  const event = new Event('clean_state');
  const eventHideNavBar = new Event('hide-nav-bar');
  setTimeout(() => {
    document.dispatchEvent(event);
    document.dispatchEvent(eventHideNavBar);
  }, 0);
}

function Navbar(props) {
  const { location, showNavbar } = props;
  const blocktxnPaths = [
    'blocktxn',
    'blocks',
    'blocksdetail',
    'transactions',
    'transactionsdetail',
    'accountdetail',
    'epochsdetail',
    'address',
  ];
  const directoryPaths = ['directory', 'topholders'];
  const tokenPaths = ['token'];
  const { common } = props;

  return (
    <Wrapper
      className={showNavbar ? 'show' : ''}
      style={{
        backgroundColor: common.network === 'testnet' ? '#282B34' : ' #1f204c',
      }}
    >
      <Menu className={common.network}>
        <li>
          <NavLink exact to="/" activeClassName="actived" onClick={cleanState}>
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
            onClick={cleanState}
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
            to="/token"
            activeClassName="actived"
            onClick={cleanState}
            isActive={() => !!tokenPaths.find((v) => location.pathname.indexOf('/' + v) === 0)}
          >
            <img src={tokenMenu} />
            <FormattedMessage id="app.navbar.token" />
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/directory"
            activeClassName="actived"
            onClick={cleanState}
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
  showNavbar: PropTypes.bool.isRequired,
  common: PropTypes.objectOf({
    network: PropTypes.string,
  }).isRequired,
};

Navbar.defaultProps = {
  location: {
    pathname: window.location.pathname,
  },
};

function mapStateToProps(state) {
  return {
    common: state.common,
  };
}

const enhance = compose(
  withRouter,
  injectIntl,
  connect(mapStateToProps)
);

export default enhance(Navbar);
