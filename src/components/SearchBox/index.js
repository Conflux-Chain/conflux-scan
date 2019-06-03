import React, { Component } from 'react';
import styled from 'styled-components';

const Input = styled.input`
  width: calc(100% - 120px);
  height: 100%;
  border: none;
  outline: 0;
  padding-left: 16px;
`;

const Wrapper = styled.div`
  width: 1050px;
  height: 40px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-left: none;
  border-top-left-radius: 40px;
  border-bottom-left-radius: 40px;
  border-top-right-radius: 40px;
  /* overflow: hidden; */
  border-bottom-right-radius: 40px;
`;

const FilterSelector = styled.div.attrs({
  className: 'ui menu compact',
})`
  margin-top: 10px !important;
  width: 120px;
  height: 50px;
  border: none !important;
  box-shadow: none !important;
  padding-bottom: 10px !important;

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

class SearchBox extends Component {
  constructor() {
    super();
    this.state = { searchKey: '' };
  }

  handleSearch(value) {
    if (value) {
      console.log(value);
    }
  }

  render() {
    const { searchKey } = this.state;
    return (
      <Wrapper>
        <FilterSelector>
          <div className="ui dropdown link item">
            <span className="text">All Filters</span>
            <i className="dropdown icon" />
            <div className="menu transition visible">
              <div className="item" role="menuitem">
                abc
              </div>
              <div className="item" role="menuitem">
                bcd
              </div>
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
          placeholder="Search by Address / Block Hash / Txn Hash / Epoch Number"
        />
        <SearchButton onClick={(e) => this.handleSearch(searchKey)} />
      </Wrapper>
    );
  }
}

export default SearchBox;
