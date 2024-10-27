// eslint-disable-next-line no-unused-vars
const { plugins } = require("./tailwind.config");

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ["nativewind/babel"],
  };
};
