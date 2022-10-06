import { execSync } from 'child_process';
import { defineConfig } from 'rollup';

// Rollup Plugins
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { swc } from 'rollup-plugin-swc3';

const revision = execSync('git rev-parse --short HEAD').toString().trim();

export default defineConfig({
  input: 'src/index.ts',
  treeshake: true,
  inlineDynamicImports: true,
  output: [
    {
      file: 'dist/Enmity.js',
      format: 'esm',
      strict: false
    }
  ],
  plugins: [
    typescriptPaths({
      preserveExtensions: true
    }),
    nodeResolve({
      jsnext: true
    }),
    swc({
      minify: true,
      jsc: {
        externalHelpers: false,
        minify: {
          compress: true,
          mangle: true
        },
        parser: {
          syntax: 'typescript',
          dynamicImport: true,
          tsx: true,
        },
        target: 'es2022',
        transform: {
          react: {
            useBuiltins: true
          }
        },
        baseUrl: './src/',
        paths: {
          '@metro/*': [
            'modules/metro/index',
            'modules/metro/*'
          ],
          '@data/*': [
            'data/*'
          ],
          '@utilities/*': [
            'modules/utilities/*'
          ],
          '@patcher/*': [
            'modules/patcher/index',
            'modules/patcher/*'
          ],
          '@api/*': [
            'api/index',
            'api/*'
          ],
          '@api/settings/*': [
            'api/settings/index'
          ],
          '@components/*': [
            'components/index',
            'components/*'
          ],
          '@managers/*': [
            'managers/*'
          ],
          '@screens/*': [
            'core/screens/*'
          ],
          '@modules/*': [
            'modules/*'
          ],
          'react/*': [
            'modules/metro/react',
          ],
          '@core/*': [
            'core/*'
          ]
        }
      }
    }),
    replace({
      preventAssignment: true,
      '__VERSION__': revision
    })
  ],
  onwarn(warning, warn) {
    // suppress eval warnings
    if (warning.code === 'EVAL') return;
    warn(warning);
  }
});