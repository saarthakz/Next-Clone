import React from 'react';
import About from "../components/About.js";
import { SDK_VERSION } from "firebase/app";

export const functionType = "static";

export default function index(props) {

  console.log(SDK_VERSION);

  return (
    <About {...props} />
  );
};

