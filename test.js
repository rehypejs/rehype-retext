import test from 'tape'
import {unified} from 'unified'
import rehypeParse from 'rehype-parse'
import retextEnglish, {Parser as RetextEnglish} from 'retext-english'
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

test('rehypeRetext', (t) => {
  t.throws(
    () => {
      // @ts-expect-error: runtime.
      unified().use(rehypeRetext).freeze()
    },
    /Expected `parser` \(such as from `retext-english` or `parse-english`\) or `processor` \(a unified pipeline\) as `options`/,
    'should throw when w/o parser or processor'
  )

  t.equal(
    unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeRetext, RetextEnglish)
      .use(retextStringify)
      .processSync(doc)
      .toString(),
    'Bravo',
    'should mutate'
  )

  t.equal(
    unified()
      .use(rehypeParse)
      .use(rehypeRetext, unified().use(retextEnglish))
      .use(rehypeStringify)
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
