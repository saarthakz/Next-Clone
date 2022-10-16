import { build } from "esbuild";
import getFilesRecursive from "./getFilesRecursive.js";
getFilesRecursive;

export default async function transpile() {
  const routes = [];
  const components = [];
  getFilesRecursive("pages", routes);
  getFilesRecursive("components", components);

  await build({
    entryPoints: routes,
    bundle: false,
    loader: {
      '.jsx': "jsx",
      '.js': "jsx",
    },
    format: "esm",
    jsx: "transform",
    outdir: "build/pages"
  });

  await build({
    entryPoints: components,
    bundle: false,
    loader: {
      '.jsx': "jsx",
      '.js': "jsx",
    },
    format: "esm",
    jsx: "transform",
    outdir: "build/components"
  });

};
