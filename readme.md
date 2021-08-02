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

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c):
Node 12+ is needed to use it and it must be `import`ed instead of `require`d.

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
import {readSync} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {unified} from 'unified'
import rehypeParse from 'rehype-parse'
import rehypePresetMinify from 'rehype-preset-minify'
import rehypeStringify from 'rehype-stringify'
import rehypeRetext from 'rehype-retext'
import retextEnglish from 'retext-english'
import retextIndefiniteArticle from 'retext-indefinite-article'
import retextRepeatedWords from 'retext-repeated-words'

const file = readSync('example.html')

unified()
  .use(rehypeParse)
  .use(
    rehypeRetext,
    unified()
      .use(retextEnglish)
      .use(retextIndefiniteArticle)
      .use(retextRepeatedWords)
  )
  .use(rehypePresetMinify)
  .use(rehypeStringify)
  .process(file)
  .then((file) => {
    console.error(reporter(file))
    console.log(String(file))
  })
```

Now, running `node example` yields:

```html
example.html
    5:3-5:4  warning  Use `An` before `implicit`, not `A`  retext-indefinite-article  retext-indefinite-article
  6:12-6:19  warning  Expected `and` once, not twice       and                        retext-repeated-words

⚠ 2 warnings
<!doctypehtml><meta charset=utf8><title>Hello!</title><article>A implicit sentence.<h1>This and and that.</h1></article>
```

## API

This package exports no identifiers.
The default export is `rehypeRetext`.

### `unified().use(rehypeRetext, destination)`

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

*   [`rehype-remark`](https://github.com/rehypejs/rehype-remark)
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

[build-badge]: https://github.com/rehypejs/rehype-retext/workflows/main/badge.svg

[build]: https://github.com/rehypejs/rehype-retext/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/rehypejs/rehype-retext.svg

[coverage]: https://codecov.io/github/rehypejs/rehype-retext

[downloads-badge]: https://img.shields.io/npm/dm/rehype-retext.svg

[downloads]: https://www.npmjs.com/package/rehype-retext

[size-badge]: https://img.shields.io/bundlephobia/minzip/rehype-retext.svg

[size]: https://bundlephobia.com/result?p=rehype-retext

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/rehypejs/rehype/discussions

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/rehypejs/.github

[contributing]: https://github.com/rehypejs/.github/blob/HEAD/contributing.md

[support]: https://github.com/rehypejs/.github/blob/HEAD/support.md

[coc]: https://github.com/rehypejs/.github/blob/HEAD/code-of-conduct.md

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
