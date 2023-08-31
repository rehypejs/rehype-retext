import assert from 'node:assert/strict'
import test from 'node:test'
import {unified} from 'unified'
import rehypeParse from 'rehype-parse'
import {ParseEnglish} from 'parse-english'
import retextEnglish from 'retext-english'
import rehypeStringify from 'rehype-stringify'
import retextStringify from 'retext-stringify'
import rehypeRetext from './index.js'

const doc = [
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

test('rehypeRetext', async function (t) {
  await t.test('should throw when w/o parser or processor', async function () {
    assert.throws(function () {
      // @ts-expect-error: check how missing options is handled.
      unified().use(rehypeRetext).freeze()
    }, /Expected `parser` \(such as from `parse-english`\) or `processor` \(a unified pipeline\) as `options`/)
  })

  await t.test('should mutate', async function () {
    const file = await unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeRetext, ParseEnglish)
      // @ts-expect-error: to do: remove this when `retext-stringify` is released.
      .use(retextStringify)
      .process(doc)

    assert.equal(String(file), 'Bravo')
  })

  await t.test('should bridge', async function () {
    const file = await unified()
      .use(rehypeParse)
      // @ts-expect-error: to do: remove this when `retext-stringify` is released, hopefully.
      .use(rehypeRetext, unified().use(retextEnglish))
      .use(rehypeStringify)
      .process(doc)

    assert.equal(
      String(file),
      [
        '<!doctype html><html><head>',
        '    <meta charset="utf8">',
        '    <title>Alpha</title>',
        '  </head>',
        '  <body>',
        '    <p>Bravo</p>',
        '  ',
        '</body></html>'
      ].join('\n')
    )
  })
})
