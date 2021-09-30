const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': 'rgb(47,101,166)', '@primary-1': 'rgb(230,247,255)' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
