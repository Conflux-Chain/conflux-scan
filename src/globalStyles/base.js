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
`;
export default GlobalStyle;
