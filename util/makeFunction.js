export default function (pathFromRoot) {
  return `import { getProps } from "../${pathFromRoot}";
  import { createElement } from "react";
  import { renderToString } from "react-dom/server";
  
export default function () {
  return getProps();
};
  `;
};