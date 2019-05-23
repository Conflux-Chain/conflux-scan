import React, { Component } from 'react';
import styled from 'styled-components';

const Input = styled.input`
  width: 600px;
  height: 30px;
  padding: 10px;
  border: 1px solid #ccc;
  outline: 0;
`;

function SearchBox() {
  return (
    <div>
      <Input type="text" placeholder="Search by Address / Block Hash / Txn Hash / Epoch Number" />
    </div>
  );
}

export default SearchBox;
