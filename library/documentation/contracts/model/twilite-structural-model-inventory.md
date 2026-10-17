# Twilite Structural Model Inventory

Status: working inventory for current authoring. Settled rules are normative for new graphs. Items marked provisional are implementation targets, not law.

## Identity and containment

- A `.node` document is a graph: a bounded authored contribution with its own nodes, edges, settings, and save address.
- The `root` owns graph identity and intent. `data.identity.graphId` identifies the graph contribution; `data.identity.nodeId` identifies the semantic node that contribution represents when a node spans several graph documents.
- A workspace is a graph-level composition. It stores durable graph or exposed-Surface references plus arrangement and camera state; it does not copy every child graph into the workspace document.

## Node rendering

- Nodes render through ordered `face` nodes. Durable material belongs to `content`; a face may own `data.content` directly or point to a content node.
- The `root` is the implicit root Port. New graphs do not add a second root Port node.
- A `surface` edge starts each Surface chain. `next-face` edges order faces from richest to smallest, and the chain ends in a `glyph`.
- A graph may expose sparse faces. Missing smaller bands use the nearest authored face; do not create Detail, Summary, and Icon faces merely to fill bands.
- A `ground` edge anchors entry, focus, and authored interface geometry when the graph has an inside frame. A document graph may omit ground.
- Focus affects interaction and camera scope. It does not silently change semantic identity or rewrite the graph.

## Ports, Portals, Bridges, and edges

- A Port exposes a typed capability or named Surface at a node boundary. Handles are draggable UI representations of Ports; edges connect to semantic ports.
- A Portal consumes or follows an exposed Port and never creates an ordinary node merely because it was followed.
- An authored edge belongs to one graph document and connects nodes through explicit Port ids. Edge kind is stored in `type`; class graph in `data.classRef`.
- Export and import nodes are Bridge ends. A Bridge is the workspace connection and is not authored as a `bridge` node.
- Workspace navigation policy (`navigate`, `expand`, `open alongside`) is independent of security classification.

## Presentation geometry

- Graph extent, the root-to-ground interface frame, Surface bounds, and internal graph camera are distinct values.
- Node `width` and `height` size the node shell in its owning graph.
- The authored root-to-ground frame is the graph-backed node's shape in a workspace. Its border, hit area, Minimap window, edge apertures, and semantic-zoom measurement share those bounds.
- An unfocused graph-backed node clips nodes and edges outside that frame. Authors enlarge or reshape the frame when that material must appear in the node or its Minimap representation.
- Workspace zoom scales the authored shape and uses its resulting screen occupancy to choose semantic representation.
- A focused graph unfolds the complete source graph. Camera rollover may then transfer control into graph-local scope; neither operation enlarges the authored workspace shape.
- The active graph's main minimap is a navigation instrument over the complete graph.
- A deliberate workspace resize is an arrangement-local viewport override. It does not move source nodes or change graph extent.

## Remaining model gaps

### P0 — Face fitting and camera rollover

Define:

- whether a face uses responsive, contain, cover, or fixed-aspect fitting;
- exact hysteresis and anchor rules when zoom crosses between workspace and graph-local camera scope.

### P0 — Edge lanes

Define lane identity, ownership, allocation, routing, editing, projection across graph/workspace seams, persistence, and interaction with manual route pins. See [Edge Lane Contract](../edges/edge-lane-contract.md).

### P1 — Current-graph conformance and migration

Create an executable profile that distinguishes valid current graphs, valid legacy graphs readable through compatibility, incomplete graphs missing required identity or presentation, and mechanical migrations from legacy inline Port presentation and duplicated root Ports.

## Rewrite rule

Do not bulk-normalize graphs by shape alone. For each graph:

1. preserve `graphId`, `nodeId`, durable address, and semantic type;
2. identify its root, Surfaces, faces, glyphs, exposed Ports, Portals, Bridges, and typed edges;
3. separate graph extent from presentation geometry;
4. migrate only rules marked settled above;
5. defer render-size and lane rewrites until their provisional contracts are ratified;
6. validate save/reload, navigation, semantic zoom, and edge endpoint integrity.
