// import React from 'react';
// import pkg from 'babylon/package.json';
// import loadAndExectue from './utils/loadAndExecute';
import * as LocalStorage from '../LocalStorage';
import SettingsRenderer from './utils/SettingsRenderer';

import tacoscriptParseJs from 'tacoscript-core/lib/helpers/parse-js';

const ID = 'tacoscriptParse';

export default {
  name: ID,
  version: '',
  homepage: '',

  parse(code) {
    return new Promise((resolve, reject) => {
      try {
        resolve(tacoscriptParseJs(code));
      } catch(error) {
        // Assume parse error
        console.error(error)
        reject(error);
      }
    });
  },

  nodeToRange(node) {
    if (typeof node.start !== 'undefined') {
      return [node.start, node.end];
    }
  },

  renderSettings() {
    return Settings();
  },
};

function Settings() {
  return [];
}
