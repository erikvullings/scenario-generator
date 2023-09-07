const path = require('path');
const devMode = process.env.NODE_ENV === 'development';
const outputPath = path.resolve(__dirname, devMode ? 'dist' : './docs');

console.log(`Working in ${devMode ? 'development' : 'production'} mode.`);

module.exports = {
  mode: devMode ? 'development' : 'production',
  entry: {
    main: './src/app.ts',
  },
  devServer: {
    port: 8339,
  },
  builtins: {
    define: {
      'process.env.NODE_ENV': "'development'",
    },
    html: [
      {
        title: 'Scenario Generator',
        publicPath: devMode
          ? undefined
          : 'https://erikvullings.github.io/scenario-generator',
        scriptLoading: 'defer',
        minify: !devMode,
        favicon: './src/favicon.ico',
        meta: {
          viewport: 'width=device-width, initial-scale=1',
          'og:title': 'Scenario Generator',
          'og:description':
            "Specify your organization's capabilities, assess, and develop them.",
          'og:url': 'https://erikvullings.github.io/scenario-generator/',
          'og:site_name': 'Scenario Generator',
          'og:image:alt': 'Scenario Generator',
          'og:image': './src/assets/logo.svg',
          'og:image:type': 'image/svg',
          'og:image:width': '200',
          'og:image:height': '200',
        },
      },
    ],
    minifyOptions: devMode
      ? undefined
      : {
          passes: 3,
          dropConsole: false,
        },
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /^BUILD_ID$/,
        type: 'asset/source',
      },
    ],
  },
  output: {
    filename: 'main.js',
    path: outputPath,
  },
};
