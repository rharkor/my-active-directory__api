// eslint-disable-next-line @typescript-eslint/no-var-requires
const pj = require('../../package.json');

export default () => ({
  app_port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3001,
  app_version: pj.version,
});
