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
    // 获取block list & tx list
    {
      method: 'GET',
      path: `${SERVER_PREFIX}/fetchBlockandTxList`,
      config: {
        cors: true,
        handler: async (request, h) => {
          const { Readable } = require('stream');
          const rs = Readable();
          function getData() {
            const querys = ['block/list', 'transaction/list'].map((ids) => {
              return new Promise((resolve, reject) => {
                superagent
                  .get(`${API_HOST}/${ids}`)
                  .query(request.query)
                  .then((callback) => {
                    const { code, result, message } = JSON.parse(callback.text);
                    if (code == 0) resolve({ [ids]: result.data });
                    else resolve({ [ids]: [], code, message });
                  })
                  .catch((e) => {
                    reject([]);
                  });
              });
            });
            return querys;
          }
          console.log('start');

          rs._read = function() {
            rs.pause();
            setTimeout(async () => {
              rs.resume();
              if (!request.active()) {
                console.log('end');
                rs.destroy();
                return h.close;
              }
              // 业务逻辑
              const payload = await Promise.all(getData());
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
    // 获取 hash的类型
  ]);

  await server.start();
  console.log(`Listening on //${SERVER_HOST}:${SERVER_PORT}`);
};

start();
