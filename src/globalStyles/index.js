/**
 * All Global Styles
 */

import { createGlobalStyle } from 'styled-components';
import HelperStyle from './helper';
import BaseStyle from './base';

const GlobalStyle = createGlobalStyle`
  ${HelperStyle}
  ${BaseStyle}
`;

export default GlobalStyle;
