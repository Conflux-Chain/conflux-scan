import styled from 'styled-components';
import media from '../../globalStyles/media';
import * as commonCss from '../../globalStyles/common';

export const StyledTabel = styled.div`
  .content {
    padding: 0 !important;
  }
  tr th {
    padding: 16px 20px !important;
    padding-right: 0 !important;
  }
  thead tr th {
    background: rgba(0, 0, 0, 0.05) !important;
  }
  tr th:last-of-type {
    padding: 16px 0 16px 20px !important;
  }

  &.right {
    margin-left: 16px;
  }
  .ui.fluid.card {
    box-shadow: none;
    border: 1px solid rgba(0, 0, 0, 0.08);
  }
  .txnhash-err {
    display: flex;
    > img {
      align-self: flex-start;
    }
    .txnhash-err-line1 {
      flex: 1;
      margin-left: 4px;
    }
    .txnhash-err-line2 {
      margin-top: 5px;
      font-size: 14px;
      line-height: 14px;
      color: #8f8f8f;
    }
  }
`;

export const TabPanel = styled.div`
  &.ui.bottom.attached.segment.tab {
    border: 0;
    margin-left: 0px;
    margin-right: 0px;
    box-shadow: none;
    ${media.pad`
      width: auto;
    `}
  }
`;

export const PCell = styled.div`
  margin: 0 !important;
`;

export const TabWrapper = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  .page-pc {
    display: inline-flex !important;
  }
  .page-h5 {
    ${commonCss.hide}
  }
  ${media.pad`
  justify-content: center;
  .page-pc { ${commonCss.hide} }
  .page-h5 { display: inline-flex!important; }
`}
`;
