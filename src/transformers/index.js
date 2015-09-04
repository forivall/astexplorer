// import jscodeshift from './jscodeshift';
// import babel from './babel';
import tacoscriptGenJs from './tacoscript-js';

export let transformers = [
  // jscodeshift,
  // babel,
  tacoscriptGenJs,
];

let byID = transformers.reduce(
  (map, tool) => {
    map[tool.id] = tool;
    return map;
  },
  {}
);

export function getTransformerByID(id) {
  return byID[id];
}
