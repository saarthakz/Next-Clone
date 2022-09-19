import React from 'react';
import About from '../_components/About.js';

export default function about({ props }) {
  return (
    <About {...props} />
  );
};

export function getProps() {
  return {};
};

