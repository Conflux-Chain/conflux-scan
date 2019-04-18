import React, { Component } from 'react';
import { Button, Select } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { menus } from '../../utils/constants/home';

const Option = Select.Option;

class Head extends Component {
  LanguageSwitching(value) {
    if (value.key == 1) {
      this.props.changeLanguage('zh');
    } else {
      this.props.changeLanguage('en');
    }
  }
  render() {
    return (
      <div className="head">
        <div className="logo" />
        <nav className="nav">
          {menus.map((item, index) => {
            return (
              <Link key={index} to={item.path}>
                <span className="nav-a">
                  <FormattedMessage id={item.id} />
                </span>
              </Link>
            );
          })}
        </nav>
        <div>
          <Select
            className="langstyle"
            onChange={(data) => this.LanguageSwitching(data)}
            style={{ width: '100px', border: 'none', marginTop: '20px' }}
            labelInValue
            defaultValue={{ key: '1' }}>
            <Option value="1">中文</Option>
            <Option value="2">英文</Option>
          </Select>
        </div>
      </div>
    );
  }
}
export default injectIntl(Head);
