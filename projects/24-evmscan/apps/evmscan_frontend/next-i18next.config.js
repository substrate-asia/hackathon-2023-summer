const path = require('path');
module.exports = {
  i18n: {
    defaultLocale: 'en-US',
    locales: ['en-US', 'zh-CN'],
  },
  localePath: path.resolve(__dirname, 'public', 'locales'),
};
