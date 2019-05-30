import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { addLocaleData, IntlProvider } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import zhLocaleData from 'react-intl/locale-data/zh';
import styled from 'styled-components';

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

require('./assets/iconfont/iconfont.js');

// import { hashHistory } from 'react-router';
const zhTranslationMessages = require('./lang/zh.json');
const enTranslationMessages = require('./lang/en.json');

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
  padding: 20px;
  margin-left: 120px;
  max-height: calc(100vh - 72px);
  overflow-x: hidden;
  overflow-y: auto;
`;

const Content = styled.div`
  position: relative;
  max-width: calc(100vw - 160px);
  min-height: 200px;
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: 'en',
    };
    this.changeLanguage = this.changeLanguage.bind(this);
  }

  changeLanguage(lang) {
    this.setState({
      lang: lang,
    });
  }

  render() {
    const { lang } = this.state;
    return (
      <IntlProvider locale={lang} messages={messages[lang]}>
        <BrowserRouter>
          <Wrapper>
            <Header changeLanguage={this.changeLanguage} />
            <Navbar />
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
} /**/

export default App;
