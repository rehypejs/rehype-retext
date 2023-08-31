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
      const frozen = options.freeze()
      // @ts-expect-error: assume the parser is a retext parser.
      const parser = /** @type {Parser} */ (frozen.parser || frozen.Parser)
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
