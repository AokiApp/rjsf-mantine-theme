import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';
import path from 'path';

const getPath = (storyPath) => path.resolve(process.cwd(), storyPath).replace(/\\/g, '/');

export default {
  input: 'src/index.ts', // Adjust this to your entry point
  output: [
    {
      entryFileNames: '[name].cjs',
      dir: 'dist',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
      preserveModules: true,
    },
    {
      entryFileNames: '[name].mjs',
      format: 'esm',
      dir: 'lib',
      sourcemap: true,
      exports: 'named',
      preserveModules: true,
    },
  ],
  plugins: [
    esbuild({
      sourceMap: false,
      tsconfig: getPath('tsconfig.json'),
    }),
    postcss({
      modules: true,
      extract: 'styles.css',
    }),
  ],
};
