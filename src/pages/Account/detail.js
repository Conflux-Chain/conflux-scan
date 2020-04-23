/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import compose from 'lodash/fp/compose';
import { i18n, isContract, tranferToLowerCase } from '../../utils';
import * as commonCss from '../../globalStyles/common';
import media from '../../globalStyles/media';
import MinedBlocks from './minedBlocks';
import Transactions from './transactions';
import AccountHead from './accountHead';
import ContractPanel from './contractPanel';
import TokenTxns from './tokenTxns';
import { reqContract, reqTokenList } from '../../utils/api';
import { errorCodes } from '../../constants';

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
  tokentxns: 'tokentxns',
  contract: 'contract',
  minedBlocks: 'minedBlocks',
};

function removeHash() {
  history.replaceState(null, null, ' ');
}

class Detail extends Component {
  constructor(...args) {
    super(...args);
    this.getAccountId = () => {
      const {
        match: { params },
      } = this.props;
      let { accountid } = params;
      return tranferToLowerCase(accountid);
    };

    this.state = {
      blockCount: 0,
      currentTab: null,
      showMaintaining: false,
      contractInfo: {},
      tokenList: [],
      tokenTotal: 0,
      accountid: this.getAccountId(),
    };
  }

  componentDidMount() {
    const accountid = this.getAccountId();
    if (isContract(accountid)) {
      this.fetchContractInfo(accountid);
    }
    this.fetchTokenList(accountid);
    this.autoSwitchTab();
  }

  componentDidUpdate(prevProps) {
    const currentAccountId = this.getAccountId();
    const prevAccountId = tranferToLowerCase(prevProps.match.params.accountid);
    if (currentAccountId !== prevAccountId) {
      // eslint-disable-next-line  react/no-did-update-set-state
      this.autoSwitchTab();
      // eslint-disable-next-line  react/no-did-update-set-state
      this.setState({
        accountid: currentAccountId,
      });
      this.fetchTokenList(currentAccountId);
      if (isContract(currentAccountId)) {
        this.fetchContractInfo(currentAccountId);
      }
    }
  }

  autoSwitchTab() {
    const { location } = this.props;
    if (location.hash === `#${tabEnum.tokentxns}`) {
      this.setState({ currentTab: tabEnum.tokentxns });
    } else if (location.hash === `#${tabEnum.minedBlocks}`) {
      this.setState({ currentTab: tabEnum.minedBlocks });
    } else if (location.hash === `#${tabEnum.contract}`) {
      this.setState({ currentTab: tabEnum.contract });
    } else {
      this.setState({ currentTab: tabEnum.transactions });
    }
  }

  fetchTokenList(accountid) {
    reqTokenList({
      address: accountid,
    }).then((body) => {
      if (body.code === 0) {
        const listSorted = (body.result.list || []).sort((a, b) => {
          return b.balance - a.balance;
        });
        const tokenMap = {};
        listSorted.forEach((v) => {
          tokenMap[v.address] = v;
        });
        this.setState({
          tokenTotal: body.result.list.length,
          tokenList: listSorted,
          tokenMap,
        });
      }
    });
  }

  fetchContractInfo(accountid) {
    const fields = [
      'address',
      'type',
      'name',
      'website',
      'tokenName',
      'tokenSymbol',
      'tokenIcon',
      'tokenDecimal',
      'abi',
      'bytecode',
      'icon',
      'sourceCode',
    ].join(',');

    reqContract(
      {
        fields,
        address: accountid,
      },
      {
        showError: false,
      }
    ).then((body) => {
      if (body.code === 0) {
        this.setState({
          contractInfo: body.result,
        });
      }
    });
  }

  render() {
    const { currentTab, showMaintaining, blockCount, contractInfo, tokenTotal, tokenList, tokenMap } = this.state;
    const { intl } = this.props;

    const { accountid } = this.state;
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
            tokenTotal={tokenTotal}
            tokenList={tokenList}
          />
          <TabZone>
            <div className="ui attached tabular menu">
              <button
                type="button"
                className={currentTab === tabEnum.transactions ? 'active item' : 'item'}
                onKeyUp={() => {}}
                onClick={() => {
                  this.setState({ currentTab: tabEnum.transactions });
                  if (window.location.hash) {
                    removeHash();
                  }
                }}
              >
                {i18n('app.pages.account.detail.tab.transactions')}
              </button>
              <button
                type="button"
                className={currentTab === tabEnum.tokentxns ? 'active item' : 'item'}
                onKeyUp={() => {}}
                onClick={() => {
                  this.setState({ currentTab: tabEnum.tokentxns });
                  window.location.replace(`#${tabEnum.tokentxns}`);
                }}
              >
                {i18n('app.pages.account.detail.tokentxns')}
              </button>
              {isContractAddr && (
                <button
                  type="button"
                  className={currentTab === tabEnum.contract ? 'active item' : 'item'}
                  onKeyUp={() => {}}
                  onClick={() => {
                    this.setState({ currentTab: tabEnum.contract });
                    window.location.replace(`#${tabEnum.contract}`);
                  }}
                >
                  {i18n('app.common.contract')}
                </button>
              )}
              <button
                type="button"
                className={currentTab === tabEnum.minedBlocks ? 'active item' : 'item'}
                onKeyUp={() => {}}
                onClick={() => {
                  this.setState({ currentTab: tabEnum.minedBlocks });
                  window.location.replace(`#${tabEnum.minedBlocks}`);
                }}
                style={{
                  display: blockCount > 0 ? 'block' : 'none',
                }}
              >
                {i18n('Mined Blocks')}
              </button>
            </div>
            <div className="ctrlpanel-wrap">
              <Transactions isActive={currentTab === tabEnum.transactions} accountid={accountid} />
              {currentTab === tabEnum.minedBlocks && blockCount > 0 ? <MinedBlocks blockCount={blockCount} accountid={accountid} /> : null}
              {isContractAddr && (
                <ContractPanel isActive={currentTab === tabEnum.contract} accountid={accountid} contractInfo={contractInfo} />
              )}
              <TokenTxns isActive={currentTab === tabEnum.tokentxns} accountid={accountid} tokenMap={tokenMap} />
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
