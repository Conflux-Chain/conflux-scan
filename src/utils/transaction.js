import { isEmpty } from 'lodash';

// eslint-disable-next-line import/extensions
import { Conflux } from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';

const cfx = new Conflux();

function hex2asc(pStr) {
  let tempstr = '';
  for (let b = 0; b < pStr.length; b += 2) {
    tempstr += String.fromCharCode(parseInt(pStr.substr(b, 2), 16));
  }
  return tempstr;
}

function hex2utf8(pStr) {
  let tempstr = '';
  try {
    tempstr = decodeURIComponent(pStr.replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&'));
  } catch (err) {
    tempstr = hex2asc(pStr);
  }
  return tempstr;
}

function decodeContract({ abi, address, transacionData }) {
  const contract = cfx.Contract({ abi, address });
  return contract.abi.decodeData(transacionData);
}

export { hex2utf8, decodeContract };
