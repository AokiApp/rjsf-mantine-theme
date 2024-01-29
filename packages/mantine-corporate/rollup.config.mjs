import resolve from '@rollup/plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';
import commonjs from '@rollup/plugin-commonjs';
import banner from 'rollup-plugin-banner2';
import path from 'path';

const getPath = (storyPath) => path.resolve(process.cwd(), storyPath).replace(/\\/g, '/');

const ROLLUP_EXCLUDE_USE_CLIENT = ['index'];

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
    commonjs(),
    esbuild({
      sourceMap: false,
      tsconfig: getPath('tsconfig.json'),
    }),
    postcss({
      extract: true,
      minimize: true,
    }),
    banner((chunk) => {
      if (!ROLLUP_EXCLUDE_USE_CLIENT.includes(chunk.fileName)) {
        return "'use client';\n";
      }

      return undefined;
    }),
  ],
};
