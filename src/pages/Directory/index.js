import React from 'react';
import { NavLink } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import styled from 'styled-components';
import media from '../../globalStyles/media';

const Wrapper = styled.div`
  width: 100%;
  max-width: 1260px;
  margin: 0 auto;

  ${media.pad`
    padding-left: 16px;
    padding-right: 16px;
  `}

  .ui.cards {
    justify-content: center;
  }

  .ui.card {
    width: 384px !important;
    min-height: 224px;
    border: none;
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    margin-left: 12px !important;
    margin-right: 12px !important;

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

    &.disabled {
      cursor: not-allowed !important;
      &:hover {
        transform: none;
        box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.12) !important;

        .icon-circle {
          animation: none;
        }
      }

      .header,
      .description {
        color: rgba(0, 0, 0, 0.38);
      }

      .icon-circle {
        border-color: rgba(0, 0, 0, 0.38);
      }
      .icon {
        fill: rgba(0, 0, 0, 0.38);
      }
    }
  }
`;

const links = [
  {
    key: 'exchange',
    icon: 'iconexchange',
    href: '',
    disable: true,
  },
  {
    key: 'wallet',
    icon: 'iconqianbao-',
    href: 'https://wallet.confluxscan.io/',
    disable: false,
  },
  {
    key: 'website',
    icon: 'iconwangluo',
    href: 'https://www.conflux-chain.org/',
    disable: false,
  },
  {
    key: 'news',
    icon: 'iconnews',
    href: 'https://www.conflux-chain.org/blog/',
    disable: false,
  },
  {
    key: 'topholders',
    icon: 'iconusers',
    href: '',
    disable: true,
  },
  {
    key: 'community',
    icon: 'iconcommunity',
    href: 'https://www.conflux-chain.org/community/',
    disable: false,
  },
];

function Directory() {
  return (
    <Wrapper className="page-directory">
      <div className="ui three cards">
        {links.map((link) => (
          <a className={`ui card ${link.disable ? 'disabled' : ''}`} href={link.href || 'javascript:void(0)'} key={link.key}>
            <div className="content">
              <div className="center aligned icon-circle">
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref={'#' + link.icon} />
                </svg>
              </div>
              <div className="center aligned header">
                <FormattedMessage id={`app.directory.${link.key}.title`} />
              </div>
              <div className="center aligned description">
                <p>
                  <FormattedMessage id={`app.directory.${link.key}.desc`} />
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </Wrapper>
  );
}
export default Directory;
