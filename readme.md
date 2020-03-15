# rehype-retext

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**rehype**][rehype] plugin to bridge or mutate to [**retext**][retext].

Uses [`hast-util-to-nlcst`][to-nlcst] under the hood.
See its documentation to learn how to ignore nodes.

## Install

[npm][]:

```sh
npm install rehype-retext
```

## Use

Say `example.html` looks as follows:

```html
<!doctype html>
<meta charset=utf8>
<title>Hello!</title>
<article>
  A implicit sentence.
  <h1>This and and that.</h1>
</article>
```

…and `example.js` like this:

```js
var vfile = require('to-vfile')
var report = require('vfile-reporter')
var unified = require('unified')
var parse = require('rehype-parse')
var minify = require('rehype-preset-minify')
var stringify = require('rehype-stringify')
var rehype2retext = require('rehype-retext')
var english = require('retext-english')
var indefinite = require('retext-indefinite-article')
var repeated = require('retext-repeated-words')

unified()
  .use(parse)
  .use(
    rehype2retext,
    unified()
      .use(english)
      .use(indefinite)
      .use(repeated)
  )
  .use(minify)
  .use(stringify)
  .process(vfile.readSync('example.html'), function(err, file) {
    console.error(report(err || file))
    console.log(String(file))
  })
```

Now, running `node example` yields:

```html
example.html
    5:3-5:4  warning  Use `An` before `implicit`, not `A`  retext-indefinite-article  retext-indefinite-article
  6:12-6:19  warning  Expected `and` once, not twice       retext-repeated-words      retext-repeated-words

⚠ 2 warnings
<!doctype html><meta charset=utf8><title>Hello!</title><article>A implicit sentence.<h1>This and and that.</h1></article>
```

## API

### `origin.use(rehype2retext, destination)`

[**rehype**][rehype] ([hast][]) plugin to bridge or mutate to
[**retext**][retext] ([nlcst][]).

###### `destination`

`destination` is either a parser or a processor.

If a processor ([`Unified`][processor]) is given, runs the destination
processor with the new nlcst tree, then, after running discards that tree and
continues on running the origin processor with the original tree
([bridge-mode][bridge]).

If a parser (such as [**parse-latin**][latin], [**parse-english**][english], or
[**parse-dutch**][dutch]) is given, passes the tree to further plugins
(mutate-mode).

As HTML defines paragraphs, that definition is used for
[**Paragraph**][paragraph]s: `<p>` and `<h1-6>` are explicitly
supported, and implicit paragraphs in flow content are also supported.

## Security

`rehype-retext` does not change the syntax tree so there are no openings for
[cross-site scripting (XSS)][xss] attacks.

## Related

*   [`rehype-remark`](https://github.com/rehypejs/rehype-retext)
    — Transform HTML ([**hast**][hast]) to Markdown ([**mdast**][mdast])
*   [`remark-retext`](https://github.com/remarkjs/remark-retext)
    — Transform Markdown ([**mdast**][mdast]) to natural language
    ([**nlcst**][nlcst])
*   [`remark-rehype`](https://github.com/remarkjs/remark-rehype)
    — Transform Markdown ([**mdast**][mdast]) to HTML ([**hast**][hast])

## Contribute

See [`contributing.md`][contributing] in [`rehypejs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/rehypejs/rehype-retext.svg

[build]: https://travis-ci.org/rehypejs/rehype-retext

[coverage-badge]: https://img.shields.io/codecov/c/github/rehypejs/rehype-retext.svg

[coverage]: https://codecov.io/github/rehypejs/rehype-retext

[downloads-badge]: https://img.shields.io/npm/dm/rehype-retext.svg

[downloads]: https://www.npmjs.com/package/rehype-retext

[size-badge]: https://img.shields.io/bundlephobia/minzip/rehype-retext.svg

[size]: https://bundlephobia.com/result?p=rehype-retext

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/rehype

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/rehypejs/.github

[contributing]: https://github.com/rehypejs/.github/blob/master/contributing.md

[support]: https://github.com/rehypejs/.github/blob/master/support.md

[coc]: https://github.com/rehypejs/.github/blob/master/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[rehype]: https://github.com/rehypejs/rehype

[retext]: https://github.com/retextjs/retext

[processor]: https://github.com/unifiedjs/unified#processor

[bridge]: https://github.com/unifiedjs/unified#processing-between-syntaxes

[hast]: https://github.com/syntax-tree/hast

[mdast]: https://github.com/syntax-tree/mdast

[nlcst]: https://github.com/syntax-tree/nlcst

[paragraph]: https://github.com/syntax-tree/nlcst#paragraph

[to-nlcst]: https://github.com/syntax-tree/hast-util-to-nlcst

[latin]: https://github.com/wooorm/parse-latin

[english]: https://github.com/wooorm/parse-english

[dutch]: https://github.com/wooorm/parse-dutch

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting
