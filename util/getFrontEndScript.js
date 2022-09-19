export default function getScript(pathToPage) {
  return `import React from "react";
import ReactDOM from "react-dom/client";
(async () => {
  const { default: Component } = await import("./${pathToPage}");
  const props = window.__DATA__;
  ReactDOM.hydrateRoot(document.getElementById("root"), React.createElement(Component, {
    ...props
  }));
})();`;
};