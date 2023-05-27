const Hapi = require('@hapi/hapi');
const HapiMongodb = require('hapi-mongodb');
const routes = require('./routes');

const init = async () => {
  const dbOpts = {
    url: 'mongodb://localhost:27017/db_good_talk',
    decorate: true,
  };

  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
  });

  await server.register({
    plugin: HapiMongodb,
    settings: {
      useUnifiedTopology: true,
    },
    options: dbOpts,
  });

  server.route(routes);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
