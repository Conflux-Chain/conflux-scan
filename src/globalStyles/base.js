/**
 * Global Base Styles
 */

import { css } from 'styled-components';
import media from './media';

const BaseStyle = css`
  html,
  body,
  #root {
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

  body {
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  // only test
  ${media.xl`
    body {
      background: #000;
    }
  `}
`;
export default BaseStyle;
