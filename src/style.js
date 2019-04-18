import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  div {
    font-size: 14px;
    font-family: Arial, Helvetica, sans-serif;
  }
  @media screen and (max-width: 960px){
    body {
      background-color:#FF6699
    }
  }

  @media screen and (max-width: 768px){
    body {
      background-color:#00FF66;
    }
  }

  @media screen and (max-width: 550px){
    body {
      background-color:#6633FF;
    }
  }

  @media screen and (max-width: 320px){
    body {
      background-color:#FFFF00;
    }
  }
`;
export default GlobalStyle;
