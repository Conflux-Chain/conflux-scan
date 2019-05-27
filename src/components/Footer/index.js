import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.footer`
  margin-top: 30px;
  width: 100%;
  padding: 30px 0;
  text-align: center;
  border-top: 1px solid #ccc;
`;

const ImgIcon = styled.img`
  width: 24px;
  height: 24px;
  margin: 10px;
`;

function Footer() {
  return (
    <Wrapper>
      <div className="link">
        <img className="code" alt="" />
        <div className="Copyright">Copyright©2019 Conflux. All Rights Reserved</div>
      </div>
    </Wrapper>
  );
}

export default Footer;
