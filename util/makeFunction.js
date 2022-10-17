export default function makeFunction(route) {
  const cwd = process.cwd().replaceAll("\\", "/");
  return `
  import { default as Component } from "${cwd + "/build/pages/" + route}";
  import { default as getProps } from "${cwd + "/props/" + route}";
  import { createElement } from "react";
  import { renderToString } from "react-dom/server";
  import serialize from "serialize-javascript";
  import { default as getPage } from "${cwd + "/util/getPage.js"}";

  export default async function renderer() {
    const props = await getProps();
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