import { sendRequest } from './index';
import { apiPrefix, futurePrefix, contractMangerPrefix } from '../constants';

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

export const reqTokenList = (param, extra) => {
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
  }).then((res) => res.body);
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
