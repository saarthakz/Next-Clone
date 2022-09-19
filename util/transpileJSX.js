import { build } from "esbuild";
import getFilesRecursive from "./getFilesRecursive.js";
getFilesRecursive;

async function transpileJSX() {
  const routes = [];
  const components = [];
  getFilesRecursive("pages", routes);
  getFilesRecursive("components", components);

  await build({
    entryPoints: components,
    bundle: false,
    loader: {
      '.jsx': "jsx",
      '.js': "jsx",
    },
    format: "esm",
    jsx: "transform",
    outdir: "_components"
  });

  await build({
    entryPoints: routes,
    bundle: false,
    loader: {
      '.jsx': "jsx",
      '.js': "jsx",
    },
    format: "esm",
    jsx: "transform",
    outdir: "_pages"
  });

};

export default transpileJSX;
