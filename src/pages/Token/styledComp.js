import styled from 'styled-components';
import media from '../../globalStyles/media';
import iconCloseSmall from '../../assets/images/icons/close-small.svg';
import iconCloseMd from '../../assets/images/icons/close-md.svg';
import iconOpen from '../../assets/images/icons/icon-open.svg';
import iconOpenHover from '../../assets/images/icons/icon-open-hover.svg';

export const HeadBar = styled.div`
  width: 100%;
  font-size: 16px;
  margin-top: 16px;
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;

    .open-icon {
      cursor: pointer;
      margin-left: 10px;
      width: 32px;
      height: 32px;
      display: block;
      background-image: url("${iconOpen}");
      &:hover {
        background-image: url("${iconOpenHover}");
      }
    }

  .link-open {
    margin-left: 5px;
    font-size: 16px;
    line-height: 16px;
    vertical-align: middle;
  }
  a {
  }
  * {
    display: inline-block;
    margin: 0;
    vertical-align: middle;
  }
  h1 {
    color: #000;
    font-size: 24px;
    margin-right: 12px;
  }
  .token-logo {
    margin-right: 8px;
    max-height: 24px;
    max-width: 24px;
  }
  .contract-logo {
    margin-left: 8px;
    width: 24px;
  }
`;

export const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  ${media.mobile`
    width: 95%;
    margin: 0 auto;
  `}
`;

export const PCell = styled.div`
  margin: 0 !important;
`;

export const TabWrapper = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  .page-pc {
    display: inline-flex;
  }
  .page-h5 {
    display: none;
  }
  ${media.pad`
    justify-content: center;
    .page-pc {
      display: none;
     }
    .page-h5 { display: inline-flex; }
  `}
`;

export const SummaryDiv = styled.div`
  display: flex;
  ${media.pad`
    display: block;
  `}

  & > .card-wrapper {
    flex: 1;
    margin-right: 16px;
    margin-top: 0;
    &:last-child {
      margin-right: 0;
    }
    > .ui.card {
      width: 100%;
    }

    .summary-content {
      height: 140px;
    }
    ${media.pad`
      margin-bottom: 16px;
      margin-right: 0px;
      .summary-content {
        height: auto;
      }
    `}
  }

  .summary-line {
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;
    > h6 {
      ${media.pad`
      min-width: 80px;
      max-width: 120px;
    `}
      min-width: 110px;
      margin: 0;
      font-size: 16px;
      color: #8f8f8f;
      font-weight: normal;
      > span {
        vertical-align: middle;
      }
      & + div {
        word-break: break-word;
      }
    }
  }
  .summary-line-content {
    display: flex;
    margin-left: 10px;
  }
  .link-open {
    margin-left: 3px;
    font-size: 14px;
  }
  .iconwrap {
    flex: 1;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f2f2f2;
    border-radius: 4px;
    margin-right: 10px;
    > .icon {
      margin: 0;
      padding: 0;
      color: #8f8f8f;
      font-size: 15px;
      height: 21px;
      line-height: 24px;
    }
  }
  .icon-link {
    color: rgb(143, 143, 143);
    line-height: 20px;
    text-align: center;
    width: 20px;
    height: 20px;
  }
`;

export const TransfersDiv = styled.div`
  position: relative;
  display: flex;
  margin-top: 16px;
    > .ui.card {
      width: 100%;
    }
    .transfer-search {
      display: flex;
      align-items: center;
      ${media.pad`
        flex-wrap: wrap;
      `}
      h6 {
        flex: 1;
        margin: 0;
        font-size: 20px;
      }
    }
    .transfer-search-input {
      display: flex;
      align-items: center;
      border: 1px solid #fff;
      ${media.pad`
        flex: 1;
        display: flex;
        margin-top: 0px;
      `}

    &:hover {
      border: 1px solid rgb(204, 204, 204);
    }
    input {
      transition: 0.2s all ease-out;
      min-width: 200px;
      outline: none;
      font-size: 16px;
      height: 28px;
      line-height: 28px;
      border: none;
      text-indent: 5px;
      ${media.pad`
        flex: 1;
      `}
    }
    .search-icon {
      padding-left: 8px;
      padding-right: 8px;
      font-size: 16px;
      color: #8F8F8F;
      height: 26px;
      cursor: pointer;
    }
  }

  ${media.pad`
    .transfer-search-tag + .transfer-search-input {
      margin-top: 10px;
    }
  `}
  .transfer-search-tag {
    background: #F2F2F2;
    padding-left: 10px;
    padding-right: 5px;
    align-items: center;
    height: 28px;
    margin-right: 16px;
    display: flex;
    ${media.pad`
      margin-right: 0px;
    `}

    .icon-close {
      background-image: url("${iconCloseSmall}");
      background-repeat: no-repeat;
      width: 10px;
      height: 10px;
      margin-top: -2px;
      padding-right: 5px;
      box-sizing: content-box;
      cursor: pointer;
    }
    .transfer-search-tag-inner {
      margin-right: 5px;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 97px;
      font-size: 12px;
      height: 28px;
      line-height: 28px;
      color: #5C5C5C;
      overflow: hidden;
    }
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
      color: #8F8F8F;
    }
  }
`;

export const TagWrapper = styled.div`
  display: flex;
  align-items: center;

  .tag-out {
    color: #e66a24;
    background: #ffebd4;
  }
  .tag-in {
    color: #4a9e81;
    background: #d0f5e7;
  }
  .tag {
    width: 40px;
    border-radius: 4px;
    font-size: 12px;
    line-height: 22px;
    text-align: center;
    margin-right: 12px;
    margin-left: -50px;
    &.tag-arrow {
      background: #f2f2f2;
      width: auto;
      box-sizing: border-box;
      padding-left: 5px;
      padding-right: 5px;
      > i {
        font-size: 12px;
        color: #59bf9c;
      }
    }
  }
`;

export const FilteredDiv = styled.div`
  margin-top: 16px;
  .ui.card {
    width: 100%;
    display: flex;
  }
  .filter-item-wrap {
    display: flex;
    position: relative;
    ${media.pad`
      display: block;
    `}
  }
  .filter-item {
    flex: 1;
    padding: 20px;
  }
  h5 {
    display: flex;
    align-items: center;
    span {
      font-size: 16px;
      color: #292929;
      line-height: 23px;
    }
    margin-bottom: 12px;
  }
  .icon-filter {
    margin-right: 8px;
    height: 23px;
    vertical-align: middle;
  }
  .filter-item-3 {
    margin-top: 10px;
    font-size: 12px;
    line-height: 12px;
    color: #8f8f8f;
    margin-bottom: 8px;
  }
  .filter-item-4 {
    font-size: 16px;
    line-height: 16px;
    color: #292929;
    user-select: none;
  }
  .filter-item-2 {
    display: inline-block;
    word-break: break-word;
  }
  .close-btn {
    width: 32px;
    height: 32px;
    position: absolute;
    background-color: #F2F2F2;
    background-image: url("${iconCloseMd}");
    background-position: center;
    background-repeat: no-repeat;
    top: 28px;
    right: 20px;
    border-radius: 50%;
    cursor: pointer;
    ${media.pad`
      top: 12px;
    `}
  }
`;
