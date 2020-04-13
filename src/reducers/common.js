import { UPDATE_COMMON } from '../constants';

const initState = {
  lang: 'zh',
  network: 'testnet',
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
