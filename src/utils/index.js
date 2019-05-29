let errorId = null;
let source = null;

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

export const initSse = (tthis) => {
  source = null;
  source = new EventSource('http://localhost:3000/proxy/fetch_random_time');

  const damon = (id, that) => {
    const isValidUri = (type = 'GET', uri = '/', callback = () => {}, tthat) => {
      let xhr = getXmlHttpRequest();
      // readyState 0=>初始化 1=>载入 2=>载入完成 3=>解析 4=>完成
      // console.log(xhr.readyState);  0
      xhr.open(type, uri, true);
      // console.log(xhr.readyState);  1
      xhr.send();
      // console.log(xhr.readyState);  1
      xhr.onreadystatechange = () => {
        // console.log(xhr.status); //HTTP状态吗
        // console.log(xhr.readyState);  2 3 4
        if (xhr.readyState === 4 && xhr.status === 200) {
          // console.log(xhr.readyState, 200, '===log');
          initSse(tthat);
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
          'http://localhost:3000/proxy/ping',
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
    // console.log( result.timestamp);
    tthis.setState({ timestamp: result.timestamp });
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
      console.log('emit here ==== ');
      damon(errorId, tthis);
    },
    'false'
  );
  return source;
};

export const closeSource = () => {
  source.close();
};

export const toFixed = (num, decimal) => {
  if (isNaN(num)) {
    return 0;
  }
  let p = 1;
  for (let i = 0; i < decimal; i++) {
    p *= 10;
  }
  return Math.round(num * p) / p;
};

export const toThousands = (num) => {
  let str = num + '';
  let re = /(?=(?!(\b))(\d{3})+$)/g;
  str = str.replace(re, ',');
  return str;
};
