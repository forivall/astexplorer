"use strict";
var Parse = require('./Parse');
if (typeof Parse === 'function') {
var SnippetRevision = Parse.Object.extend('SnippetRevision');

module.exports = SnippetRevision;
}