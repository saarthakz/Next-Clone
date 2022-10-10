import React from 'react';
import About from "../components/About.js";

export const functionType = "static";

export function getProps() {
  return {
    name: "Sample"
  };
};

export default function index(props) {
  return (
    <About {...props} />
  );
};

