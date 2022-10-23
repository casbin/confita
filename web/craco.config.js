const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { "@primary-color": "#7f5de3", "@border-radius-base": "5px" },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
