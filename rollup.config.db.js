import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import copy from "rollup-plugin-copy";

export default [
  {
    input: "./dist/db/migrate-seed.js",
    plugins: [
      copy({
        targets: [
          { src: "db/migrations/**/*", dest: "dist/migrate-seed/migrations" },
        ],
      }),
      json(),
      commonjs(),
      nodeResolve(),
    ],
    output: {
      sourcemap: "inline",
      file: "./dist/migrate-seed/bundle.cjs",
      format: "cjs",
    },
  },
];
