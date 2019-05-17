/**
 * Media Query Helper
 */

import { css } from 'styled-components';
import variable from './variable';

// breakpoints
const sizes = { ...variable.breakpoint };

// example:
// ${media.xl`background: xxx;`}
const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${sizes[label]}px) {
      ${css(...args)}
    }
  `;

  return acc;
}, {});

export default media;
