import express from "express";
import React from "react";
const app = express();
import ReactDOMServer from "react-dom/server";
import getScript from "./util/getFrontEndScript.js";
import getPageTemplate from "./util/getPageTemplate.js";
import serialize from "serialize-javascript";
import getFilesRecursive from "./util/getFilesRecursive.js";
import { readFileSync, writeFileSync } from "fs";
import { build } from "esbuild";
import transpileJSX from "./util/transpileJSX.js";

(async () => {

  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => console.log(`Listening to Port: ${PORT}`));
  await transpileJSX();

  let routes = [];
  getFilesRecursive("_pages", routes);

  for (let route of routes) {
    route = route.replace("\\", "/");
    const src = getScript(route);
    writeFileSync("sourceScript.jsx", src);
    await build({
      entryPoints: ["sourceScript.jsx"],
      bundle: true,
      loader: {
        ".js": "jsx",
        ".jsx": "jsx",
        ".tsx": "tsx",
      },
      format: "esm",
      jsx: "transform",
      outfile: "transpiledScript.js",
      minify: true,
    });
    const minifiedBundledScript = readFileSync("transpiledScript.js").toString();
    const { default: Component, getProps } = await import(`./${route}`);
    const props = await getProps();
    const markup = ReactDOMServer.renderToString(React.createElement(Component, props));
    const html = getPageTemplate(markup, "Doc", minifiedBundledScript, serialize({}));
    const url = ((route.split("_pages")[1]).split(".js")[0]).replace("index", "");
    app.get(url, (req, res) => res.send(html));
  }

})();
