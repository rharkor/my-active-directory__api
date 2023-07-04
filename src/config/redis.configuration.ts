export default () => ({
  redis_host: process.env.REDIS_HOST || 'localhost',
  redis_port: process.env.REDIS_PORT
    ? parseInt(process.env.REDIS_PORT, 10)
    : 6379,
  redis_pass: process.env.REDIS_PASS,
});
