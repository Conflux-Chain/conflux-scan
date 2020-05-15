import { UPDATE_COMMON, UPDATE_CONTRACT_MANAGER_CACHE, isMainnet, CLEAR_CONTRACT_MANAGER_CACHE } from '../constants';

let curLang = navigator.language;
if (curLang.indexOf('zh') === 0) {
  curLang = 'zh';
} else {
  curLang = 'en';
}

const initState = {
  lang: curLang,
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

  if (action.type === CLEAR_CONTRACT_MANAGER_CACHE) {
    const contractManagerCacheCopy = { ...state.contractManagerCache };
    delete contractManagerCacheCopy[action.payload.address];
    return {
      ...state,
      contractManagerCache: {
        ...contractManagerCacheCopy,
      },
    };
  }

  return state;
};
