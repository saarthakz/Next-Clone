import React from 'react';
import Index from '../components/Index.js';

export const functionType = "static";

export function getProps() {
  return {
    name: "Sample"
  };
};

export default function index(props) {
  return (
    <Index {...props} />
  );
};