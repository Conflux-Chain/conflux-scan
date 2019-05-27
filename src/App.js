import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { addLocaleData, IntlProvider } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import zhLocaleData from 'react-intl/locale-data/zh';
import styled from 'styled-components';

import Router from './route/router';
import Header from './components/Header';
// import Footer from './components/Footer';

// styles
import './assets/semantic-ui/semantic.css';
import GlobalStyle from './globalStyles';

require('./assets/iconfont/iconfont.js');

// import { hashHistory } from 'react-router';
const zhTranslationMessages = require('./lang/zh.json');
const enTranslationMessages = require('./lang/en.json');

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
  padding: 10px 0;
  min-height: 100px;
  background-color: #f9f9f9;
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
            <Header changeLanguage={this.changeLanguage} locale={lang} />
            <Container>
              <Router />
            </Container>
            {/* <Footer /> */}
            <GlobalStyle />
          </Wrapper>
        </BrowserRouter>
      </IntlProvider>
    );
  }
} /**/

export default App;
