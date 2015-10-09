import Element from './Element';
import React from 'react';
import keysIn from 'lodash.keysin';
import isFunction from 'lodash.isfunction';
import isUndefined from 'lodash.isundefined';
import uniq from 'lodash.uniq';

// we don't want to touch getters twice, so we don't just filter the keys,
// we return an entire temporary object of the keys we want to display
function getMappableProperties(o) {
  let realKeys = keysIn(o);
  let keys = uniq(realKeys.concat(["loc", "range"]));
  let temp = {};
  for (let key of (keys: Array)) {
    let value = o[key];
    if (!isFunction(value)) {
      temp[key] = value;
    }
  }
  // filter out duplicate private values
  let ret = {};
  for (let key of (keys: Array)) {
    if (key[0] === '_') {
      let nonPrivKey = key.slice(1), nonPrivValue;
      if (nonPrivKey in temp) {
        if (temp[nonPrivKey] === temp[key]) continue;
      } else if (!isUndefined(nonPrivValue = o[nonPrivKey])) {
        ret[nonPrivKey] = nonPrivValue;
        continue;
      }
    }
    let value = temp[key];
    if (isUndefined(value) && realKeys.indexOf(key) === -1) continue;
    ret[key] = value;
  }
  return ret;
}

export default class PropertyList {
  static defaultProps = {
    object: {},
    deepOpen: false,
  };

  render() {
    var focusPath = this.props.focusPath;
    var level = this.props.level;
    var object = getMappableProperties(this.props.object);
    var properties = Object.keys(object).map(key => {
      var v = object[key];
      return ( // eslint-disable-line consistent-return
        <Element
          key={key}
          name={key}
          focusPath={focusPath}
          deepOpen={this.props.deepOpen}
          value={v}
          level={level}
        />
      );
    });
    return <ul className="value-body">{properties}</ul>;
  }
}
