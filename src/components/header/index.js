import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { menus } from '../../utils/constants/home';

const Option = Select.Option;

class Header extends Component {
  constructor(props) {
    super(props);
    this.changeLanguage = this.changeLanguage.bind(this);
  }

  changeLanguage(value) {
    const { changeLanguage } = this.props;
    if (value.key === 1) {
      changeLanguage('zh');
    } else {
      changeLanguage('en');
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
            onChange={(data) => {
              this.changeLanguage(data);
            }}
            style={{ width: '100px', border: 'none', marginTop: '20px' }}
            labelInValue
            defaultValue={{ key: '1' }}
          >
            <Option value="1">中文</Option>
            <Option value="2">英文</Option>
          </Select>
        </div>
      </div>
    );
  }
}
Header.propTypes = {
  changeLanguage: PropTypes.func.isRequired
};
export default injectIntl(Header);
