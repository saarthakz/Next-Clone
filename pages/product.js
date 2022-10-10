import React from 'react';
import Product from '../components/Product.js';

export const functionType = "server-rendered";

export function getProps() {
  return {
    name: "Sample"
  };
};

export default function index(props) {
  return (
    <Product {...props} />
  );
};

