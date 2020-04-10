import React from 'react';
import BigNumber from 'bignumber.js';
import template from 'lodash/template';
import superagent from 'superagent';
import querystring from 'querystring';
import huNum from 'humanize-number';
import { injectIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { toast } from '../components/Toast';
import { notice } from '../components/Message/notice';
import { errorCodes, addressTypeContract, addressTypeCommon } from '../constants';

let errorId = null;
let source = null;

export const convertToValueorFee = (bigNumber) => {
  const result = new BigNumber(bigNumber).dividedBy(10 ** 18);
  if (result.toFixed() < 0.00001) return `< 0.00001`;
  return `${result.toFixed(4)}`;
};
export const dripTocfx = (bigNumber) => {
  const result = new BigNumber(bigNumber).dividedBy(10 ** 18);
  return result.toString(10);
};
export const dripToGdrip = (bigNumber) => {
  const result = new BigNumber(bigNumber).dividedBy(10 ** 9);
  return result.toString(10);
};

export const converToGasPrice = (bigNumber) => {
  const result = new BigNumber(bigNumber).dividedBy(10 ** 9);
  if (result.toFixed() < 0.00001) return `< 0.00001`;
  return `${result.toFixed(5)}`;
};

export const converToGasPrice3Fixed = (bigNumber) => {
  const result = new BigNumber(bigNumber).dividedBy(10 ** 18);
  // console.log(result.toNumber());
  if (result.toFixed() < 0.001) return 0;
  if (result.toFixed(3) >= 1) return result.toFixed();
  return result.toFixed(3);
};

export const getXmlHttpRequest = () => {
  try {
    // 主流浏览器提供了XMLHttpRequest对象
    return new XMLHttpRequest();
  } catch (e) {
    // 低版本的IE浏览器没有提供XMLHttpRequest对象，IE6以下
    // 所以必须使用IE浏览器的特定实现ActiveXObject
    return new window.ActiveXObject('Microsoft.XMLHTTP');
  }
};

export const initSse = (tthis, uri = '/proxy/fetch_random_time') => {
  source = null;
  source = new EventSource(uri);

  const damon = (id, that) => {
    const isValidUri = (type = 'GET', pingUri = '/', callback = () => {}, tthat) => {
      let xhr = getXmlHttpRequest();
      // readyState 0=>初始化 1=>载入 2=>载入完成 3=>解析 4=>完成
      // console.log(xhr.readyState);  0
      xhr.open(type, pingUri, true);
      // console.log(xhr.readyState);  1
      xhr.send();
      // console.log(xhr.readyState);  1
      xhr.onreadystatechange = () => {
        // console.log(xhr.status); //HTTP状态吗
        // console.log(xhr.readyState);  2 3 4
        if (xhr.readyState === 4 && xhr.status === 200) {
          // console.log(xhr.readyState, 200, '===log');
          initSse(tthat, uri);
          callback(true);
        } else if (xhr.readyState === 4 && xhr.status === 0) {
          // maybe 502
          // console.log('502 (Bad Gateway)', errorId);
          source.close();
          damon(errorId, tthat);
          callback(false);
        }
      };
    };
    if (!id) {
      errorId = setInterval(() => {
        isValidUri(
          'GET',
          '/proxy/ping',
          (result) => {
            if (result) {
              clearInterval(errorId);
              errorId = null;
              console.log(result, ' ==== result === errorid ====', source);
            }
          },
          that
        );
      }, 5000);
    }
  };

  source.addEventListener(
    'open',
    (info) => {
      // console.log(errorIds, '=== open');
    },
    'false'
  );
  source.addEventListener('message', (data) => {
    const result = JSON.parse(data.data);
    console.log(result);
    tthis.setState({
      showLoading: false,
      BlockList: result.find((item) => Object.keys(item)[0] === 'block/list')['block/list'] || [],
      TxList: result.find((item) => Object.keys(item)[0] === 'transaction/list')['transaction/list'] || [],
      plusTimeCount: 0,
    });
    tthis.beginCountOnce();
    // console.log(data);
    // $('body').append(`<p>${data.data}</p>`);
  });
  source.addEventListener('end', (event) => {
    console.log('should close');
    tthis.close();
  });

  source.addEventListener(
    'error',
    (err) => {
      // console.log('emit here ==== ');
      damon(errorId, tthis);
    },
    'false'
  );
  return source;
};

export const closeSource = () => {
  console.log('yes', source);
  clearInterval(errorId);
  source.close();
};

export const toFixed = (num, decimal) => {
  if (isNaN(num)) {
    return 0;
  }
  if (decimal === 0) {
    return parseInt(num, 0);
  }
  const p = 10 ** decimal;
  return Math.round(num * p) / p;
};

export const toThousands = (num) => {
  let str = num + '';
  let re = /(?=(?!(\b))(\d{3})+$)/g;
  str = str.replace(re, ',');
  return str;
};

/*
  {
    url: '/xxx',
    type: 'GET', //默认
    query: { // get参数
    },
    body: { // post参数
    },
    headers: {} // 可选
  }
  error code under HTTP status code 2xx:
 0. no error
 1. Parameter error: input parameters invalid
 2. Database error: database service is not available
 3. Full-node error: full-node is not available
*/

export const sendRequest = (config) => {
  const reqType = config.type || 'GET';
  const reqPromise = superagent(reqType, config.url)
    .set(config.headers || {})
    .query(config.query || {})
    .send(config.body)
    .ok((res) => {
      if (res.status === 200 || res.status === 304) {
        return true;
      }
      return false;
    });

  reqPromise.then((result) => {
    if (result.body.code !== 0 && config.showError !== false) {
      let title;
      switch (result.body.code) {
        case errorCodes.ParameterError:
          title = 'app.comp.toast.error.1';
          break;
        case errorCodes.DBError:
          title = 'app.comp.toast.error.2';
          break;
        default:
          title = 'app.comp.toast.error.other';
      }
      toast.error({
        content: result.body.msg || 'app.comp.toast.error.contentDefault',
        title: title,
      });
    }
  });
  reqPromise.catch((error) => {
    if (config && config.url.match(/dashboard\/dag$/)) return;
    console.log(error);
    toast.error({
      content: 'app.comp.toast.error.networkErr',
      title: 'app.comp.toast.error.other',
    });
  });

  return reqPromise;
};

/* eslint react/prop-types: 0 */
function I18nComp({ id, html, param }) {
  if (html) {
    return (
      <FormattedHTMLMessage id={id}>
        {(s) => {
          return <div />;
        }}
      </FormattedHTMLMessage>
    );
  }

  if (param) {
    return (
      <FormattedHTMLMessage id={id}>
        {(s) => {
          // console.log(s)
          return template(s)(param);
        }}
      </FormattedHTMLMessage>
    );
  }

  return <FormattedMessage id={id} />;
}
const I18nComp1 = injectIntl(I18nComp);

export function i18n(id, config = {}) {
  return <I18nComp1 id={id} html={config.html} param={config.param} />;
}

export function renderAny(cb) {
  return cb();
}

export function getQuery(locationSearch) {
  let query = {};
  try {
    query = querystring.parse(locationSearch.replace(/^\?/, ''));
  } catch (e) {
    console.log(e);
  }
  return query;
}

export const humanizeNum = (a) => {
  return huNum(a);
};

export { notice };

export const getTotalPage = (count, limit) => {
  return Math.ceil(count / limit);
};

let store;
export const updateStore = (s) => {
  store = s;
};

export const getStore = () => {
  return store;
};

export function isContract(a) {
  const strip = a.replace(/^0x/, '');
  return strip[0] === '8';
}
export const devidedByDecimals = (number, decimals) => {
  const bignumber = number instanceof BigNumber ? number : new BigNumber(number);
  const result = bignumber.dividedBy(10 ** decimals);
  return result.toString(10);
};

export const getAddressType = (address) => {
  return address.startsWith('8') ? addressTypeContract : addressTypeCommon;
};
