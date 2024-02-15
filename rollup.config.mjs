import { execSync } from 'child_process';

// Plugins
import { typescriptPaths as paths } from 'rollup-plugin-typescript-paths';
import { nodeResolve as node } from '@rollup/plugin-node-resolve';
import { swc, minify } from 'rollup-plugin-swc3';
import replace from '@rollup/plugin-replace';

const revision = (() => {
	try {
		return execSync('git rev-parse --short HEAD').toString().trim();
	} catch {
		return 'N/A';
	}
})();

const config = {
	input: 'src/index.ts',
	output: [
		{
			file: 'dist/Enmity.js',
			format: 'esm',
			inlineDynamicImports: true,
			strict: false
		}
	],

	plugins: [
		paths({ preserveExtensions: true, nonRelative: true }),
		replace({ preventAssignment: true, __VERSION__: revision }),
		node(),
		swc({ tsconfig: false }),
		minify({ compress: true, mangle: true }),
	],

	onwarn(warning, warn) {
		if (warning.code === 'EVAL') return;
		warn(warning);
	}
};

export default config;