import { isEmpty } from 'lodash';
import { decodeConstructorArgs } from 'canoe-solidity';

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

function convertstr(original, bytecode, strval, type) {
  let tmpval = '';
  switch (type) {
    case 'hex':
      tmpval = hex2utf8(bytecode || strval);
      break;
    case 'default':
      tmpval = original;
      break;
    default:
      tmpval = bytecode;
      break;
  }
  return tmpval;
}

function decodeinput(bytecode, functionName, abi) {
  if (functionName && !isEmpty(abi)) {
    let name = functionName.split('(')[0];
    let results = decodeConstructorArgs(name, abi, bytecode.substring(10));
    return results;
  }
  return null;
}

// function _asc2hex(pStr) {
//   let tempstr = '';
//   for (a = 0; a < pStr.length; a += 1) {
//     tempstr += pStr.charCodeAt(a).toString(16);
//   }
//   return tempstr;
// }

export { convertstr, decodeinput };
