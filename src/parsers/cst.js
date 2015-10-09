import React from 'react';
import pkg from 'cst/package.json';
import loadAndExecute from './utils/loadAndExecute';
import * as LocalStorage from '../LocalStorage';
import SettingsRenderer from './utils/SettingsRenderer';

const ID = 'cst';

const options = {
  strictMode: true,
};

export default {
  id: ID,
  displayName: ID,
  version: pkg.version,
  homepage: pkg.homepage,

  parse(code) {
    return loadAndExecute(
      ['cst'],
      cst => {
        let parser = new cst.Parser();
        if (!options.strictMode) {
          parser.disableStrictMode();
        }
        let ast = parser.parse(code);
        let traverse = function (node) {
          for (let child of (node.childElements)) {
            traverse(child);
          }
          if ('_firstChild' in node) { delete node._firstChild; }
          if ('_lastChild' in node) { delete node._lastChild; }
          if ('_parentElement' in node) { delete node._parentElement; }
          if ('_nextSibling' in node) { delete node._nextSibling; }
          if ('_previousSibling' in node) { delete node._previousSibling; }
          if ('_searchIndex' in node) { delete node._searchIndex; }
        };
        traverse(ast);
        delete ast._firstChild;
        delete ast._lastChild;
        delete ast._parentElement;
        delete ast._nextSibling;
        delete ast._previousSibling;
        delete ast._searchIndex;
        return ast;
      }
    );
  },

  nodeToRange(node) {
    return node.range;
  },

  renderSettings() {
    return Settings();
  },
};

let parserSettings = [
  'strictMode',
];

function changeOption(name, {target}) {
  if (name === 'strictMode') {
    options.strictMode = target.value;
  }
  LocalStorage.setParserSettings(ID, options);
}

function Settings() {
  return (
    <div>
      {SettingsRenderer({
        settings: parserSettings,
        values: options,
        onChange: changeOption,
      })}
    </div>
  );
}
