import transpile from "./util/transpile";

await transpile();
let routes = [];
getFilesRecursive("_pages", routes);

for (let route of routes) {
  const file = fs.readFileSync(route).toString().replace("/components/", "/_components/");
  fs.writeFileSync(route, file);

  route = route.replace("\\", "/");
  const src = getScript(route);

  writeFileSync("script.js", src);

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
    outfile: `public/js/${route.split("/")[1]}`,
    minify: true,
  });

  const { default: Component, getProps, functionType } = await import(`./${route}`);

  if (functionType == "static") {
    const props = await getProps();

    const markup = ReactDOMServer.renderToString(
      React.createElement(Component, {})

    );
    const html = getPageTemplate(
      markup, //HTML Markup
      "Doc", //Page Title
      `js/${route.split("/")[1]}`, //Path to Script
      serialize(props) //Props
    );

    const url = ((route
      .split("_pages")[1])
      .split(".js")[0])
      .replace("index", "");
  };
};