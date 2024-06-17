/**
 * @typedef {import('hast').Root} HastRoot
 * @typedef {import('hast-util-to-nlcst').ParserConstructor} ParserConstructor
 * @typedef {import('hast-util-to-nlcst').ParserInstance} ParserInstance
 * @typedef {import('nlcst').Root} NlcstRoot
 * @typedef {import('unified').Processor<NlcstRoot>} Processor
 * @typedef {import('vfile').VFile} VFile
 */

/**
 * @typedef {ParserConstructor | ParserInstance} Parser
 *
 * @callback TransformBridge
 *   Bridge-mode.
 *
 *   Runs the destination with the new nlcst tree.
 *   Discards result.
 * @param {HastRoot} tree
 *   Tree.
 * @param {VFile} file
 *   File.
 * @returns {Promise<undefined>}
 *   Nothing.
 *
 * @callback TransformMutate
 *  Mutate-mode.
 *
 *  Further transformers run on the nlcst tree.
 *
 * @param {HastRoot} tree
 *   Tree.
 * @param {VFile} file
 *   File.
 * @returns {NlcstRoot}
 *   Tree (nlcst).
 */

import {toNlcst} from 'hast-util-to-nlcst'
import {ParseLatin} from 'parse-latin'

/**
 * Bridge or mutate to retext.
 *
 * ###### Notes
 *
 * *   if a [processor][] is given, uses its parser to create a new nlcst tree,
 *     then runs the plugins attached to with that ([*bridge mode*][bridge]);
 *     you can add a parser to processor for example with `retext-english`; other
 *     plugins used on the processor should be retext plugins
 * *   if a [parser][] is given, uses it to create a new nlcst tree, and returns
 *     it (*mutate mode*); you can get a parser by importing `Parser` from
 *     `retext-english` for example; other plugins used after `rehypeRetext`
 *     should be retext plugins
 *
 * @overload
 * @param {Processor} processor
 * @returns {TransformBridge}
 *
 * @overload
 * @param {Parser} parser
 * @returns {TransformMutate}
 *
 * @param {Parser | Processor} options
 *   Configuration (required).
 * @returns {TransformBridge | TransformMutate}
 *   Transform.
 */
export default function rehypeRetext(options) {
  if (!options) {
    throw new Error(
      'Expected `parser` (such as from `parse-english`) or `processor` (a unified pipeline) as `options`'
    )
  }

  if ('run' in options) {
    /**
     * @type {TransformBridge}
     */
    return async function (tree, file) {
      const parser = parserFromRetextParse(options)
      const nlcstTree = toNlcst(tree, file, parser)
      await options.run(nlcstTree, file)
    }
  }

  /**
   * @type {TransformMutate}
   */
  return function (tree, file) {
    return toNlcst(tree, file, options)
  }
}

/**
 *
 * @param {Processor} processor
 * @returns {ParseLatin}
 */
function parserFromRetextParse(processor) {
  const parser = new ParseLatin()
  add(
    parser.tokenizeParagraphPlugins,
    processor.data('nlcstParagraphExtensions')
  )
  add(parser.tokenizeRootPlugins, processor.data('nlcstRootExtensions'))
  add(parser.tokenizeSentencePlugins, processor.data('nlcstSentenceExtensions'))

  return parser

  /**
   * @template T
   * @param {Array<T>} list
   * @param {Array<T> | undefined} values
   */
  function add(list, values) {
    /* c8 ignore next -- plugins like `retext-emoji`. */
    if (values) list.unshift(...values)
  }
}
