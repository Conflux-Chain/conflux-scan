import React, { Component } from 'react';
import superagent from 'superagent';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import compose from 'lodash/fp/compose';
import media from '../../globalStyles/media';

const Input = styled.input`
  height: 100%;
  border: none;
  outline: 0;
  flex: 1;
  width: auto;
  padding-left: 0;
  margin-left: 10px;
  margin-left: 16px;
  ${media.pad`
    font-size: 14px;
  `}
`;

const Wrapper = styled.div`
  height: 40px;
  margin: 0 auto;
  margin-right: 24px;
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-left: none;
  border-top-left-radius: 40px;
  border-bottom-left-radius: 40px;
  border-top-right-radius: 40px;
  /* overflow: hidden; */
  border-bottom-right-radius: 40px;
  ${media.mobile`
  border: 1px solid #ccc;
  margin-right: 7px;
  `}
`;

const FilterSelector = styled.div.attrs({
  className: 'ui menu compact',
})`
  margin-top: 10px !important;
  width: 128px;
  height: 50px;
  border: none !important;
  box-shadow: none !important;
  padding-bottom: 10px !important;
  background: transparent !important;
  ${media.mobile`
    display: none!important;
  `}

  .ui.dropdown {
    width: 100%;
    justify-content: space-around;
    border: 1px solid #ccc;
    border-top-left-radius: 40px !important;
    border-bottom-left-radius: 40px !important;

    .menu > .item {
      outline: none;
    }
  }

  .menu.visible {
    display: none !important;
    top: calc(100% + 8px);
  }

  &:hover {
    .menu.visible {
      display: block !important;
    }
  }
`;

const SearchButton = styled.div`
  height: 100%;
  width: 60px;
  border: none !important;
  box-shadow: none !important;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  svg {
    width: 14px;
    height: 14px;
  }
`;

const baseId = 'app.comp.searchbox.filter.';
const filterKeys = ['all', 'epoch', 'block', 'transaction', 'address'].map((s) => baseId + s);

class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = { searchKey: '', filterName: 'app.comp.searchbox.filter.all' };
  }

  async handleSearch(value) {
    const { history } = this.props;
    if (value) {
      const { code, result, message } = (await superagent.get(`/proxy/fetchHashType/${value}`)).body;
      if (code !== 0) {
        history.push(`/search-notfound?searchId=${value}&errMsg=${message}`);
        return;
      }
      if (result) {
        switch (result) {
          case 0:
            history.push(`/blocksdetail/${value}`);
            break;
          case 1:
            history.push(`/transactionsdetail/${value}`);
            break;
          case 2:
            history.push(`/accountdetail/${value}`);
            break;
          default:
            console.log('unknow case');
            break;
        }
      }
    }
  }

  render() {
    const { searchKey, filterName } = this.state;
    const { intl } = this.props;

    return (
      <Wrapper>
        <FilterSelector>
          <div className="ui dropdown link item">
            <FormattedMessage id={filterName}>{(s) => <span className="text">{s}</span>}</FormattedMessage>
            <i className="dropdown icon" />
            <div className="menu transition visible">
              {filterKeys.map((name, index) => (
                <div
                  key={name}
                  className="item"
                  role="button"
                  tabIndex={index}
                  onClick={() => this.setState({ filterName: name })}
                  onKeyPress={() => this.setState({ filterName: name })}
                >
                  <FormattedMessage id={name} />
                </div>
              ))}
            </div>
          </div>
        </FilterSelector>
        <Input
          onKeyPress={(e) => {
            this.setState({ searchKey: e.target.value });
            if (e.which === 13) {
              this.handleSearch(e.target.value);
            }
          }}
          type="text"
          placeholder={intl.formatMessage({ id: 'app.comp.searchbox.placeholder' })}
        />
        <SearchButton onClick={(e) => this.handleSearch(searchKey)}>
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#iconsousuo" />
          </svg>
        </SearchButton>
      </Wrapper>
    );
  }
}
SearchBox.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

const hoc = compose(
  injectIntl,
  withRouter
);

export default hoc(SearchBox);
