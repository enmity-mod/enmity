import { defineConfig, Plugin, RenderedChunk } from "rollup";
import replace from '@rollup/plugin-replace';
import esbuild from "rollup-plugin-esbuild";
import crypto from "crypto";
import fs from "fs";
import { execSync } from "child_process";
import { nodeResolve } from "@rollup/plugin-node-resolve";

const revision = execSync('git rev-parse --short HEAD').toString().trim();

export default defineConfig({
  input: "src/index.ts",
  output: [
    { file: "dist/Enmity.js", format: "esm", strict: false },
  ],
  plugins: [
    esbuild({
      target: "esnext",
      minify: true,
    }),
    nodeResolve(),
    replace({
      preventAssignment: true,
      '__VERSION__': revision
    }),
    createHash()
  ]
});

function createHash(options = {}): Plugin {
  return {
    name: 'plugin-info',
    writeBundle(err) {
      const buffer = fs.readFileSync('dist/Enmity.js');
      const hash = crypto.createHash('sha256');
      hash.update(buffer);

      const hex = hash.digest('hex');

      fs.writeFileSync('dist/hash', hex);
    }
  };
};