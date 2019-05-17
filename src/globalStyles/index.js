/**
 * All Global Styles
 */

import { createGlobalStyle } from 'styled-components';
import NormalizeStyle from './normalize';
import HelperStyle from './helper';
import GridStyle from './grid';
import BaseStyle from './base';

const GlobalStyle = createGlobalStyle`
  ${NormalizeStyle}
  ${HelperStyle}
  ${GridStyle}
  ${BaseStyle}
`;
export default GlobalStyle;
