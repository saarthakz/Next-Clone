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
import { dirname } from "path";
import { commonjs } from "@hyrious/esbuild-plugin-commonjs";

await transpile();
let routes = [];
let buildRoutes = [];
let buildFunctions = [];
const buildRouteRoot = "routes/";
getFilesRecursive("build/pages", routes);

try { await mkdir("build/functions"); } catch (error) { };
try { await mkdir("routes"); } catch (error) { };

for (let route of routes) {
  route = route.replaceAll("\\", "/");
  const { default: Component, functionType } = await import(`./${route}`);

  const src = getScript(route);
  route = route.split("pages/")[1];
  buildRoutes.push(buildRouteRoot + route);
  try { await mkdir(dirname(buildRouteRoot + route), { recursive: true }); } catch (error) { }
  writeFileSync(buildRouteRoot + route, src);

  if (functionType == "static") {
    const { default: getProps } = await import(`./props/${route}`);
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

  };

  if (functionType == "server-rendered") {
    const functionTemplate = makeFunction(route);
    buildFunctions.push(`build/functions/${route}`);
    try { await mkdir(dirname(`build/functions/${route}`), { recursive: true }); } catch (error) { }
    writeFileSync(`build/functions/${route}`, functionTemplate);
  };
};

// building functions
try {
  await build({
    entryPoints: buildFunctions,
    bundle: true,
    loader: {
      ".js": "jsx",
      ".jsx": "jsx",
      ".tsx": "tsx",
    },
    platform: "node",
    format: "esm",
    jsx: "transform",
    outdir: `functions`,
    plugins: [commonjs()],
    // minify: true, //For production
    minify: false, //For development
  });

} catch (err) {
  console.log(err);
};

//building front end javascript
try {
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
    // minify: true, //For production
    minify: false, //For development
    splitting: true
  });
} catch (err) {
  console.log(err);
};

//File removal
await rm("routes", {
  recursive: true,
  force: true
});

await rm("build", {
  recursive: true,
  force: true
});
