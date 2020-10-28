import * as Sentry from '@sentry/browser';
import PropTypes from 'prop-types';
import React, { Component, useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { addLocaleData, IntlProvider } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import zhLocaleData from 'react-intl/locale-data/zh';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { UPDATE_COMMON } from './constants';
import media from './globalStyles/media';

// components
import Router from './route/router';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ToastComp } from './components/Toast';
import { NoticeComp } from './components/Message/notice';

// styles
import './assets/semantic-ui/semantic.css';
import './globalStyles/icons.less';
import GlobalStyle from './globalStyles';

import zhTranslationMessages from './lang/zh';
import enTranslationMessages from './lang/en';

Sentry.init({ dsn: 'https://2a65cc47c686438ebde60b1237a8a8ec@sentry.io/5168571', environment: process.env.NODE_ENV });

require('./assets/iconfont/iconfont.js');

// import { hashHistory } from 'react-router';
addLocaleData([...enLocaleData, ...zhLocaleData]);

const messages = {
  en: enTranslationMessages,
  zh: zhTranslationMessages,
};

const Wrapper = styled.div`
  width: 100%;
`;

const Container = styled.div`
  position: relative;
  padding: 20px 0 0;
  padding-left: 0;
  margin: 0;
  margin-left: 120px;
  max-height: calc(100vh - 72px);
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  ${media.pad`
    margin-left: 0;
    max-height: calc(100vh - 56px);
    padding: 20px 0 70px 0;
  `}
`;

const ContainerMask = styled.div`
  display: none;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 20;

  ${media.pad`
    &.show {
      display: block;
    }
  `}
`;

const Content = styled.div`
  position: relative;
  min-height: calc(100vh - 245px);
  margin-left: 20px;
  margin-right: 20px;

  ${media.pad`
    max-width: 100%;
    min-height: calc(100vh - 330px);
  `}
  ${media.mobile`
    margin-left: 0;
    margin-right: 0;
  `}
`;

let containerDom;
document.addEventListener('scroll-to-top', (event) => {
  if (containerDom) {
    containerDom.scrollTop = event.scrollTop || 0;
  }
});

let setShowNavbarGlobal;
document.addEventListener('hide-nav-bar', () => {
  if (setShowNavbarGlobal) {
    setShowNavbarGlobal(false);
  }
});

function App({ dispatch, lang }) {
  const [showNavbar, setShowNavbar] = useState(false);
  const [showMaintaining, setShowMaintaining] = useState(true);
  setShowNavbarGlobal = setShowNavbar;

  if (showMaintaining)
    return (
      <div style={{ fontSize: '18px', padding: '32px', margin: '0 auto' }}>
        <span>
          <b>ConfluxScan 维护升级中</b> <br />
          <br />
          1. ConfluxScan 将于10月28日22:00(GMT+8)下线。 <br />
          2. Conflux 主网第三阶段 Conflux Tethys 将于10月29日上线，请DApp开发者提前备份好相关数据。 <br />
          3.
          10月28日18:00(GMT+8)至10月29日18:00(GMT+8)，升级期间所有链上资产处于冻结状态，升级完成后用户不需要做任何操作，所有资产将自动恢复。
          <br />
          4. Conflux Tethys 上线期间，FC转账功能会有影响，在此期间请不要进行FC的转账操作。
          <br />
          <br /> 1. ConfluxScan will go offline starting: 2020.10.28 22:00 (GMT+8) <br />
          2. Conflux Mainnet Phase III - Conflux Tethys will go live on Oct. 29. DApp Developers please back-up related data in advance.{' '}
          <br />
          3. From Oct. 28 18:00 (GMT+8) to Oct. 29 18:00 (GMT+8), the system will be undergoing upgrades and all assets on chain will be
          frozen temporarily. The assets will be back to normal after the upgrade. Users do not need to take any action. <br />
          4. During the launch of Conflux Tethys, the transfer function of FC will be affected, so please do not transfer any FC during the
          launch.
        </span>
      </div>
    );

  return (
    <IntlProvider locale={lang} messages={messages[lang]}>
      <BrowserRouter>
        <Wrapper>
          <Header
            changeLanguage={(l) => {
              document.title = l === 'en' ? 'Conflux Blockchain Explorer' : 'Conflux 区块链浏览器';
              dispatch({
                type: UPDATE_COMMON,
                payload: {
                  lang: l,
                },
              });
            }}
            toggleNavbar={() => setShowNavbar(!showNavbar)}
          />
          <Navbar showNavbar={showNavbar} />
          <ContainerMask className={showNavbar ? 'show' : ''} onClick={() => setShowNavbar(!showNavbar)} />
          <Container
            ref={(c) => {
              containerDom = c;
            }}
          >
            <Content>
              <Router />
            </Content>
            <Footer />
            <ToastComp />
            <NoticeComp />
          </Container>
          <GlobalStyle />
        </Wrapper>
      </BrowserRouter>
    </IntlProvider>
  );
}

function mapStateToProps(state) {
  return {
    lang: state.common.lang,
  };
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(App);
