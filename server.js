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
import transpile from "./util/transpile.js";
import fs from 'node:fs';

(async () => {

  const map = {
    "static": 0,
    "server-rendered": 1,
  };

  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => console.log(`Listening to Port: ${PORT}`));

  app.use(express.static("public"));

  //Build Starts
  await transpile();

  let routes = [];
  getFilesRecursive("_pages", routes);

  for (let route of routes) {
    const file = fs.readFileSync(route).toString().replace("/components/", "/_components/");
    fs.writeFileSync(route, file);
    console.log(route);
    const { default: Component, getProps, functionType } = await import(`./${route}`);

    route = route.replace("\\", "/");
    const src = getScript(route);
    route = route.split("_pages/")[1];

    writeFileSync("script.js", src);

    console.log(route);

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
      outfile: `public/js/${route}`,
      minify: true,
    });



    if (functionType == "static" || functionType == "server-rendered") {
      const props = await getProps();

      const markup = ReactDOMServer.renderToString(
        React.createElement(Component, {})

      );
      const html = getPageTemplate(
        markup, //HTML Markup
        "Doc", //Page Title
        `js/${route}`, //Path to Script
        serialize(props) //Props
      );

      const url = route
        .split(".js")[0]
        .replace("index", "");

      app.get(url, (req, res) => res.send(html));
    };
  }


})();
