/**
 * @typedef {import('hast').Root} HastRoot
 * @typedef {import('hast-util-to-nlcst').ParserConstructor} ParserConstructor
 * @typedef {import('hast-util-to-nlcst').ParserInstance} ParserInstance
 * @typedef {import('nlcst').Root} NlcstRoot
 * @typedef {import('unified').Processor<NlcstRoot>} Processor
 * @typedef {import('unified').Transformer<HastRoot>} TransformBridge
 * @typedef {import('unified').Transformer<HastRoot, NlcstRoot>} TransformMutate
 * @typedef {import('vfile').VFile} VFile
 */

/**
 * @typedef {ParserConstructor | ParserInstance} ToNlcstParser
 */

import {toNlcst} from 'hast-util-to-nlcst'

/**
 * Plugin to bridge or mutate to retext.
 *
 * If a destination processor is given, runs the destination with the new nlcst
 * tree (bridge-mode).
 * If a parser is given, returns the nlcst tree: further plugins run on that
 * tree (mutate-mode).
 *
 * @overload
 * @param {Processor} processor
 * @returns {TransformBridge}
 *
 * @overload
 * @param {ToNlcstParser} parser
 * @returns {TransformMutate}
 *
 * @param {ToNlcstParser | Processor} options
 *   Parser or processor.
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
     * Bridge-mode.
     *
     * Runs the destination with the new nlcst tree.
     * Discards result.
     *
     * @param {HastRoot} tree
     *   Tree.
     * @param {VFile} file
     *   File.
     * @returns {Promise<undefined>}
     *   Nothing.
     * @satisfies {TransformBridge}
     */
    return async function (tree, file) {
      const frozen = options.freeze()
      // @ts-expect-error: assume the parser is a retext parser.
      const parser = /** @type {ParserConstructor | ParserInstance} */ (
        frozen.parser || frozen.Parser
      )
      const nlcstTree = toNlcst(tree, file, parser)

      await options.run(nlcstTree, file)
    }
  }

  /**
   * Mutate-mode.
   *
   * Further transformers run on the nlcst tree.
   *
   * @param {HastRoot} tree
   *   Tree.
   * @param {VFile} file
   *   File.
   * @returns {NlcstRoot}
   *   Nothing.
   * @satisfies {TransformMutate}
   */
  return function (tree, file) {
    return toNlcst(tree, file, options)
  }
}
