const { setConfig } = require('next/config');
const nextConfig = require('./next.config');

setConfig(nextConfig);
require('./server');
