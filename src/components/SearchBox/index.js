import React, { Component } from 'react';
import superagent from 'superagent';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react';

import compose from 'lodash/fp/compose';
import trim from 'lodash/trim';
import media from '../../globalStyles/media';
import { reqUtilType } from '../../utils/api';
import { tranferToLowerCase } from '../../utils';

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
    font-size: 10px;
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
  ${media.mobile`
    width: 46px;
  `}
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
    this.state = { searchKey: '', filterName: 'app.comp.searchbox.filter.all', filterValue: 0 };
    const { history } = this.props;
    history.listen((location, action) => {
      if (action === 'PUSH') {
        const eventScroll = new Event('scroll-to-top');
        setTimeout(() => {
          document.dispatchEvent(eventScroll);
        }, 0);
      }
    });
  }

  async handleSearch(value) {
    const { filterValue } = this.state;
    const { history } = this.props;
    if (value) {
      this.setState({
        showLoading: true,
      });
      const hideLoading = () => {
        this.setState({
          showLoading: false,
        });
      };

      if (/^[0-9a-zA-Z]+$/.test(value) === false) {
        history.push(`/search-notfound?searchId=${value}`);
        hideLoading();
        return;
      }

      if (filterValue === 0) {
        try {
          const { code, result } = await reqUtilType({ value: tranferToLowerCase(value) }, { showError: false });
          if (code !== 0) {
            history.push(`/search-notfound?searchId=${value}`);
            hideLoading();
            return;
          }
          switch (result.typeCode) {
            case 0:
              history.push(`/blocksdetail/${value}`);
              break;
            case 1:
              history.push(`/transactionsdetail/${value}`);
              break;
            case 2:
              history.push(`/address/${value}`);
              break;
            case 3:
              history.push(`/epochsdetail/${value}`);
              break;
            default:
              console.log('unknow case');
              break;
          }
        } catch (e) {
          console.log(e);
        } finally {
          this.setState({
            showLoading: false,
          });
        }
      } else {
        this.setState({
          showLoading: false,
        });
        if (filterValue === 1) {
          history.push(`/epochsdetail/${value}`);
        } else if (filterValue === 2) {
          history.push(`/blocksdetail/${value}`);
        } else if (filterValue === 3) {
          history.push(`/transactionsdetail/${value}`);
        } else if (filterValue === 4) {
          history.push(`/address/${value}`);
        }
      }
    }
  }

  render() {
    const { searchKey, filterName, showLoading } = this.state;
    const { intl } = this.props;

    return (
      <Wrapper>
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: showLoading ? 'block' : 'none',
          }}
        >
          <Loader size="medium" active={showLoading} />
        </div>
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
                  onClick={() => this.setState({ filterName: name, filterValue: index })}
                  onKeyPress={() => this.setState({ filterName: name, filterValue: index })}
                >
                  <FormattedMessage id={name} />
                </div>
              ))}
            </div>
          </div>
        </FilterSelector>
        <Input
          onKeyUp={(e) => {
            if (e.which === 13) {
              this.handleSearch(e.target.value);
            }
          }}
          onChange={(e) => {
            const val = trim(e.target.value) || '';
            this.setState({ searchKey: val });
          }}
          type="text"
          value={searchKey}
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
    listen: PropTypes.func,
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
