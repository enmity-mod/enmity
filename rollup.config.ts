import { defineConfig, Plugin, RenderedChunk } from "rollup";
import esbuild from "rollup-plugin-esbuild";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { execSync } from "child_process";

export default defineConfig({
  input: "src/index.ts",
  output: [
    { file: "dist/Enmity.js", format: "cjs", strict: false },
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    esbuild({ target: "es2019", minify: true }),
    commitInjector({}),
  ]
});

function commitInjector(config: {}): Plugin {
  return {
    name: "commit-injector",
    renderChunk(code: string, chunk: RenderedChunk) {
      const revision = execSync('git rev-parse --short HEAD').toString().trim()
      code = code.replace("ENMITY_VERSION_DO_NOT_CHANGE_THIS_STRING_OR_I_WILL_DESTROY_YOU", revision);

      return {
        code
      };
    }
  }
}