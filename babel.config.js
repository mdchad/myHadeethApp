module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['nativewind/babel'],
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true
        }
      ],
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          alias: {
            '@components': './app/components',
            '@pages': './app/pages',
            '@assets': './assets',
            '@lib': './lib',
            '@context': './context',
            '@data': './data'
          }
        }
      ]
    ]
  }
}
