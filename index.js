/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('hast').Root} HastRoot
 * @typedef {import('hast-util-to-nlcst/lib/index.js').ParserInstance} ParserInstance
 * @typedef {import('hast-util-to-nlcst/lib/index.js').ParserConstructor} ParserConstructor
 * @typedef {import('unified').Processor<any, any, any, any>} Processor
 * @typedef {import('unified').Parser<any>} Parser
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
 * @param options
 *   Either a processor (`unified().use(retextEnglish)…`) or a parser.
 */
const rehypeRetext =
  /**
   * @type {(import('unified').Plugin<[Processor], HastRoot, HastRoot> & import('unified').Plugin<[Parser], HastRoot, Node>)}
   */
  (
    /**
     * @param {Processor|Parser} destination
     */
    function (destination) {
      return destination && 'run' in destination
        ? bridge(destination)
        : mutate(destination)
    }
  )

export default rehypeRetext

/**
 * Mutate-mode.
 * Further transformers run on the nlcst tree.
 *
 * @type {import('unified').Plugin<[Parser], HastRoot, Node>}
 */
function mutate(parser) {
  if (!parser) {
    throw new Error(
      'Expected `parser` (such as from `retext-english` or `parse-english`) or `processor` (a unified pipeline) as `options`'
    )
  }

  // Assume the parser is a retext parser.
  const Parser = /** @type {ParserInstance|ParserConstructor} */ (parser)
  return (node, file) => toNlcst(node, file, Parser)
}

/**
 * Bridge-mode.
 * Runs the destination with the new nlcst tree.
 *
 * @type {import('unified').Plugin<[Processor], HastRoot>}
 */
function bridge(destination) {
  return (node, file, next) => {
    // Assume the parser is a retext parser.
    const Parser = /** @type {ParserInstance|ParserConstructor} */ (
      destination.freeze().Parser
    )

    destination.run(toNlcst(node, file, Parser), file, (error) => {
      next(error)
    })
  }
}
