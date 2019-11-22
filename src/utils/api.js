import { sendRequest } from './index';

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
  return sendRequest({ url: '/api/block/recent' }).then((res) => res.body);
};
