module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    ['import', {
      'libraryName': 'lodash',
      'libraryDirectory': '',
      'camel2DashComponentName': false,
    }, 'lodash'],
    ['import', {
      libraryName: 'plain-kit',
      libraryDirectory: 'lib',
      style: false,
      camel2DashComponentName: false
    }, 'plain-kit']
  ]
}
