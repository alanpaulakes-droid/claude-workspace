module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    // El plugin de Reanimated DEBE ir siempre al final.
    plugins: ['react-native-reanimated/plugin'],
  };
};
