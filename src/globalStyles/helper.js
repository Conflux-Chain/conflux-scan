/**
 * Helper Classes
 */

import { css } from 'styled-components';

const HelperStyle = css`
  .clearfix::after {
    display: block;
    clear: both;
    content: '';
  }

  .visible {
    visibility: visible;
  }

  .invisible {
    visibility: hidden;
  }

  .hidden {
    display: none !important;
  }

  .rounded-circle {
    border-radius: 50% !important;
  }
`;
export default HelperStyle;
