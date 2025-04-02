import assert from 'node:assert/strict'
import test from 'node:test'
import {ParseEnglish} from 'parse-english'
import rehypeParse from 'rehype-parse'
import rehypeRetext from 'rehype-retext'
import rehypeStringify from 'rehype-stringify'
import retextEnglish from 'retext-english'
import retextStringify from 'retext-stringify'
import {unified} from 'unified'

const document = [
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
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('rehype-retext')).sort(), [
      'default'
    ])
  })

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
      .use(retextStringify)
      .process(document)

    assert.equal(String(file), 'Bravo')
  })

  await t.test('should bridge', async function () {
    const file = await unified()
      .use(rehypeParse)
      .use(rehypeRetext, unified().use(retextEnglish))
      .use(rehypeStringify)
      .process(document)

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
