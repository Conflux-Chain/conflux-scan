import { sendRequest } from './index';

export const reqFcStat = (param) => {
  return sendRequest({
    // url: 'http://yapi.conflux-chain.org/mock/4/dashboard/fc/statistics',
    url: '/api/dashboard/fc/statistics',
    query: param,
  }).then((res) => res.body);
};

export const reqFcList = (param) => {
  return sendRequest({
    // url: 'http://yapi.conflux-chain.org/mock/4/transaction/fc/list',
    url: '/api/transaction/fc/list',
    query: param,
  }).then((res) => res.body);
};

export const reqFcByAddress = (param) => {
  return sendRequest({
    url: '/api/account/:address/fc',
    // url: 'http://yapi.conflux-chain.org/mock/4/account/:address/fc',
    query: param,
  }).then((res) => res.body);
};
