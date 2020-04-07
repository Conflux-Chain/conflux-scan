import { isEmpty } from 'lodash';
import { decodeConstructorArgs } from 'canoe-solidity';

const { Conflux } = require('js-conflux-sdk');

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

function decodeinput(bytecode, functionName, abi) {
  if (functionName && !isEmpty(abi)) {
    let name = functionName.split('(')[0];
    let results = decodeConstructorArgs(name, abi, bytecode.substring(10));
    return results;
  }
  return null;
}

function decodeContract({ abi, bytecode, address, transacionData }) {
  const contract = cfx.Contract({ abi, code: bytecode, address });
  return contract.abi.decodeData(transacionData);
}

export { decodeinput, hex2utf8, decodeContract };
