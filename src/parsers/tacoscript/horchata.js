import React from 'react';
import defaultParserInterface from '../js/utils/defaultESTreeParserInterface';
import pkg from 'horchata/package.json';
import * as LocalStorage from '../../LocalStorage';
import SettingsRenderer from '../utils/SettingsRenderer';

const ID = 'horchata';
const plugins = [
];
const options = {
  sourceType: 'module',
  allowImportExportEverywhere: false,
  allowReturnOutsideFunction: false,
  plugins: plugins.slice(0),
  ...LocalStorage.getParserSettings(ID),
};

export default {
  ...defaultParserInterface,

  id: ID,
  displayName: ID,
  version: pkg.version,
  homepage: pkg.homepage,
  locationProps: new Set(['loc', 'start', 'end', 'tokenStart', 'tokenEnd', 'input', 'sourceElements', '_childReferences']),

  loadParser(callback) {
    require(['horchata'], callback);
  },

  parse(babylon, code) {
    return babylon.parse(code, options);
  },

  getNodeName(node) {
    switch (typeof node.type) {
      case 'string':
        return node.type;
      case 'object':
        return `Token (${node.type.label})`;
    }
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

let parserSettings = [
  ['sourceType', ['module', 'script']],
  'allowReturnOutsideFunction',
  'allowSuperOutsideMethod',
  'allowNewTargetOutsideFunction',
  'allowImportExportEverywhere',
  'noTopLevelDirectives',
];

function changeOption(name, {target}) {
  if (name === 'sourceType') {
    options.sourceType = target.value;
  } else if (parserSettings.indexOf(name) > -1) {
    options[name] = target.checked;
  } else if (plugins.indexOf(name) > -1) {
    let plugs = new Set(options.plugins);
    if (target.checked) {
      plugs.add(name);
    } else {
      plugs.delete(name);
    }
    options.plugins = Array.from(plugs);
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
      {/*
      <h4>plugins</h4>
      {SettingsRenderer({
        settings: plugins,
        values: plugins.reduce(
          (obj, p) => ((obj[p] = options.plugins.indexOf(p) > -1), obj),
          {}
        ),
        onChange: changeOption,
      })}
      */}
    </div>
  );
}
