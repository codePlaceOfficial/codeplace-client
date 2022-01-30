const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = function override(config, env) {
  config.plugins.push(new MonacoWebpackPlugin({
    languages: ["json", "javascript", "typescript","java","go","php","python","cpp","html","css","scss","less","xml","yaml","rust","r","csharp"],
  }));
  return config;
}