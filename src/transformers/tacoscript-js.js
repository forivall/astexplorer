// import compileModule from './utils/compileModule';
// import pkg from 'babel-core/package.json';

import { CodeGenerator as TacoscriptCodeGenerator } from 'tacoscript-core/lib/gen-js';

const ID = 'tacoscript-js';

const defaultTransform = '';

function transform({ast, code}) {
  return new Promise((resolve, reject) => {
    try {
      resolve(new TacoscriptCodeGenerator(ast, {}, code).generate().code)
    } catch(ex) {
      reject(ex);
    };
  });
}

export default {
  id: ID,
  displayName: ID,
  version: '',
  homepage: '',
  isStatic: true,
  defaultParser: {
    id: 'tacoscript-js',
  },
  transformProps: ['ast'],
  defaultTransform,
  transform,
};
