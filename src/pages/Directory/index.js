import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import styled from 'styled-components';
import media from '../../globalStyles/media';
import iconFcLogo from '../../assets/images/icons/fc-logo.svg';
import contractLogo from '../../assets/images/icons/contract.svg';
import portalLogo from '../../assets/images/icons/portal-logo.png';
import exchangeLogo from '../../assets/images/icons/icon-exchange.png';

const Wrapper = styled.div`
  width: 100%;
  max-width: 1260px;
  margin: 0 auto;

  ${media.pad`
    padding-left: 16px;
    padding-right: 16px;
  `}

  .ui.cards {
  }

  .ui.card {
    width: 384px !important;
    min-height: 224px;
    border: none;
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    margin-left: 12px !important;
    margin-right: 12px !important;

    > .content {
      padding: 1.5em 1.5em 2.5em;
    }

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

    .content > .header {
      font-size: 24px !important;
      font-weight: 700;
      color: #000;
      margin-top: 10px !important;
      color: rgba(0, 0, 0);
    }

    .content > .header + .description {
      font-size: 16px;
      margin-top: 8px;
      color: rgba(0, 0, 0);
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
  .png-icon {
    width: 72px;
    animation: animate 0.6s ease;
    animation-iteration-count: 1;
  }
`;

const links = [
  {
    key: 'website',
    icon: 'iconwangluo',
    href: 'https://www.conflux-chain.org/',
    disable: false,
  },
  {
    key: 'ConfluxPortal',
    icon: <img className="png-icon" src={portalLogo} />,
    href: 'https://portal.conflux-chain.org/',
    disable: false,
  },
  {
    key: 'wallet',
    icon: 'iconqianbao-',
    href: 'https://wallet.confluxscan.io/',
    disable: false,
  },
  {
    key: 'exchange',
    icon: <img className="png-icon" src={exchangeLogo} />,
    href: '',
    disable: false,
  },
  {
    key: 'contract',
    icon: <img src={contractLogo} />,
    href: '',
    disable: false,
    onClick: (history) => {
      history.push('/contract/create');
    },
  },
  {
    key: 'news',
    icon: 'iconnews',
    href: 'https://www.conflux-chain.org/blog/',
    disable: false,
  },
  {
    key: 'community',
    icon: 'iconcommunity',
    href: 'https://www.conflux-chain.org/community/',
    disable: false,
  },
];

function Directory(props) {
  const { history } = props;
  return (
    <Wrapper className="page-directory">
      <div className="ui three cards">
        {links.map((link) => {
          let iconLink;
          if (React.isValidElement(link.icon)) {
            iconLink = link.icon;
          } else {
            iconLink = (
              <svg className="icon" aria-hidden="true">
                <use xlinkHref={'#' + link.icon} />
              </svg>
            );
          }

          return (
            <a
              onClick={() => {
                if (link.onClick) {
                  link.onClick(history);
                }
              }}
              className={`ui card ${link.disable ? 'disabled' : ''}`}
              href={link.href || undefined}
              key={link.key}
            >
              <div className="content">
                <div className="center aligned icon-circle">{iconLink}</div>
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
          );
        })}
      </div>
    </Wrapper>
  );
}

Directory.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
export default Directory;
