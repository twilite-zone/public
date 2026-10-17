# Graph-Native Node Composition Contract

This is the current write-new authoring model for graph-backed Twilite nodes. Older graphs remain readable, but new mutations use the roles and relationships below.

## Structural roles

- A `root` is the one node a graph begins from. It owns graph identity, intent, authority, Surfaces, and the implicit root Port.
- A `port` is an additional named connection endpoint. Its `label` is its authored public name.
- A `face` is a renderable presentation in a Surface. Faces are ordered from richest to smallest by `next-face` edges.
- A `content` node owns durable material through `data.content.kind` and `data.content.value`.
- A `glyph` node defines symbolic identity at the end of a Surface chain. It is not a face.
- A `ground` edge points from the root to the graph's authored inside frame. Document graphs may omit it.
- A `portal` consumes an exposed Port or follows a declared Surface in another graph.
- An `import` or `export` is one end of a Bridge. A Bridge is the workspace connection, not a stored bridge node.

## Root contract

A new graph starts with one root and its identity and intent payloads:

```json
{
  "type": "root",
  "data": {
    "identity": {
      "graphId": "example-graph",
      "name": "Example Graph",
      "version": "0.1.0",
      "description": "A small graph."
    },
    "intent": { "kind": "graph", "scope": "local" },
    "root": { "kind": "graph", "defaultSurfaceId": "default" }
  }
}
```

The root is the implicit root Port. Do not create a second root Port node. Author one `surface` edge for each Surface, an optional `ground` edge for the inside frame, and `exposes-port` edges only when additional named interfaces are needed.

## Surface and face contract

A Surface is an ordered chain:

1. a `surface` edge leaves the root and targets the first `face`;
2. each additional face follows through a `next-face` edge from `sequence-out` to `sequence-in`;
3. the final face points to a `glyph` through the same chain relationship.

One face is enough. Add another only when it conveys a useful smaller representation. Do not manufacture Detail, Summary, and Icon faces merely to fill named bands. The resolver uses the nearest authored face as the workspace becomes smaller.

The root-to-ground geometry defines the authored interface frame when a graph has ground. Size that frame to include material that must remain visible in unfocused rendering and the Minimap representation. The active graph's main minimap covers the complete graph and is a navigation instrument.

## Face and content contract

A face may own `data.content` directly or point to a content node through an authored relationship. A content node stores material like this:

```json
{
  "type": "content",
  "data": {
    "content": {
      "kind": "markdown",
      "value": "# Authored material"
    }
  }
}
```

Use `kind` values such as `markdown`, `html`, `svg`, `text`, `json`, or `image`. Do not add `renderShape` hints or create format-specific Markdown/SVG node types; `content.kind` is authoritative.

## Port and Bridge contract

A Port exposes a typed capability or named Surface at a node boundary. Edges connect to semantic ports, never directly to UI handles. Handles are optional visual affordances and are not stored endpoints.

A named Port becomes externally connectable only through an `exposes-port` edge from the root. A Portal consumes that exposed Surface. Cross-graph authority uses `import` and `export` nodes plus a Bridge; do not create a `bridge` node.

## Relationship authority

Relationships define meaning:

- `surface`
- `next-face`
- `ground`
- `exposes-port`
- `invokes`
- `imports` and `exports`

Edges store their kind in `type`, class graph in `data.classRef`, and endpoints in `sourcePort` and `targetPort`. `sourceHandle` and `targetHandle` are runtime compatibility copies and are not written.

## Agent checklist

Before calling a graph or template current:

1. Start from one root with real identity, intent, and root payloads.
2. Supply at least one Surface edge to a face; end each Surface in a glyph.
3. Add ground only when the graph has an authored inside frame.
4. Give faces owned content or an explicit content relationship.
5. Add named ports and imports/exports only when the graph needs those interfaces.
6. Validate edge endpoints, save/reload behavior, navigation, and semantic zoom.
7. Preserve legacy fields only for reading; write the current model.
