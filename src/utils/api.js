import { sendRequest } from './index';
import { apiPrefix, futurePrefix, contractPrefix } from '../constants';

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

export const reqTransactionList = (param) => {
  return sendRequest({
    url: `${futurePrefix}/transaction/list`,
    query: param,
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

export const reqContractQuery = (param, extra) => {
  return sendRequest({
    url: `${contractPrefix}/contract/query`,
    query: param,
    ...extra,
  }).then((res) => res.body);
};
