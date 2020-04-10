/* eslint import/prefer-default-export: 0 */
import { css } from 'styled-components';
import media from './media';

export const lightBorder = `
border: 0;
background: rgba(255, 255, 255, 1);
box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px 1px;
`;

export const show = `display: block!important;`;
export const hide = `display: none!important;`;

export const paginatorMixin = css`
  .page-h5 {
    ${hide}
  }
  .page-pc {
    display: block;
    width: 100%;
    .total {
      float: left;
    }
    .pagination {
      float: right;
    }
  }
  .total {
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.6);
    line-height: 20px;
  }
  ${media.pad` 
  justify-content: center;
  .page-pc { ${hide} }
  .page-h5 { 
    display: block!important;
    .ui.pagination.menu {
      white-space: nowrap;
    }
  }
`}
`;
