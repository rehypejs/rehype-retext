/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module rehype:retext
 * @fileoverview Bridge / mutate from rehype to retext.
 */

'use strict';

/* Dependencies */
var hast2nlcst = require('hast-util-to-nlcst');

/* Expose. */
module.exports = rehype2retext;

/**
 * Attacher.
 * If a destination processor is given, runs the destination
 * with the new NLCST tree (bridge-mode).
 * If a parser is given, returns the NLCST tree: further
 * plug-ins run on that tree (mutate-mode).
 *
 * @param {Unified} origin - Origin processor.
 * @param {Unified|Function} destination - Destination,
 *   processor or NLCST parser constructor.
 * @return {Function} - Transformer.
 */
function rehype2retext(origin, destination) {
  var fn = destination && destination.run ? bridge : mutate;
  return fn(destination);
}

/**
 * Mutate-mode.  Further transformers run on the NLCST tree.
 *
 * @param {Function} parser - NLCST Parser.
 * @return {NLCSTNode} - Tree.
 */
function mutate(parser) {
  return transformer;
  function transformer(node, file) {
    return hast2nlcst(node, file, parser);
  }
}

/**
 * Bridge-mode.  Runs the destination with the new NLCST
 * tree.
 *
 * @param {Unified} destination - Destination processor.
 * @return {Function} - Transformer.
 */
function bridge(destination) {
  return transformer;
  function transformer(node, file, next) {
    var tree = hast2nlcst(node, file, destination.Parser);

    destination.run(tree, file, function (err) {
      next(err);
    });
  }
}
