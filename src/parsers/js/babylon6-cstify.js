import defaultParserInterface from './utils/defaultESTreeParserInterface';
import pkg from 'cstify/package.json';

const ID = 'babylon6+cstify';
import babylon from './babylon6';

export default {
  ...defaultParserInterface,

  id: ID,
  displayName: ID,
  version: pkg.version,
  homepage: pkg.homepage,
  locationProps: babylon.locationProps,

  loadParser(callback) {
    require(['cstify', 'babylon6'], (cstify, babylon6) => callback([cstify.default, babylon6]));
  },

  parse([cstify, babylon6], code) {
    return cstify(babylon.parse(babylon6, code), code);
  },

  getNodeName(node) {
    switch (typeof node.type) {
      case 'string':
        return node.type;
      case 'object':
        return `Token (${node.type.label})`;
    }
    if (typeof node.reference === 'string') {
      if (typeof node.element === 'string') {
        return `${node.element} Reference`;
      }
      return 'Reference';
    }
    if (typeof node.element === 'string') {
      return `${node.element}`;
    }
  },

  nodeToRange(node) {
    return babylon.nodeToRange(node);
  },

  renderSettings() {
    return babylon.Settings();
  },
};
