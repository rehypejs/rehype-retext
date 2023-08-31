import test from 'tape'
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

test('rehypeRetext', async (t) => {
  t.throws(
    () => {
      // @ts-expect-error: runtime.
      unified().use(rehypeRetext).freeze()
    },
    /Expected `parser` \(such as from `parse-english`\) or `processor` \(a unified pipeline\) as `options`/,
    'should throw when w/o parser or processor'
  )

  t.equal(
    unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeRetext, ParseEnglish)
      // @ts-expect-error: to do: remove this when `retext-stringify` is released.
      .use(retextStringify)
      .processSync(doc)
      .toString(),
    'Bravo',
    'should mutate'
  )

  const file = await unified()
    .use(rehypeParse)
    // @ts-expect-error: to do: remove this when `retext-stringify` is released, hopefully.
    .use(rehypeRetext, unified().use(retextEnglish))
    .use(rehypeStringify)
    .process(doc)

  t.equal(
    file.toString(),
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
