import fs from 'node:fs'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	plugins: [tailwindcss(), reactRouter(), tsconfigPaths({ root: './' })],
	ssr: {
		noExternal: [
			'@adobe/react-spectrum',
			'@react-spectrum/*',
			'@spectrum-icons/*',
		].flatMap(spec => fs.globSync(spec, { cwd: 'node_modules' })),
	},
	// https://github.com/adobe/react-spectrum/discussions/8189#discussioncomment-13059244
	define: {
		'process.env': {},
	},
	test: {
		environment: 'happy-dom',
		setupFiles: ['./setupTests.ts'],
		include: ['app/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
	},
})
