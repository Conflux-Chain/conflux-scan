import { sendRequest } from './index';
import { apiPrefix } from '../constants';

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

export const reqAccount = (param) => {
  return sendRequest({
    url: `${apiPrefix}/account/${param.accountid}`,
    query: param,
  }).then((res) => res.body);
};

export const reqAccountTransactionList = (param) => {
  return sendRequest({
    url: `${apiPrefix}/account/${param.accountid}/transactionList`,
    query: param,
  }).then((res) => res.body);
};

export const reqMinedBlockList = (param) => {
  return sendRequest({
    url: `${apiPrefix}/account/${param.accountid}/minedBlockList`,
    query: param,
  }).then((res) => res.body);
};

export const reqBlock = (param) => {
  return sendRequest({
    url: `${apiPrefix}/block/${param.blockHash}`,
    query: param,
  }).then((res) => res.body);
};

export const reqBlockTransactionList = (param, extra) => {
  return sendRequest({
    url: `${apiPrefix}/block/${param.blockHash}/transactionList`,
    query: param,
    ...extra,
  }).then((res) => res.body);
};

export const reqBlockRefereeBlockList = (param, extra) => {
  return sendRequest({
    url: `${apiPrefix}/block/${param.blockHash}/refereeBlockList`,
    query: param,
    ...extra,
  }).then((res) => res.body);
};

export const reqBlockList = (param) => {
  return sendRequest({
    url: `${apiPrefix}/block/list`,
    query: param,
  }).then((res) => res.body);
};

export const reqTransactionList = (param) => {
  return sendRequest({
    url: `${apiPrefix}/transaction/list`,
    query: param,
  }).then((res) => res.body);
};

export const reqStatistics = (param) => {
  return sendRequest({
    url: `${apiPrefix}/dashboard/statistics`,
    query: param,
  }).then((res) => res.body);
};

export const reqStatisticsItem = (param) => {
  return sendRequest({
    url: `${apiPrefix}/dashboard/statistics/${param.name}`,
    query: param,
  }).then((res) => res.body);
};

export const reqTransactionDetail = (param, extra) => {
  return sendRequest({
    url: `${apiPrefix}/transaction/${param.txnhash}`,
    query: param,
    ...extra,
  }).then((res) => res.body);
};
