'use strict'

var hast2nlcst = require('hast-util-to-nlcst')

module.exports = rehype2retext

// Attacher.
// If a destination processor is given, runs the destination with the new nlcst
// tree (bridge-mode).
// If a parser is given, returns the nlcst tree: further plugins run on that
// tree (mutate-mode).
function rehype2retext(destination) {
  var fn = destination && destination.run ? bridge : mutate
  return fn(destination)
}

// Mutate-mode.
// Further transformers run on the nlcst tree.
function mutate(parser) {
  return transformer
  function transformer(node, file) {
    return hast2nlcst(node, file, parser)
  }
}

// Bridge-mode.
// Runs the destination with the new nlcst tree.
function bridge(destination) {
  return transformer
  function transformer(node, file, next) {
    var Parser = destination.freeze().Parser
    var tree = hast2nlcst(node, file, Parser)

    destination.run(tree, file, done)

    function done(err) {
      next(err)
    }
  }
}
