export default function makeFunction(route) {
  const cwd = process.cwd().replaceAll("\\", "/");
  return `
  const { getProps, default: Component } = await import("${cwd + "/build/pages/" + route}");
  
  import { createElement } from "react";
  import { renderToString } from "react-dom/server";
  import serialize from "serialize-javascript";
  const { default: getPage } = await import("${cwd}" + "/util/getPage.js");

  export default function renderer() {
    const props = getProps();
    const markup = renderToString(createElement(Component, { ...props }));
    return getPage(
      markup, //HTML Markup
      "Doc", //Page Title
      "/__assets__/javascript/${route}", //Path to Script
      serialize(props) //Props
    );
  };
  `;
};