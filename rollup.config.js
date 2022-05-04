import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { defineConfig } from 'rollup';
import { createHash } from 'crypto';

// Rollup Plugins
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import esbuild from 'rollup-plugin-esbuild';

const revision = execSync('git rev-parse --short HEAD').toString().trim();

export default defineConfig({
  input: 'src/index.ts',
  treeshake: true,
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
    nodeResolve(),
    esbuild({
      target: 'esnext',
      minify: true
    }),
    replace({
      preventAssignment: true,
      '__VERSION__': revision
    }),
    getHash()
  ],
  onwarn(warning, warn) {
    // suppress eval warnings
    if (warning.code === 'EVAL') return;
    warn(warning);
  }
});

function getHash() {
  return {
    name: 'plugin-info',
    writeBundle() {
      const buffer = readFileSync('dist/Enmity.js');
      const hash = createHash('sha256');
      hash.update(buffer);

      const hex = hash.digest('hex');

      writeFileSync('dist/hash', hex);
    }
  };
};