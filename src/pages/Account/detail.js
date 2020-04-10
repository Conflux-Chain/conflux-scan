/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import compose from 'lodash/fp/compose';
import { i18n, isContract } from '../../utils';
import * as commonCss from '../../globalStyles/common';
import media from '../../globalStyles/media';
import MinedBlocks from './minedBlocks';
import Transitions from './transitions';
import AccountHead from './accountHead';
import ContractPanel from './contractPanel';
import TokenTxns from './tokenTxns';
import { reqContract } from '../../utils/api';

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

const tabEnum = {
  transactions: 'transactions',
  tokenTxns: 'tokenTxns',
  contract: 'contract',
  minedBlocks: 'minedBlocks',
};

class Detail extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      blockCount: 0,
      currentTab: tabEnum.transactions,
      showMaintaining: false,
      contractInfo: {},
    };
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;
    const { accountid } = params;
    if (isContract(accountid)) {
      this.fetchContractInfo(accountid);
    }
  }

  componentDidUpdate(prevProps) {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.props.accountid !== prevProps.accountid) {
      // eslint-disable-next-line react/destructuring-assignment
      this.switchTabIfNeed();
      if (isContract(this.props.accountid)) {
        this.fetchContractInfo(this.props.accountid);
      }
    }
  }

  switchTabIfNeed() {
    const { location } = this.props;
    if (location.hash === '#tokentxns') {
      this.setState({ currentTab: tabEnum.tokenTxns });
    }
  }

  fetchContractInfo(accountid) {
    const fields = [
      'address',
      'type',
      'name',
      'webside',
      'tokenName',
      'tokenSymbol',
      'tokenIcon',
      'tokenDecimal',
      'abi',
      'bytecode',
      'icon',
      'sourceCode',
    ].join(',');

    reqContract({
      fields,
      address: accountid,
    }).then((body) => {
      // todo error check
      if (body.code === 0) {
        this.setState({
          contractInfo: body.result,
        });
      }
    });
  }

  render() {
    const { currentTab, showMaintaining, blockCount, contractInfo } = this.state;
    const {
      intl,
      match: { params },
    } = this.props;

    const { accountid } = params;
    const isContractAddr = isContract(accountid);

    return (
      <div className="page-address-detail">
        {showMaintaining && (
          <div className="message message-important-light">
            <span>{intl.formatMessage({ id: 'system maintaining, please visit later' })}</span>
          </div>
        )}
        <Wrapper>
          <AccountHead
            accountid={accountid}
            history={history}
            contractInfo={contractInfo}
            onFetchErr={() => {
              this.setState({
                showMaintaining: true,
              });
            }}
            updateBlockCount={(num) => {
              this.setState({
                blockCount: num,
              });
            }}
          />
          <TabZone>
            <div className="ui attached tabular menu">
              <button
                type="button"
                className={currentTab === tabEnum.transactions ? 'active item' : 'item'}
                onKeyUp={() => {}}
                onClick={() => this.setState({ currentTab: tabEnum.transactions })}
              >
                {i18n('app.pages.account.detail.tab.transactions')}
              </button>
              <button
                type="button"
                className={currentTab === tabEnum.tokenTxns ? 'active item' : 'item'}
                onKeyUp={() => {}}
                onClick={() => this.setState({ currentTab: tabEnum.tokenTxns })}
              >
                {i18n('Token Txns')}
              </button>
              {isContractAddr && (
                <button
                  type="button"
                  className={currentTab === tabEnum.contract ? 'active item' : 'item'}
                  onKeyUp={() => {}}
                  onClick={() => this.setState({ currentTab: tabEnum.contract })}
                >
                  {i18n('Contract')}
                </button>
              )}
              <button
                type="button"
                className={currentTab === tabEnum.minedBlocks ? 'active item' : 'item'}
                onKeyUp={() => {}}
                onClick={() => {
                  this.setState({ currentTab: tabEnum.minedBlocks });
                }}
                style={{
                  display: blockCount > 0 ? 'block' : 'none',
                }}
              >
                {i18n('Mined Blocks')}
              </button>
            </div>
            <div className="ctrlpanel-wrap">
              <Transitions isActive={currentTab === tabEnum.transactions} accountid={accountid} />
              {blockCount > 0 && (
                <MinedBlocks blockCount={blockCount} isActive={currentTab === tabEnum.minedBlocks} accountid={accountid} />
              )}
              {isContractAddr && (
                <ContractPanel isActive={currentTab === tabEnum.contract} accountid={accountid} contractInfo={contractInfo} />
              )}
              <TokenTxns isActive={currentTab === tabEnum.tokenTxns} accountid={accountid} />
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
  accountid: PropTypes.string.isRequired,
  location: PropTypes.objectOf({
    hash: PropTypes.string,
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
