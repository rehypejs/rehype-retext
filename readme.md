# rehype-retext [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Bridge / mutate from [**rehype**][rehype] to [**retext**][retext].

Uses [`hast-util-to-nlcst`][hast-util-to-nlcst] under the hood.  See its
documentation to learn how to ignore nodes.

## Installation

[npm][]:

```bash
npm install rehype-retext
```

## Usage

Say `example.md` looks as follows:

```html
<!doctype html>
<meta charset=utf8>
<title>Hello!</title>
<article>
  A implicit sentence.
  <h1>This and and that.</h1>
</article>
```

...and `example.js` like this:

```javascript
var vfile = require('to-vfile');
var report = require('vfile-reporter');
var unified = require('unified');
var parse = require('rehype-parse');
var minify = require('rehype-preset-minify');
var stringify = require('rehype-stringify');
var rehype2retext = require('rehype-retext');
var english = require('retext-english');
var indefinite = require('retext-indefinite-article');
var repeated = require('retext-repeated-words');

unified()
  .use(parse)
  .use(rehype2retext, unified()
    .use(english)
    .use(indefinite)
    .use(repeated)
  )
  .use(minify)
  .use(stringify)
  .process(vfile.readSync('example.html'), function (err, file) {
    console.error(report(err || file));
    console.log(String(file));
  });
```

Now, running `node example` yields:

```html
example.html
    5:3-5:4  warning  Use `An` before `implicit`, not `A`  retext-indefinite-article  retext-indefinite-article
  6:12-6:19  warning  Expected `and` once, not twice       retext-repeated-words      retext-repeated-words

⚠ 2 warnings
<!DOCTYPE html><meta charset=utf8><title>Hello!</title><article>A implicit sentence.<h1>This and and that.</h1></article>
```

## API

### `origin.use(rehype2retext, destination)`

Either bridge or mutate from [**rehype**][rehype] ([HAST][]) to
[**retext**][retext] ([NLCST][]).

###### `destination`

`destination` is either a parser or a processor.

If a [`Unified`][processor] processor is given, runs the destination
processor with the new NLCST tree, then, after running discards that
tree and continues on running the origin processor with the original
tree ([bridge-mode][bridge]).

If a parser (such as [**parse-latin**][latin], [**parse-english**][english],
or [**parse-dutch**][dutch]) is given, passes the tree to further
plug-ins (mutate-mode).

As HTML defines paragraphs, that definition is used for NLCST
`ParagraphNode`s: `<p>` and `<h1-6>` are explicitly supported,
and implicit paragraphs in flow content are also supported.

## Related

*   [`rehype-remark`](https://github.com/rehypejs/rehype-remark)
    — Transform HTML to markdown
*   [`remark-rehype`](https://github.com/wooorm/remark-rehype)
    — Transform markdown to HTML
*   [`remark-retext`](https://github.com/wooorm/remark-retext)
    — Transform markdown to [NLCST][]

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/rehypejs/rehype-retext.svg

[travis]: https://travis-ci.org/rehypejs/rehype-retext

[codecov-badge]: https://img.shields.io/codecov/c/github/rehypejs/rehype-retext.svg

[codecov]: https://codecov.io/github/rehypejs/rehype-retext

[npm]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[hast]: https://github.com/syntax-tree/hast

[rehype]: https://github.com/rehypejs/rehype

[retext]: https://github.com/wooorm/retext

[processor]: https://github.com/unifiedjs/unified#processor

[bridge]: https://github.com/unifiedjs/unified#processing-between-syntaxes

[nlcst]: https://github.com/syntax-tree/nlcst

[latin]: https://github.com/wooorm/parse-latin

[english]: https://github.com/wooorm/parse-english

[dutch]: https://github.com/wooorm/parse-dutch

[hast-util-to-nlcst]: https://github.com/syntax-tree/hast-util-to-nlcst
