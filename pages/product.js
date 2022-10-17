import React from 'react';
import Product from '../components/Product.js';

export const functionType = "server-rendered";

export default function index(props) {
  return (
    <Product {...props} />
  );
};

