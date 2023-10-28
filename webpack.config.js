module.exports = function (options) {
  return {
    ...options,
    target: 'node',
    devtool: 'source-map',
  };
};
