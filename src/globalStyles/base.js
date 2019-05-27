/**
 * Global Base Styles
 */

import { css } from 'styled-components';
import media from './media';

const BaseStyle = css`
  html {
    box-sizing: border-box;
    overflow-y: auto;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
  }

  * {
    box-sizing: inherit;
  }

  *:before {
    box-sizing: inherit;
  }

  *:after {
    box-sizing: inherit;
  }

  @font-face {
    font-family: 'Proxima Nova';
    font-display: auto;
    src: url('../assets/fonts/ProximaNova-Regular.otf');
  }

  @font-face {
    font-family: 'Proxima Nova';
    font-display: auto;
    src: url('../assets/fonts/ProximaNova-Bold.otf');
    font-weight: 700;
  }

  @font-face {
    font-family: 'Proxima Nova';
    font-display: auto;
    src: url('../assets/fonts/ProximaNova-Light.otf');
    font-weight: 300;
  }

  @font-face {
    font-family: 'Proxima Nova';
    font-display: auto;
    src: url('../assets/fonts/ProximaNova-RegularItalic.otf');
    font-style: italic;
  }

  body {
    font-family: 'Proxima Nova', 'HelveticaNeue', Helvetica, Arial, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    font-weight: 400;
    word-wrap: break-word;
    font-kerning: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }

  .browserupgrade {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #fbe7ed;
    padding: 5px 10px;
    z-index: 99999;
  }
`;
export default BaseStyle;
