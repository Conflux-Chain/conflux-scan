import React, { Component, useState } from 'react';
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

import JnoodleEn from './lang/jnoodle.en';
import JnoodleZh from './lang/jnoodle.zh';

import zhTranslationMessages from './lang/zh';
import enTranslationMessages from './lang/en';

require('./assets/iconfont/iconfont.js');

// import { hashHistory } from 'react-router';
addLocaleData([...enLocaleData, ...zhLocaleData]);

const messages = {
  en: Object.assign({}, enTranslationMessages, JnoodleEn),
  zh: Object.assign({}, zhTranslationMessages, JnoodleZh),
};

const Wrapper = styled.div`
  width: 100%;
`;

const Container = styled.div`
  position: relative;
  padding: 20px 20px 0;
  margin-left: 120px;
  max-height: calc(100vh - 72px);
  overflow-x: hidden;
  overflow-y: auto;

  ${media.pad`
    margin-left: 0;
    max-height: calc(100vh - 56px);
    padding: 20px 0 0;
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
  max-width: calc(100vw - 160px);
  min-height: calc(100vh - 245px);

  ${media.pad`
    max-width: 100%;
    min-height: calc(100vh - 330px);
  `}
`;

function App() {
  const [lang, setLang] = useState('en');
  const [showNavbar, setShowNavbar] = useState(false);

  return (
    <IntlProvider locale={lang} messages={messages[lang]}>
      <BrowserRouter>
        <Wrapper>
          <Header changeLanguage={(l) => setLang(l)} toggleNavbar={() => setShowNavbar(!showNavbar)} />
          <Navbar showNavbar={showNavbar} />
          <ContainerMask className={showNavbar ? 'show' : ''} />
          <Container>
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
