import React, { Component } from 'react';
import Router from './route/router';
import Header from './components/header';
import Footer from './components/footer';
import { GlobalStyle } from './style';
import { addLocaleData, IntlProvider, injectIntl } from 'react-intl'; /* react-intl imports */
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import { BrowserRouter as Routers } from 'react-router-dom';
// import { hashHistory } from 'react-router';
const zh_CN = require('./lang/zh.json');
const en_US = require('./lang/en.json');
addLocaleData([...en, ...zh]);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: 'zh'
    };
    this.changeLanguage = this.changeLanguage.bind(this);
  }

  changeLanguage(lang) {
    this.setState({
      lang: lang
    });
    console.log(this.state.lang);
  }
  render() {
    let messages = {};
    messages['en'] = en_US;
    messages['zh'] = zh_CN;
    return (
      <IntlProvider locale={'en'} messages={messages[this.state.lang]}>
        <Routers>
          <div>
            <Header changeLanguage={this.changeLanguage} intl={this.props.intl} />
            <Router />
            <Footer />
            <GlobalStyle />
          </div>
        </Routers>
      </IntlProvider>
    );
  }
}

export default App;
