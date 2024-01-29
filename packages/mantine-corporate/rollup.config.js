import resolve from '@rollup/plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';
import path from 'path';

const getPath = (storyPath) => path.resolve(process.cwd(), storyPath).replace(/\\/g, '/');

export default {
  input: 'src/index.ts', // Adjust this to your entry point
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'lib/index.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/mantine.umd.js',
      name: '@aokiapp/rjsf-mantine-theme', // UMD name
      format: 'umd',
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    esbuild({
      sourceMap: false,
      tsconfig: getPath('tsconfig.json'),
    }),
    postcss({
      extract: true,
      minimize: true,
    }),
  ],
};
