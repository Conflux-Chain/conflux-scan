import * as Sentry from '@sentry/browser';
import React, { Component, useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { addLocaleData, IntlProvider } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import zhLocaleData from 'react-intl/locale-data/zh';
import styled from 'styled-components';
import media from './globalStyles/media';

// components
import Router from './route/router';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ToastComp } from './components/Toast';

// styles
import './assets/semantic-ui/semantic.css';
import GlobalStyle from './globalStyles';

import zhTranslationMessages from './lang/zh';
import enTranslationMessages from './lang/en';

Sentry.init({ dsn: 'https://f9be7624ef1045f98f022fdca9ad1cc5@sentry.conflux-chain.org/2' });

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
  padding-left: 120px;
  margin: 0;
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

function App() {
  const [lang, setLang] = useState('en');
  const [showNavbar, setShowNavbar] = useState(false);
  setShowNavbarGlobal = setShowNavbar;

  return (
    <IntlProvider locale={lang} messages={messages[lang]}>
      <BrowserRouter>
        <Wrapper>
          <Header
            changeLanguage={(l) => {
              document.title = l === 'en' ? 'Conflux Blockchain Explorer' : 'Conflux 区块链浏览器';
              setLang(l);
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
          </Container>
          <GlobalStyle />
        </Wrapper>
      </BrowserRouter>
    </IntlProvider>
  );
}

export default App;
