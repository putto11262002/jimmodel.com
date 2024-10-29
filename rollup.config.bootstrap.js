import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";

/**
 * @type {import('rollup').RollupOptions}
 */
const rollupConfig = [
  {
    input: "scripts/bootstrap.ts", // Entry point of your TypeScript file
    output: {
      dir: "dist",
      format: "esm", // CommonJS output format
      sourcemap: true, // Enable sourcemaps
    },
    external: ["sharp"],
    plugins: [
      typescript(),
      json(), // Parse JSON files
      resolve(), // Resolve modules from node_modules
      commonjs({}), // Convert CommonJS modules to ES6
    ],
  },
];

export default rollupConfig;
