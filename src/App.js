import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { addLocaleData, IntlProvider } from 'react-intl'; /* react-intl imports */
import enLocaleData from 'react-intl/locale-data/en';
import zhLocaleData from 'react-intl/locale-data/zh';
import Router from './route/router';
import Header from './components/Header';
import Footer from './components/Footer';
import GlobalStyle from './globalStyles';

// import { hashHistory } from 'react-router';
const zhTranslationMessages = require('./lang/zh.json');
const enTranslationMessages = require('./lang/en.json');

addLocaleData([...enLocaleData, ...zhLocaleData]);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: 'zh',
    };
    this.changeLanguage = this.changeLanguage.bind(this);
  }

  changeLanguage(lang) {
    this.setState({
      lang: lang,
    });
  }

  render() {
    let messages = {};
    messages['en'] = enTranslationMessages;
    messages['zh'] = zhTranslationMessages;
    const { lang } = this.state;
    return (
      <IntlProvider locale="en" messages={messages[lang]}>
        <BrowserRouter>
          <div>
            <Header changeLanguage={this.changeLanguage} />
            <Router />
            <Footer />
            <GlobalStyle />
          </div>
        </BrowserRouter>
      </IntlProvider>
    );
  }
}

export default App;
