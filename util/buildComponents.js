import { build } from "esbuild";
import getFilesRecursive from "./getFilesRecursive.js";
getFilesRecursive;

const componentPaths = [];
getFilesRecursive("components", componentPaths);

build({
  entryPoints: componentPaths,
  loader: {
    ".js": "jsx",
    ".jsx": "jsx",
    ".tsx": "tsx",
  },
  format: "esm",
  jsx: "transform",
  outdir: "_components",
});