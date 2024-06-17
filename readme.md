# rehype-retext

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

**[rehype][]** plugin to support **[retext][]**.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`unified().use(rehypeRetext, options)`](#unifieduserehyperetext-options)
* [Types](#types)
* [Compatibility](#compatibility)
* [Security](#security)
* [Related](#related)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package is a [unified][] ([rehype][]) plugin to support [retext][].

**unified** is a project that transforms content with abstract syntax trees
(ASTs).
**rehype** adds support for HTML to unified.
**retext** adds support for natural language to unified.
**hast** is the HTML AST that rehype uses.
**nlcst** is the natural language AST that retext uses.
This is a rehype plugin that transforms hast into nlcst to support retext.

## When should I use this?

This project is useful if you want to check natural language in HTML.
The retext ecosystem has many useful plugins to check prose, such as
[`retext-indefinite-article`][retext-indefinite-article] which checks that `a`
and `an` are used correctly, or [`retext-readability`][retext-readability] which
checks that sentences are not too complex.
This plugins lets you use them on HTML documents.

This plugin is not able to apply changes by retext plugins (such
as done by `retext-smartypants`) to the HTML content.

This plugin is built on [`hast-util-to-nlcst`][hast-util-to-nlcst], which does
the work on syntax trees.
rehype focusses on making it easier to transform content by abstracting such
internals away.

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install rehype-retext
```

In Deno with [`esm.sh`][esmsh]:

```js
import rehypeRetext from 'https://esm.sh/rehype-retext@5'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import rehypeRetext from 'https://esm.sh/rehype-retext@5?bundle'
</script>
```

## Use

Say we have the following file `example.html`:

```html
<!doctype html>
<meta charset=utf8>
<title>Hello!</title>
<article>
  A implicit sentence.
  <h1>This and and that.</h1>
</article>
```

…and our module `example.js` looks as follows:

```js
import rehypeParse from 'rehype-parse'
import rehypePresetMinify from 'rehype-preset-minify'
import rehypeRetext from 'rehype-retext'
import rehypeStringify from 'rehype-stringify'
import retextEnglish from 'retext-english'
import retextIndefiniteArticle from 'retext-indefinite-article'
import retextRepeatedWords from 'retext-repeated-words'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await unified()
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
  .process(await read('example.html'))

console.error(reporter([file]))
console.log(String(file))
```

…then running `node example.js` yields:

```html
example.html
5:3-5:4   warning Unexpected article `A` before `implicit`, expected `An` retext-indefinite-article retext-indefinite-article
6:12-6:19 warning Unexpected repeated `and`, remove one occurrence        and                       retext-repeated-words

⚠ 2 warnings
```

```html
<!doctypehtml><meta charset=utf8><title>Hello!</title><article>A implicit sentence.<h1>This and and that.</h1></article>
```

## API

This package exports no identifiers.
The default export is [`rehypeRetext`][api-rehype-retext].

### `unified().use(rehypeRetext, options)`

Bridge or mutate to retext.

###### Parameters

* `options` ([`Parser`][unified-parser] or [`Processor`][unified-processor])
  — configuration (required)

###### Returns

Transform ([`Transformer`][unified-transformer]).

###### Notes

* if a [processor][unified-processor] is given, uses its parser to create a
  new nlcst tree, then runs the plugins attached to with that
  (*[bridge mode][unified-mode]*); you can add a parser to processor for
  example with `retext-english`; other plugins used on the processor should
  be retext plugins
* if a [parser][unified-parser] is given, uses it to create a new nlcst tree,
  and returns it (*[mutate mode][unified-mode]*); you can get a parser by
  importing `Parser` from `retext-english` for example;  other plugins used
  after `rehypeRetext` should be retext plugins

## Types

This package is fully typed with [TypeScript][].
It exports no additional types.

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line, `rehype-retext@5`,
compatible with Node.js 16.

This plugin works with `unified` version 6+, `rehype` version 4+, and `retext`
version 7+.

## Security

`rehype-retext` does not change the syntax tree so there are no openings for
[cross-site scripting (XSS)][xss] attacks.

## Related

* [`rehype-remark`](https://github.com/rehypejs/rehype-remark)
  — rehype plugin to turn HTML into markdown
* [`remark-retext`](https://github.com/remarkjs/remark-retext)
  — remark plugin to support retext
* [`remark-rehype`](https://github.com/remarkjs/remark-rehype)
  — remark plugin to turn markdown into HTML

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

[size-badge]: https://img.shields.io/bundlejs/size/rehype-retext

[size]: https://bundlejs.com/?q=rehype-retext

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/rehypejs/rehype/discussions

[npm]: https://docs.npmjs.com/cli/install

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[health]: https://github.com/rehypejs/.github

[contributing]: https://github.com/rehypejs/.github/blob/main/contributing.md

[support]: https://github.com/rehypejs/.github/blob/main/support.md

[coc]: https://github.com/rehypejs/.github/blob/main/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[typescript]: https://www.typescriptlang.org

[hast-util-to-nlcst]: https://github.com/syntax-tree/hast-util-to-nlcst

[rehype]: https://github.com/rehypejs/rehype

[retext]: https://github.com/retextjs/retext

[retext-indefinite-article]: https://github.com/retextjs/retext-indefinite-article

[retext-readability]: https://github.com/retextjs/retext-readability

[unified]: https://github.com/unifiedjs/unified

[unified-mode]: https://github.com/unifiedjs/unified#transforming-between-ecosystems

[unified-parser]: https://github.com/unifiedjs/unified#parser

[unified-processor]: https://github.com/unifiedjs/unified#processor

[unified-transformer]: https://github.com/unifiedjs/unified#transformer

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[api-rehype-retext]: #unifieduserehyperetext-options
