import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';

const Wrapper = styled.div`
  width: 100%;

  .ui.card {
    min-height: 224px;
    border: none;
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
    border-radius: 4px;

    &:hover {
      box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.4) !important;
      border-radius: 4px;

      .icon-circle {
        animation: animate 0.6s ease;
        animation-iteration-count: 1;
      }
    }

    @keyframes animate {
      20% {
        transform: rotateZ(4deg);
      }
      40% {
        transform: rotateZ(-4deg);
      }
      60% {
        transform: rotateZ(2deg);
      }
      80% {
        transform: rotateZ(-2deg);
      }
      100% {
        transform: rotateZ(0);
      }
    }

    .icon-circle {
      display: flex;
      width: 72px;
      height: 72px;
      margin: 24px auto 16px;
      justify-content: center;
      align-items: center;
      border: 4px solid #dde2fb;
      border-radius: 72px;
      transition: 1.5s ease-out;
    }

    .header {
      font-size: 24px;
      font-weight: 700;
      color: #000;
      margin-top: 10px !important;
    }

    .description {
      font-size: 16px;
      color: rgba(0, 0, 0, 0.54);
    }

    .icon {
      display: block;
      width: 32px;
      height: 32px;
      fill: #1e3de4;
      overflow: hidden;
    }
  }
`;

function Directory() {
  // TODO loop
  return (
    <Wrapper className="page-directory">
      <div className="ui three cards">
        <a className="ui card">
          <div className="content">
            <div className="center aligned icon-circle">
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#iconexchange" />
              </svg>
            </div>
            <div className="center aligned header">
              <FormattedMessage id="app.directory.exchange.title" />
            </div>
            <div className="center aligned description">
              <p>
                <FormattedMessage id="app.directory.exchange.desc" />
              </p>
            </div>
          </div>
        </a>
        <a className="ui card">
          <div className="content">
            <div className="center aligned icon-circle">
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#iconqianbao-" />
              </svg>
            </div>
            <div className="center aligned header">
              <FormattedMessage id="app.directory.wallet.title" />
            </div>
            <div className="center aligned description">
              <p>
                <FormattedMessage id="app.directory.wallet.desc" />
              </p>
            </div>
          </div>
        </a>
        <a className="ui card">
          <div className="content">
            <div className="center aligned icon-circle">
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#iconwangluo" />
              </svg>
            </div>
            <div className="center aligned header">
              <FormattedMessage id="app.directory.website.title" />
            </div>
            <div className="center aligned description">
              <p>
                <FormattedMessage id="app.directory.website.desc" />
              </p>
            </div>
          </div>
        </a>
        <a className="ui card">
          <div className="content">
            <div className="center aligned icon-circle">
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#iconnews" />
              </svg>
            </div>
            <div className="center aligned header">
              <FormattedMessage id="app.directory.news.title" />
            </div>
            <div className="center aligned description">
              <p>
                <FormattedMessage id="app.directory.news.desc" />
              </p>
            </div>
          </div>
        </a>
        <a className="ui card">
          <div className="content">
            <div className="center aligned icon-circle">
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#iconusers" />
              </svg>
            </div>
            <div className="center aligned header">
              <FormattedMessage id="app.directory.topholders.title" />
            </div>
            <div className="center aligned description">
              <p>
                <FormattedMessage id="app.directory.topholders.desc" />
              </p>
            </div>
          </div>
        </a>
        <a className="ui card">
          <div className="content">
            <div className="center aligned icon-circle">
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#iconcommunity" />
              </svg>
            </div>
            <div className="center aligned header">
              <FormattedMessage id="app.directory.community.title" />
            </div>
            <div className="center aligned description">
              <p>
                <FormattedMessage id="app.directory.community.desc" />
              </p>
            </div>
          </div>
        </a>
      </div>
    </Wrapper>
  );
}
export default Directory;
