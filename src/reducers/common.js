import url from 'url';
import { UPDATE_COMMON, UPDATE_CONTRACT_MANAGER_CACHE, isMainnet } from '../constants';

const initState = {
  lang: 'zh',
  network: isMainnet ? 'mainnet' : 'testnet',

  fcStat: {
    // address: ''
  },
  contractManagerCache: {},
};

export default (state = initState, action) => {
  if (action.type === UPDATE_COMMON) {
    return {
      ...state,
      ...action.payload,
    };
  }
  if (action.type === UPDATE_CONTRACT_MANAGER_CACHE) {
    return {
      ...state,
      contractManagerCache: {
        ...state.contractManagerCache,
        [action.payload.address]: action.payload,
      },
    };
  }

  return state;
};
