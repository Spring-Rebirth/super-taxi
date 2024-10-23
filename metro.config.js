// metro.config.js

const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

const config = getDefaultConfig(__dirname);

const isClient = process.env.EXPO_ROUTER_APP_ROOT;

if (isClient) {
    // 在客户端打包时，排除 `(api)` 目录
    config.resolver.blockList = exclusionList([
        /\/app\/\(api\)\/.*/,
    ]);
}

module.exports = config;
