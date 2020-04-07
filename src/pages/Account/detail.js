import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import compose from 'lodash/fp/compose';
import { i18n } from '../../utils';
import * as commonCss from '../../globalStyles/common';
import media from '../../globalStyles/media';
import MinedBlocks from './minedBlocks';
import Transitions from './transitions';
import AccountHead from './accountHead';

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  .ctrlpanel-wrap {
    box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px 1px;
    ${media.pad`
      margin-top: -1px;
      box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px 1px;
    `}
  }
`;

const TabZone = styled.div`
  position: relative;
  width: 100%;
  ${media.pad`
    margin-left: 16px;
    margin-right: 16px;
    width: auto;
  `}
  button {
    outline: none;
    border: none;
  }
  .ui.attached.tabular.menu {
    border-bottom: none;
  }
  .ui.tabular.menu .active.item {
    ${commonCss.lightBorder}
    background:rgba(255,255,255,1);
  }
`;

class Detail extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      currentTab: 1,
      showMaintaining: false,
    };
  }

  render() {
    const { currentTab, showMaintaining } = this.state;
    const {
      intl,
      match: { params },
    } = this.props;

    return (
      <div className="page-address-detail">
        {showMaintaining && (
          <div className="message message-important-light">
            <span>{intl.formatMessage({ id: 'system maintaining, please visit later' })}</span>
          </div>
        )}
        <Wrapper>
          <AccountHead
            accountid={params.accountid}
            history={history}
            onFetchErr={() => {
              this.setState({
                showMaintaining: true,
              });
            }}
          />
          <TabZone>
            <div className="ui attached tabular menu">
              <button
                type="button"
                className={currentTab === 1 ? 'active item' : 'item'}
                onKeyUp={() => {}}
                onClick={() => this.setState({ currentTab: 1 })}
              >
                {i18n('app.pages.account.detail.transactions')}
              </button>
              <button
                type="button"
                className={currentTab === 2 ? 'active item' : 'item'}
                onKeyUp={() => {}}
                onClick={() => {
                  this.setState({ currentTab: 2 });
                }}
              >
                {i18n('Mined Blocks')}
              </button>
            </div>
            <div className="ctrlpanel-wrap">
              <Transitions isActive={currentTab === 1} accountid={params.accountid} />
              <MinedBlocks isActive={currentTab === 2} accountid={params.accountid} />
            </div>
          </TabZone>
        </Wrapper>
      </div>
    );
  }
}
Detail.propTypes = {
  match: PropTypes.objectOf(PropTypes.string),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
Detail.defaultProps = {
  match: {},
};
const hoc = compose(
  injectIntl,
  withRouter
);
export default hoc(Detail);
