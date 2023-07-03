const path = require("path");
const { whenDev } = require("@craco/craco");

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // 修改输出目录
      paths.appBuild = path.resolve(__dirname, "build");

      // 配置别名
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        "@": path.resolve(__dirname, "src"),
      };

      // 配置polyfill
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        crypto: require.resolve("crypto-browserify"),
        https: require.resolve("https-browserify"),
        http: require.resolve("stream-http"),
        os: require.resolve("os-browserify/browser"),
        path: require.resolve("path-browserify"),
        stream: require.resolve("stream-browserify"),
        url: require.resolve("url/"),
      };

      return webpackConfig;
    },
  },
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          const oneOfRule = webpackConfig.module.rules.find((rule) =>
            Array.isArray(rule.oneOf)
          );

          if (oneOfRule) {
            const sourceMapLoaderRuleIndex = oneOfRule.oneOf.findIndex((rule) =>
              rule.use && rule.use.some((use) => use.loader === "source-map-loader")
            );

            if (sourceMapLoaderRuleIndex >= 0) {
              const sourceMapLoaderRule = oneOfRule.oneOf[sourceMapLoaderRuleIndex];
              sourceMapLoaderRule.exclude = [
                ...sourceMapLoaderRule.exclude,
                /node_modules\/xhr2-cookies/,
              ];
            }
          }

          return webpackConfig;
        },
      },
    },
  ],
};
