import React from "react";
import ReactDOM from "react-dom/client";
(async () => {
  const { default: Component } = await import("./_pages/index.js");
  const props = window.__DATA__;
  ReactDOM.hydrateRoot(document.getElementById("root"), React.createElement(Component, {
    ...props
  }));
})();