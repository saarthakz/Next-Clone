export default function (pathFromRoot) {
  return `import { getProps } from "../${pathFromRoot}";
  
export default function () {
  return getProps();
};
  `;
};