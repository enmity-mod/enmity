import { defineConfig, Plugin, RenderedChunk } from "rollup";
import replace from '@rollup/plugin-replace';
import esbuild from "rollup-plugin-esbuild";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { execSync } from "child_process";

const revision = execSync('git rev-parse --short HEAD').toString().trim()

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
    })
  ]
});