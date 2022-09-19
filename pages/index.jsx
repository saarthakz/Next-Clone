import React from 'react';
import Index from '../_components/Index.js';

export default function index({ props }) {
  return (
    <Index {...props} />
  );
};

export function getProps() {
  return {
    name: "Sample"
  };
};