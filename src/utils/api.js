import { sendRequest, getStore, fmtConfirmationRisk } from './index';
import { futurePrefix, contractMangerPrefix, UPDATE_CONTRACT_MANAGER_CACHE, errorCodes, CLEAR_CONTRACT_MANAGER_CACHE } from '../constants';
import { cfx, cfxUtil } from './transaction';
import { toast } from '../components/Toast';

export const reqFcStat = (param) => {
  return sendRequest({
    // url: 'http://yapi.conflux-chain.org/mock/4/dashboard/fc/statistics',
    url: '/api/dashboard/fc/statistics',
    query: param,
  }).then((res) => res.body);
};

export const reqFcList = (param, options = {}) => {
  return sendRequest({
    // url: 'http://yapi.conflux-chain.org/mock/4/transaction/fc/list',
    url: '/api/transaction/fc/list',
    query: param,
    showError: options.showError,
  }).then((res) => res.body);
};

export const reqFcByAddress = (param) => {
  return sendRequest({
    url: `/api/account/${param.address}/fc`,
    // url: 'http://yapi.conflux-chain.org/mock/4/account/:address/fc',
    query: param,
  }).then((res) => res.body);
};

export const reqRecentDagBlock = () => {
  return sendRequest({ url: `${futurePrefix}/dashboard/dag` }).then((res) => res.body);
};

export const reqAccount = (param, extra) => {
  return sendRequest({
    url: `${futurePrefix}/account/query`,
    query: param,
    ...extra,
  }).then((res) => res.body);
};

export const reqAccountTransactionList = (param) => {
  return sendRequest({
    url: `${futurePrefix}/transaction/list`,
    query: param,
  }).then((res) => res.body);
};

export const reqMinedBlockList = (param, extra) => {
  return sendRequest({
    url: `${futurePrefix}/block/list`,
    query: param,
    ...extra,
  }).then((res) => res.body);
};

export const reqBlock = (param, extra) => {
  return sendRequest({
    url: `${futurePrefix}/block/query`,
    query: param,
    ...extra,
  }).then((res) => res.body);
};

export const reqBlockTransactionList = (param, extra) => {
  return sendRequest({
    url: `${futurePrefix}/transaction/list`,
    // url: `${apiPrefix}/block/${param.blockHash}/transactionList`,
    query: param,
    ...extra,
  }).then((res) => res.body);
};

export const reqBlockRefereeBlockList = (param, extra) => {
  return sendRequest({
    url: `${futurePrefix}/block/list`,
    query: param,
    ...extra,
  }).then((res) => res.body);
};

export const reqBlockList = (param, extra) => {
  return sendRequest({
    url: `${futurePrefix}/block/list`,
    query: param,
    ...extra,
  }).then((res) => res.body);
};

export const reqTransactionList = (param, extra) => {
  return sendRequest({
    url: `${futurePrefix}/transaction/list`,
    query: param,
    ...extra,
  }).then((res) => res.body);
};

export const reqStatistics = (param) => {
  return sendRequest({
    url: `${futurePrefix}/dashboard/trend`,
    query: param,
  }).then((res) => res.body);
};

export const reqStatisticsItem = (param) => {
  return sendRequest({
    url: `${futurePrefix}/dashboard/plot`,
    query: param,
  }).then((res) => res.body);
};

export const reqTransactionDetail = (param, extra) => {
  return sendRequest({
    url: `${futurePrefix}/transaction/query`,
    query: param,
    ...extra,
  }).then((res) => res.body);
};

export const reqUtilType = (param, extra) => {
  return sendRequest({
    url: `${futurePrefix}/util/type`,
    query: param,
    ...extra,
  }).then((res) => res.body);
};

export const reqContract = (param, extra) => {
  return sendRequest({
    url: `${contractMangerPrefix}/api/contract/query`,
    query: param,
    ...extra,
  }).then((res) => res.body);
};

export const reqAccountTokenList = (param, extra) => {
  return sendRequest({
    url: `${contractMangerPrefix}/api/account/token/list`,
    // url: 'http://yapi.conflux-chain.org/mock/20/account/token/list',
    query: param,
    ...extra,
  }).then((res) => res.body);
};

export const reqTokenTxnList = (param, extra) => {
  return sendRequest({
    url: `${futurePrefix}/transfer/list`,
    query: param,
    ...extra,
  }).then((res) => res.body);
};

export const reqContractUpdate = (param, extra) => {
  return sendRequest({
    type: 'POST',
    url: `${contractMangerPrefix}/api/contract/update`,
    body: param,
    ...extra,
  }).then((res) => {
    const store = getStore();
    store.dispatch({
      type: CLEAR_CONTRACT_MANAGER_CACHE,
      payload: {
        address: param.address,
      },
    });
    return res.body;
  });
};

export const reqContractCreate = (param, extra) => {
  return sendRequest({
    type: 'POST',
    url: `${contractMangerPrefix}/api/contract/create`,
    body: param,
    ...extra,
  }).then((res) => res.body);
};

export const reqTransferList = (param, extra) => {
  return sendRequest({
    url: `${futurePrefix}/transfer/list`,
    query: param,
    ...extra,
  }).then((res) => res.body);
};

export const reqTokenList = (param, extra) => {
  return sendRequest({
    url: `${futurePrefix}/token/list`,
    query: param,
    ...extra,
  }).then((res) => res.body);
};

export const reqContractMangerList = (param, extra) => {
  return sendRequest({
    url: `${contractMangerPrefix}/api/contract/list`,
    query: param,
    ...extra,
  }).then((res) => res.body);
};

export const reqTokenQuery = (param, extra) => {
  return sendRequest({
    url: `${futurePrefix}/token/query`,
    query: param,
    ...extra,
  }).then((res) => res.body);
};

export const reqContractListInfo = async (addrList) => {
  const store = getStore();
  const { contractManagerCache } = store.getState().common;
  const addressList = [];
  addrList.forEach((addr) => {
    if (!contractManagerCache[addr]) {
      addressList.push(addr);
    }
  });

  const fields = ['address', 'name', 'tokenIcon', 'icon', 'website'].join(',');

  for (let i = 0; i < addressList.length; i++) {
    const address = addressList[i];
    // eslint-disable-next-line no-await-in-loop
    await reqContract(
      {
        fields,
        address,
      },
      { showError: false }
    ).then((body) => {
      if (body.code === 0) {
        store.dispatch({
          type: UPDATE_CONTRACT_MANAGER_CACHE,
          payload: {
            ...body.result,
            address,
          },
        });
      } else if (body.code === errorCodes.ContractNotFound) {
        store.dispatch({
          type: UPDATE_CONTRACT_MANAGER_CACHE,
          payload: {
            address,
            notfound: true,
          },
        });
      }
    });
  }
};

const cfxSend = async (abi, fnName, address, callback) => {
  const contract = cfx.Contract({
    address,
    abi,
  });
  try {
    const result = await callback(contract[fnName]);
    return result.toString();
  } catch (e) {
    toast.error({
      content: e.message,
      title: 'app.comp.toast.error.other',
    });
    return Promise.reject(e);
  }
};

export const reqTotalSupply = async (opts) => {
  return cfxSend(
    [
      {
        type: 'function',
        name: 'totalSupply',
        inputs: [],
        outputs: [{ type: 'uint256' }],
      },
    ],
    'totalSupply',
    opts.address,
    async (contractFn) => {
      return contractFn();
    }
  );
};

export const reqBalanceOf = async (opts) => {
  return cfxSend(
    [
      {
        type: 'function',
        name: 'balanceOf',
        inputs: [{ type: 'address' }],
        outputs: [{ type: 'uint256' }],
      },
    ],
    'balanceOf',
    opts.address,
    async (contractFn) => {
      return contractFn(opts.params[0]);
    }
  );
};

export const reqConfirmationRiskByHash = async (blockHash) => {
  try {
    const result = await cfx.provider.call('cfx_getConfirmationRiskByHash', cfxUtil.format.blockHash(blockHash));
    return fmtConfirmationRisk(result.toString());
  } catch (e) {
    toast.error({
      content: e.message,
      title: 'app.comp.toast.error.other',
    });
    return Promise.reject(e);
  }
};
