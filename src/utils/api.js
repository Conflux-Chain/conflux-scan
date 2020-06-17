import { sendRequest, getStore, fmtConfirmationRisk, wait } from './index';
import {
  apiPrefix,
  contractMangerPrefix,
  UPDATE_CONTRACT_MANAGER_CACHE,
  errorCodes,
  CLEAR_CONTRACT_MANAGER_CACHE,
  fullNodeErrCodes,
} from '../constants';
import { cfx, cfxUtil } from './transaction';
import { toast } from '../components/Toast';

export const reqRecentDagBlock = () => {
  return sendRequest({ url: `${apiPrefix}/dashboard/dag` }).then((res) => res.body);
};

export const reqAccount = (param, extra) => {
  return sendRequest({
    url: `${apiPrefix}/address/query`,
    query: param,
    ...extra,
  }).then((res) => res.body);
};

export const reqAccountTransactionList = (param) => {
  return sendRequest({
    url: `${apiPrefix}/transaction/list`,
    query: param,
  }).then((res) => res.body);
};

export const reqMinedBlockList = (param, extra) => {
  return sendRequest({
    url: `${apiPrefix}/block/list`,
    query: param,
    ...extra,
  }).then((res) => res.body);
};

export const reqBlock = (param, extra) => {
  return sendRequest({
    url: `${apiPrefix}/block/query`,
    query: param,
    ...extra,
  }).then((res) => res.body);
};

export const reqBlockTransactionList = (param, extra) => {
  return sendRequest({
    url: `${apiPrefix}/transaction/list`,
    query: param,
    ...extra,
  }).then((res) => res.body);
};

export const reqBlockRefereeBlockList = (param, extra) => {
  return sendRequest({
    url: `${apiPrefix}/block/list`,
    query: param,
    ...extra,
  }).then((res) => res.body);
};

export const reqBlockList = (param, extra) => {
  return sendRequest({
    url: `${apiPrefix}/block/list`,
    query: param,
    ...extra,
  }).then((res) => res.body);
};

export const reqTransactionList = (param, extra) => {
  return sendRequest({
    url: `${apiPrefix}/transaction/list`,
    query: param,
    ...extra,
  }).then((res) => res.body);
};

export const reqStatistics = (param) => {
  return sendRequest({
    url: `${apiPrefix}/dashboard/trend`,
    query: param,
  }).then((res) => res.body);
};

export const reqStatisticsItem = (param) => {
  return sendRequest({
    url: `${apiPrefix}/dashboard/plot`,
    query: param,
  }).then((res) => res.body);
};

export const reqTransactionDetail = (param, extra) => {
  return sendRequest({
    url: `${apiPrefix}/transaction/query`,
    query: param,
    ...extra,
  }).then((res) => res.body);
};

export const reqUtilType = (param, extra) => {
  return sendRequest({
    url: `${apiPrefix}/util/type`,
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

export const reqContractManagerContractList = (param, extra) => {
  return sendRequest({
    url: `${contractMangerPrefix}/api/contract/list`,
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
    url: `${apiPrefix}/transfer/list`,
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
    url: `${apiPrefix}/transfer/list`,
    query: param,
    ...extra,
  }).then((res) => res.body);
};

export const reqTokenList = (param, extra) => {
  return sendRequest({
    url: `${apiPrefix}/token/list`,
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
    url: `${apiPrefix}/token/query`,
    query: param,
    ...extra,
  }).then((res) => res.body);
};

export const reqContractListInfo = (addrList) => {
  const store = getStore();
  const { contractManagerCache } = store.getState().common;
  const addressList = [];
  addrList.forEach((addr) => {
    if (!contractManagerCache[addr]) {
      addressList.push(addr);
    }
  });

  if (addressList.length === 0) {
    return;
  }

  const fields = ['address', 'name', 'tokenIcon', 'icon', 'website'].join(',');

  reqContractManagerContractList(
    {
      fields,
      address: addressList.join(','),
    },
    { showError: false, showNetWorkError: false }
  ).then((body) => {
    if (body.code === 0) {
      body.result.list.forEach((v) => {
        if (v.name) {
          store.dispatch({
            type: UPDATE_CONTRACT_MANAGER_CACHE,
            payload: {
              ...v,
              address: v.address,
            },
          });
        } else {
          store.dispatch({
            type: UPDATE_CONTRACT_MANAGER_CACHE,
            payload: {
              address: v.address,
              notfound: true,
            },
          });
        }
      });
    }
  });
};

const callWithRetry = async (callFn) => {
  try {
    return await callFn();
  } catch (e) {
    await wait(1000);
    try {
      return await callFn();
    } catch (e1) {
      if (e1 && e1.code === fullNodeErrCodes.notReady) {
        await wait(2000);
      } else {
        await wait(1000);
      }
      try {
        return await callFn();
      } catch (e2) {
        return callFn();
      }
    }
  }
};

export const reqBalanceOf = async (opts) => {
  const contract = cfx.Contract({
    address: opts.address,
    abi: [
      {
        type: 'function',
        name: 'balanceOf',
        inputs: [{ type: 'address' }],
        outputs: [{ type: 'uint256' }],
      },
    ],
  });

  try {
    const result = await callWithRetry(() => contract.balanceOf(opts.params[0]));
    if (typeof result === 'undefined' || result === null) {
      return Promise.reject(new Error('balanceOf=null'));
    }
    return result.toString();
  } catch (e) {
    if (opts.showError !== false) {
      toast.error({
        content: e.message,
        title: 'app.comp.toast.error.other',
      });
    }
    return Promise.reject(e);
  }
};

export const reqConfirmationRiskByHash = async (blockHash) => {
  try {
    const callProvider = () => {
      return cfx.provider.call('cfx_getConfirmationRiskByHash', cfxUtil.format.blockHash(blockHash));
    };
    let result = await callProvider();
    if (!result) {
      // retry when result is null or empty
      await wait(3000);
      result = await callProvider();
    }
    if (result) {
      return fmtConfirmationRisk(result.toString());
    }
    return '';
  } catch (e) {
    return '';
  }
};
