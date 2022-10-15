import { createElement } from "react";
import { renderToString } from "react-dom/server";
import getScript from "./util/getScript.js";
import getPage from "./util/getPage.js";
import serialize from "serialize-javascript";
import getFilesRecursive from "./util/getFilesRecursive.js";
import { writeFileSync } from "fs";
import { mkdir, rm } from "fs/promises";
import { build } from "esbuild";
import transpile from "./util/transpile.js";
import makeFunction from "./util/makeFunction.js";

await transpile();
let routes = [];
let buildRoutes = [];
let buildFunctions = [];
const buildRouteRoot = "routes/";
getFilesRecursive("build/pages", routes);

try { await mkdir("build/functions"); } catch (error) { };
try { await mkdir("routes"); } catch (error) { };
try {
  await rm("public/javascript", {
    recursive: true,
    force: true
  });
} catch (error) { };

for (let route of routes) {
  route = route.replaceAll("\\", "/");
  const { default: Component, getProps, functionType } = await import(`./${route}`);

  const src = getScript(route);
  route = route.split("pages/")[1];
  buildRoutes.push(buildRouteRoot + route);
  writeFileSync(buildRouteRoot + route, src);

  if (functionType == "static") {
    const props = await getProps();
    const markup = renderToString(createElement(Component, { ...props }));

    const html = getPage(
      markup, //HTML Markup
      "Doc", //Page Title
      `/__assets__/javascript/${route}`, //Path to Script
      serialize(props) //Props
    );

    const staticHTMLRoute = route.split(".js")[0] + ".html";

    writeFileSync(`public/${staticHTMLRoute}`, html);

    const url = route
      .split(".js")[0]
      .replace("index", "/");

  };

  if (functionType == "server-rendered") {
    const functionTemplate = makeFunction(route);
    writeFileSync(`build/functions/${route}`, functionTemplate);
    buildFunctions.push(`build/functions/${route}`);
  };
};

await build({
  entryPoints: buildFunctions,
  bundle: true,
  loader: {
    ".js": "jsx",
    ".jsx": "jsx",
    ".tsx": "tsx",
  },
  platform: "node",
  format: "cjs",
  jsx: "transform",
  outdir: `functions`,
  outExtension: {
    ".js": ".cjs"
  },
  minify: true, //For production
  // minify: false, //For development
});

await build({
  entryPoints: buildRoutes,
  bundle: true,
  loader: {
    ".js": "jsx",
    ".jsx": "jsx",
    ".tsx": "tsx",
  },
  format: "esm",
  jsx: "transform",
  outdir: `public/__assets__/javascript`,
  minify: true, //For production
  // minify: false, //For development
  splitting: true
});

await rm("routes", {
  recursive: true,
  force: true
});

await rm("build/functions", {
  recursive: true,
  force: true
});

