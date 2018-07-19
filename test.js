'use strict'

var test = require('tape')
var unified = require('unified')
var parse = require('rehype-parse')
var english = require('retext-english')
var html = require('rehype-stringify')
var naturalLanguage = require('retext-stringify')
var rehype2retext = require('.')

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
].join('\n')

test('rehype2retext()', function(t) {
  t.equal(
    unified()
      .use(parse, {fragment: true})
      .use(rehype2retext, english.Parser)
      .use(naturalLanguage)
      .processSync(doc)
      .toString(),
    'Bravo',
    'should mutate'
  )

  t.equal(
    unified()
      .use(parse)
      .use(rehype2retext, unified().use(english))
      .use(html)
      .processSync(doc)
      .toString(),
    [
      '<!doctype html><html><head>',
      '    <meta charset="utf8">',
      '    <title>Alpha</title>',
      '  </head>',
      '  <body>',
      '    <p>Bravo</p>',
      '  ',
      '</body></html>'
    ].join('\n'),
    'should bridge'
  )

  t.end()
})
