// import url from 'url';
import { UPDATE_COMMON } from '../constants';

const initState = {
  lang: 'zh',
  network: 'testnet',

  fcStat: {
    // address: ''
  },
};

// const parsed = url.parse(window.location.href);
// if (parsed.hostname === 'confluxscan.io') {
//   initState.network = 'mainnet';
// }

export default (state = initState, action) => {
  if (action.type === UPDATE_COMMON) {
    return {
      ...state,
      ...action.payload,
    };
  }

  return state;
};
