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
  ${commonCss.paginatorMixin}
`;

export const IconFace = styled.div`
  margin-left: 16px;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 16px;
    height: 16px;
  }
  &:hover {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.54);
    svg {
      color: #fff;
    }
  }

  &.iconmore1 {
    svg {
      color: #000;
    }
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.12);
  }
  &.iconmore1:hover {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.05);
  }
`;

export const CtrlPanel = styled.div`
  position: absolute;
  right: 0;
  top: 0px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  ${media.pad`
    position: relative;
    width: auto;
    padding-top: 20px;
    padding-left: 16px;
    background: #fff;
    z-index: 10;
    align-items: flex-end;
    justify-content: flex-end;
    padding-right: 10px;
  `}
  .screentime {
    ${media.pad`display: block; margin-bottom: 8px; margin-right: 0;`}
    font-size: 16px;
    margin-right: 5px;
  }
  .date-picker {
    ${media.pad`width: 250px!important; display: inline-block;`}
  }
  .drop-btn {
    svg {
      transform: rotate(90deg);
    }
  }
`;
