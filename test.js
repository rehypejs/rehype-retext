/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module rehype-retext
 * @fileoverview Test suite for `rehype-retext`.
 */

'use strict';

/* Dependencies. */
var test = require('tape');
var unified = require('unified');
var parse = require('rehype-parse');
var english = require('retext-english');
var html = require('rehype-stringify');
var naturalLanguage = require('retext-stringify');
var rehype2retext = require('./index.js');

var doc = [
  '<!doctype html>',
  '<html>',
  '  <head>',
  '    <meta charset=utf8>',
  '    <title>Alpha</title>',
  '  </head>',
  '  <body>',
  '    <p>Bravo</p>',
  '  </head>',
  '</html>'
].join('\n');

/* Tests. */
test('rehype2retext()', function (t) {
  t.equal(
    unified()
      .use(parse, {fragment: true})
      .use(rehype2retext, english.Parser)
      .use(naturalLanguage)
      .process(doc)
      .toString(),
    'Bravo',
    'should mutate'
  );

  t.equal(
    unified()
      .use(parse)
      .use(rehype2retext, unified().use(english))
      .use(html)
      .process(doc)
      .toString(),
    [
      '<!DOCTYPE html><html><head>',
      '    <meta charset="utf8">',
      '    <title>Alpha</title>',
      '  </head>',
      '  <body>',
      '    <p>Bravo</p>',
      '  ',
      '</body></html>'
    ].join('\n'),
    'should bridge'
  );

  t.end();
});
