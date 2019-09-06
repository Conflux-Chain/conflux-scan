/**
 * Global Base Styles
 */

import { css } from 'styled-components';
import media from './media';
import ProximaNovaRegular from '../assets/fonts/ProximaNova-Regular.otf';
import ProximaNovaBold from '../assets/fonts/ProximaNova-Bold.otf';
import ProximaNovaLight from '../assets/fonts/ProximaNova-Light.otf';
import ProximaNovaRegularItalic from '../assets/fonts/ProximaNova-RegularItalic.otf';

const BaseStyle = css`
  html {
    box-sizing: border-box;
    overflow-y: auto;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    font-size: 16px;
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
    src: url(${ProximaNovaRegular});
  }

  @font-face {
    font-family: 'Proxima Nova';
    font-display: auto;
    src: url(${ProximaNovaBold});
    font-weight: 700;
  }

  @font-face {
    font-family: 'Proxima Nova';
    font-display: auto;
    src: url(${ProximaNovaLight});
    font-weight: 300;
  }

  @font-face {
    font-family: 'Proxima Nova';
    font-display: auto;
    src: url(${ProximaNovaRegularItalic});
    font-style: italic;
  }

  body {
    font-family: 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 1.6;
    font-weight: 400;
    word-wrap: break-word;
    font-kerning: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f9f9f9;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
  }

  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial, sans-serif;
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

  .message {
    padding: 12px;
    font-size: 16px;
    line-height: 16px;
    border-radius: 4px;
    color: #fff;
    position: relative;
    z-index: 9999;
  }
  .message-important-light {
    background: #ffebd4;
    color: #e76a25;
  }
`;
export default BaseStyle;
