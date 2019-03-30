module.exports = function(xml) {
  function nativeType(value) {
    const nValue = Number(value);
    if (!isNaN(nValue)) {
      return nValue;
    }
    const bValue = value.toLowerCase();
    if (bValue === 'true') {
      return true;
    } else if (bValue === 'false') {
      return false;
    }
    return value;
  }

  const removeJsonCdataAttribute = function(value, parentElement) {
    const grandParent = parentElement._parent;
    const grandParentKeys = Object.keys(grandParent);
    const lastKeyName = grandParentKeys[grandParentKeys.length - 1];
    grandParent[lastKeyName] = value;
  };

  const removeJsonTextAttribute = function(value, parentElement) {
    try {
      const nativeValue = nativeType(value);
      const grandParent = parentElement._parent;
      const grandParentKeys = Object.keys(grandParent);
      const lastKeyName = grandParentKeys[grandParentKeys.length - 1];

      const existingValue = grandParent[lastKeyName];
      if (typeof existingValue.length !== 'undefined') {
        const arrIndex = existingValue.length - 1;
        existingValue[arrIndex] = nativeValue;
      } else {
        grandParent[lastKeyName] = nativeValue;
      }
    } catch (e) {
      return value;
    }
  };

  const options = {
    compact: true,
    trim: true,
    ignoreDeclaration: true,
    ignoreInstruction: true,
    ignoreAttributes: false,
    ignoreComment: true,
    ignoreCdata: false,
    ignoreDoctype: true,
    textFn: removeJsonTextAttribute,
    cdataFn: removeJsonCdataAttribute
  };

  const convert = require('xml-js');

  return convert.xml2json(xml, options);
};
