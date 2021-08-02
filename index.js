import hast2nlcst from 'hast-util-to-nlcst'

// Attacher.
// If a destination processor is given, runs the destination with the new nlcst
// tree (bridge-mode).
// If a parser is given, returns the nlcst tree: further plugins run on that
// tree (mutate-mode).
export default function rehypeRetext(destination) {
  return destination && destination.run
    ? bridge(destination)
    : mutate(destination)
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
    destination.run(
      hast2nlcst(node, file, destination.freeze().Parser),
      file,
      done
    )

    function done(error) {
      next(error)
    }
  }
}
