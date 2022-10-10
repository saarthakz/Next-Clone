import React from "react";
import ReactDOMServer from "react-dom/server";
import getScript from "./util/getScript.js";
import getPage from "./util/getPage.js";
import serialize from "serialize-javascript";
import getFilesRecursive from "./util/getFilesRecursive.js";
import fs from "fs";
import fsPromises from "fs/promises";
import { build } from "esbuild";
import transpile from "./util/transpile.js";
import makeFunction from "./util/makeFunction.js";

await transpile();
let routes = [];
getFilesRecursive("build/pages", routes);

try {
  await fsPromises.mkdir("functions");

} catch (error) {
};

for (let route of routes) {
  const file = fs.readFileSync(route).toString();
  fs.writeFileSync(route, file);
  route = route.replaceAll("\\", "/");
  const { default: Component, getProps, functionType } = await import(`./${route}`);

  if (functionType == "static") {

    const src = getScript(route);
    route = route.split("pages/")[1];

    fs.writeFileSync("script.js", src);

    await build({
      entryPoints: ["script.js"],
      bundle: true,
      loader: {
        ".js": "jsx",
        ".jsx": "jsx",
        ".tsx": "tsx",
      },
      format: "esm",
      jsx: "transform",
      outfile: `public/static/${route}`,
      minify: true,
    });

    const props = await getProps();

    const markup = ReactDOMServer.renderToString(
      React.createElement(Component, { ...props })
    );

    const html = getPage(
      markup, //HTML Markup
      "Doc", //Page Title
      `static/${route}`, //Path to Script
      serialize(props) //Props
    );

    const staticHTMLRoute = route.split(".js")[0] + ".html";

    // console.log(staticHTMLRoute);
    fs.writeFileSync(`public/static/${staticHTMLRoute}`, html);

    const url = route
      .split(".js")[0]
      .replace("index", "/");

  };

  if (functionType == "server-rendered") {

    const functionTemplate = makeFunction(route);
    route = route.split("pages/")[1];
    fs.writeFileSync(`functions/${route}`, functionTemplate);
  };
};