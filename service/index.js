const Hapi = require('@hapi/hapi');
const Susie = require('susie');
const { SERVER_PORT, SERVER_HOST, SERVER_PREFIX } = process.env;

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
  ]);

  await server.start();
  console.log(`Listening on //${SERVER_HOST}:${SERVER_PORT}`);
};

start();
