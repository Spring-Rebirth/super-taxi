const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
    const config = getDefaultConfig(__dirname);

    // 添加 Sentry 支持
    config.resolver.extraNodeModules = {
        ...config.resolver.extraNodeModules,
        '@sentry/react-native': require.resolve('@sentry/react-native'),
    };

    return config;
})();
