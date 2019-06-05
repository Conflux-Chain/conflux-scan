const Hapi = require('@hapi/hapi');
const Susie = require('susie');
const superagent = require('superagent');
const Joi = require('joi');
const { SERVER_PORT, SERVER_HOST, SERVER_PREFIX, API_HOST } = process.env;

const start = async () => {
  const server = Hapi.server({
    port: SERVER_PORT || 3000,
    host: SERVER_HOST || '127.0.0.1',
    routes: { cors: true },
  });
  await server.register([{ plugin: Susie }]);

  server.route([
    // 响应接口
    {
      method: 'GET',
      path: `${SERVER_PREFIX}/ping`,
      config: {
        cors: true,
        handler: async (request, h) => {
          return h.response('pong');
        },
      },
    },
    // 获取服务器随机时间
    {
      method: 'GET',
      path: `${SERVER_PREFIX}/fetch_random_time`,
      config: {
        cors: true,
        handler: async (request, h) => {
          const { Readable } = require('stream');
          const rs = Readable();
          // console.log('start')

          rs._read = function() {
            rs.pause();
            setTimeout(() => {
              rs.resume();
              if (!request.active()) {
                // console.log('end');
                return h.close;
              }
              // 业务逻辑
              rs.push(JSON.stringify({ timestamp: new Date().getTime() }));
            }, 1000);
          };
          rs.on('data', (chunk) => {
            // console.log(chunk.toString());
          });

          return h.event(rs);
        },
        description: '获取服务器随机时间',
        tags: ['api', 'sse'],
      },
    },
    // 获取 epoch list by epochNum
    {
      method: 'GET',
      path: `${SERVER_PREFIX}/fetchEpochList`,
      config: {
        cors: true,
        handler: async (request, h) => {
          const querys = ['block/list'].map((ids) => {
            console.log(`${API_HOST}/${ids}`);
            return new Promise((resolve, reject) => {
              superagent
                .get(`${API_HOST}/${ids}`)
                .query(request.query)
                .then((callback) => {
                  const { code, result, message } = JSON.parse(callback.text);
                  if (code == 0) resolve({ [ids]: result.data, ['total_' + ids]: result.total });
                  else reject([]);
                })
                .catch((e) => {
                  reject([]);
                });
            });
          });
          const payload = await Promise.all(querys);
          return h.response({ code: 0, result: payload });
        },
        description: '初始化获取Block&Tx List',
        tags: ['api', 'sse'],
        validate: {
          query: Joi.object().keys({
            pageNum: Joi.string().required(),
            pageSize: Joi.string().required(),
            epochNum: Joi.string().required(),
          }),
        },
      },
    },
    // 获取 block list & tx list 初始化数据
    {
      method: 'GET',
      path: `${SERVER_PREFIX}/fetchInitBlockandTxList`,
      config: {
        cors: true,
        handler: async (request, h) => {
          const querys = ['block/list', 'transaction/list'].map((ids) => {
            return new Promise((resolve, reject) => {
              superagent
                .get(`${API_HOST}/${ids}`)
                .query(request.query)
                .then((callback) => {
                  const { code, result, message } = JSON.parse(callback.text);
                  if (code == 0) resolve({ [ids]: result.data, ['total_' + ids]: result.total });
                  else reject([]);
                })
                .catch((e) => {
                  reject([]);
                });
            });
          });
          const payload = await Promise.all(querys);
          return h.response({ code: 0, result: payload });
        },
        description: '初始化获取Block&Tx List',
        tags: ['api', 'sse'],
        validate: {
          query: Joi.object().keys({
            pageNum: Joi.string().required(),
            pageSize: Joi.string().required(),
          }),
        },
      },
    },
    // 获取block list & tx list
    {
      method: 'GET',
      path: `${SERVER_PREFIX}/fetchBlockandTxList`,
      config: {
        cors: true,
        handler: async (request, h) => {
          const { Readable } = require('stream');
          const rs = Readable();
          const querys = ['block/list', 'transaction/list'].map((ids) => {
            return new Promise((resolve, reject) => {
              superagent
                .get(`${API_HOST}/${ids}`)
                .query(request.query)
                .then((callback) => {
                  const { code, result, message } = JSON.parse(callback.text);
                  if (code == 0) resolve({ [ids]: result.data });
                  else reject([]);
                })
                .catch((e) => {
                  reject([]);
                });
            });
          });
          console.log('start');

          rs._read = function() {
            rs.pause();
            setTimeout(async () => {
              rs.resume();
              if (!request.active()) {
                console.log('end');
                return h.close;
              }
              // 业务逻辑
              const payload = await Promise.all(querys);
              rs.push(JSON.stringify(payload));
            }, 5000);
          };
          rs.on('data', (chunk) => {});

          return h.event(rs);
        },
        description: '轮询获取Block&Tx List',
        tags: ['api', 'sse'],
        validate: {
          query: Joi.object().keys({
            pageNum: Joi.string().required(),
            pageSize: Joi.string().required(),
          }),
        },
      },
    },
    // 获取 tx detail
    {
      method: 'GET',
      path: `${SERVER_PREFIX}/fetchTxDetail`,
      config: {
        cors: true,
        handler: async (request, h) => {
          const querys = [`transaction/${request.query.transactionHash}`].map((ids) => {
            return new Promise((resolve, reject) => {
              superagent
                .get(`${API_HOST}/${ids}`)
                .then((callback) => {
                  const { code, result, message } = JSON.parse(callback.text);
                  console.log(result, message);
                  if (code == 0) resolve(result.data);
                  else reject({});
                })
                .catch((e) => {
                  console.log(e.toString());
                  reject({});
                });
            });
          });
          const payload = await Promise.all(querys);
          return h.response({ code: 0, result: payload[0] });
        },
        description: '获取 tx detail',
        tags: ['api'],
        validate: {
          query: Joi.object().keys({
            transactionHash: Joi.string().required(),
          }),
        },
      },
    },
    // 获取 hash的类型
    {
      method: 'GET',
      path: `${SERVER_PREFIX}/fetchHashType/{hash}`,
      config: {
        cors: true,
        handler: async (request, h) => {
          const querys = [`util/type/${request.params.hash}`].map((ids) => {
            return new Promise((resolve, reject) => {
              console.log(`${API_HOST}/${ids}`);
              superagent
                .get(`${API_HOST}/${ids}`)
                .then((callback) => {
                  const { code, result, message } = JSON.parse(callback.text);
                  if (code == 0) resolve({ code, result: result.data, message });
                  else if (code == 1) resolve({ code, message });
                  else reject({});
                })
                .catch((e) => {
                  console.log(e.toString());
                  reject({});
                });
            });
          });
          const payload = await Promise.all(querys);
          return h.response(payload[0]);
        },
        description: '获取 tx detail',
        tags: ['api'],
        validate: {
          params: Joi.object().keys({
            hash: Joi.string().required(),
          }),
        },
      },
    },
    // 获取 block detail
    {
      method: 'GET',
      path: `${SERVER_PREFIX}/fetchBlockDetail/{blockHash}`,
      config: {
        cors: true,
        handler: async (request, h) => {
          const querys = [`block/${request.params.blockHash}`, `block/${request.params.blockHash}/transactionList`].map((ids) => {
            return new Promise((resolve, reject) => {
              console.log(`${API_HOST}/${ids}`);
              superagent
                .get(`${API_HOST}/${ids}`)
                .query(request.query)
                .then((callback) => {
                  const { code, result, message } = JSON.parse(callback.text);
                  if (code == 0) resolve({ [ids]: result.data, ['total_' + ids]: result.total });
                  else reject({});
                })
                .catch((e) => {
                  console.log(e.toString());
                  reject({});
                });
            });
          });
          const payload = await Promise.all(querys);
          return h.response({ code: 0, result: payload });
        },
        description: '获取 Block detail',
        tags: ['api'],
        validate: {
          query: Joi.object().keys({
            pageNum: Joi.string().required(),
            pageSize: Joi.string().required(),
          }),
          params: Joi.object().keys({
            blockHash: Joi.string().required(),
          }),
        },
      },
    },
    // 获取 account detail
    {
      method: 'GET',
      path: `${SERVER_PREFIX}/fetchAccountDetail/{address}`,
      config: {
        cors: true,
        handler: async (request, h) => {
          const querys = [`account/${request.params.address}`, `account/${request.params.address}/transactionList`].map((ids) => {
            return new Promise((resolve, reject) => {
              console.log(`${API_HOST}/${ids}`);
              superagent
                .get(`${API_HOST}/${ids}`)
                .query(request.query)
                .then((callback) => {
                  const { code, result, message } = JSON.parse(callback.text);
                  if (code == 0) resolve({ [ids]: result.data, ['total_' + ids]: result.total });
                  else reject({});
                })
                .catch((e) => {
                  console.log(e.toString());
                  reject({});
                });
            });
          });
          const payload = await Promise.all(querys);
          return h.response({ code: 0, result: payload });
        },
        description: '获取 account detail',
        tags: ['api'],
        validate: {
          query: Joi.object().keys({
            pageNum: Joi.string().required(),
            pageSize: Joi.string().required(),
            startTime: Joi.string(),
            endTime: Joi.string(),
            txnType: Joi.string(),
          }),
          params: Joi.object().keys({
            address: Joi.string().required(),
          }),
        },
      },
    },
    // 获取 MinedBlockList
    {
      method: 'GET',
      path: `${SERVER_PREFIX}/fetchMinedBlockList/{blockHash}`,
      config: {
        cors: true,
        handler: async (request, h) => {
          const querys = [`account/${request.params.blockHash}/minedBlockList`].map((ids) => {
            return new Promise((resolve, reject) => {
              console.log(`${API_HOST}/${ids}`);
              superagent
                .get(`${API_HOST}/${ids}`)
                .query(request.query)
                .then((callback) => {
                  const { code, result, message } = JSON.parse(callback.text);
                  if (code == 0) resolve({ [ids]: result.data });
                  else reject({});
                })
                .catch((e) => {
                  console.log(e.toString());
                  reject({});
                });
            });
          });
          const payload = await Promise.all(querys);
          return h.response({ code: 0, result: payload });
        },
        description: '获取 MinedBlockList',
        tags: ['api'],
        validate: {
          query: Joi.object().keys({
            pageNum: Joi.string().required(),
            pageSize: Joi.string().required(),
          }),
          params: Joi.object().keys({
            blockHash: Joi.string().required(),
          }),
        },
      },
    },
    // 获取 RefereeBlockList
    {
      method: 'GET',
      path: `${SERVER_PREFIX}/fetchRefereeBlockList/{blockHash}`,
      config: {
        cors: true,
        handler: async (request, h) => {
          const querys = [`block/${request.params.blockHash}/refereeBlockList`].map((ids) => {
            return new Promise((resolve, reject) => {
              console.log(`${API_HOST}/${ids}`);
              superagent
                .get(`${API_HOST}/${ids}`)
                .query(request.query)
                .then((callback) => {
                  const { code, result, message } = JSON.parse(callback.text);
                  if (code == 0) resolve({ [ids]: result.data });
                  else reject({});
                })
                .catch((e) => {
                  console.log(e.toString());
                  reject({});
                });
            });
          });
          const payload = await Promise.all(querys);
          return h.response({ code: 0, result: payload });
        },
        description: '获取 RefereeBlockList',
        tags: ['api'],
        validate: {
          query: Joi.object().keys({
            pageNum: Joi.string().required(),
            pageSize: Joi.string().required(),
          }),
          params: Joi.object().keys({
            blockHash: Joi.string().required(),
          }),
        },
      },
    },
  ]);

  await server.start();
  console.log(`Listening on //${SERVER_HOST}:${SERVER_PORT}`);
};

start();
