import url from 'url';
import { UPDATE_COMMON, isMainnet } from '../constants';

const initState = {
  lang: 'zh',
  network: isMainnet ? 'mainnet' : 'testnet',

  fcStat: {
    // address: ''
  },
};

export default (state = initState, action) => {
  if (action.type === UPDATE_COMMON) {
    return {
      ...state,
      ...action.payload,
    };
  }

  return state;
};
