import commonjs from 'rollup-plugin-commonjs';
import node from 'rollup-plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';
import replace from 'rollup-plugin-replace';

function onwarn(message) {
  const suppressed = ['UNRESOLVED_IMPORT', 'THIS_IS_UNDEFINED'];

  if (!suppressed.find(code => message.code === code)) {
    return console.warn(message.message);
  }
}

export default [
  // for browser
  {
    input: 'lib/browser.js',
    output: {
      file: 'lib/nerv-apollo.browser.umd.js',
      format: 'umd',
      name: 'nerv-apollo',
      sourcemap: true,
      exports: 'named',
    },
    alias:{
      "react": "nervjs",
      "react-dom": "nervjs",
      // 除非你想使用 `createClass`，否则这一条配置是没有必要的
      "create-react-class": "nerv-create-class"
    },
    onwarn,
  },
  // for server
  {
    input: 'lib/index.js',
    output: {
      file: 'lib/nerv-apollo.umd.js',
      format: 'umd',
      name: 'nerv-apollo',
      sourcemap: false,
      exports: 'named',
    },
    alias:{
      "react": "nervjs",
      "react-dom": "nervjs",
      // 除非你想使用 `createClass`，否则这一条配置是没有必要的
      "create-react-class": "nerv-create-class"
    },
    onwarn,
  },
  // for test-utils
  {
    input: 'lib/test-utils.js',
    output: {
      file: 'lib/test-utils.js',
      format: 'umd',
      name: 'react-apollo',
      sourcemap: false,
      exports: 'named',
    },
    onwarn,
  },
  // for filesize
  {
    input: 'lib/react-apollo.browser.umd.js',
    output: {
      file: 'dist/bundlesize.js',
      format: 'cjs',
      exports: 'named',
    },
    plugins: [
      node(),
      commonjs({
        ignore: [
          'react',
          'react-dom/server',
          'apollo-client',
          'graphql',
          'graphql-tag',
        ],
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      uglify(),
    ],
    onwarn,
  },
];
