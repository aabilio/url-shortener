require('babel-register')({
  babelrc: false,
  presets: [
    [
      'env',
      {
        targets: {
          node: '8',
        },
      },
    ],
  ],
})

module.exports = require('./server').default
