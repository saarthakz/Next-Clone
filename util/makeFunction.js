export default function (route) {
  return `import { getProps, default as Component } from "../pages/${route}";
  import { createElement } from "react";
  import { renderToString } from "react-dom/server";
  import serialize from "serialize-javascript";
  import getPage from "../../util/getPage";
  
  export default function () {
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