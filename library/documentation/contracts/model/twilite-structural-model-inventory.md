# Twilite Structural Model Inventory

Status: working inventory for current authoring. Settled rules are normative for new graphs. Items marked provisional are implementation targets, not law.

## Identity and containment

- A `.node` document is a graph: a bounded authored contribution with its own nodes, edges, settings, and save address.
- A Declaration identifies what the graph contributes. `identity.graphId` identifies the graph contribution; `identity.nodeId` identifies the semantic node that contribution represents.
- Several graph documents may contribute to one semantic node by sharing `nodeId`. Their graph-local node ids remain distinct.
- A workspace is a graph-level composition. It stores durable graph or exposed-surface references plus arrangement and camera state; it does not copy every child graph into the workspace document.

## Node rendering

- Nodes render through Views. Durable material belongs to Content; a View owns or delegates to that Content.
- A Declaration is the implicit root Port. New graphs do not add a second root Port node.
- A Declaration's landing surface anchors entry, focus, and authored interface geometry.
- A graph may expose a sparse View collection. Detail, Summary, and Icon are useful roles, not a requirement to author three separate View nodes.
- One View may serve several roles through declaration relationships.
- Semantic zoom selects among Views that actually exist. A missing band uses the nearest authored View. When no authored View is usable, the graph falls back to its graph-local Minimap and then its Glyph at the smallest representation.
- Focus affects interaction and camera scope. It does not silently change semantic identity or rewrite the graph.

## Ports, Portals, Bridges, and edges

- A Port exposes a typed capability or named surface at a node boundary. Handles are draggable UI representations of Ports; edges connect to Ports.
- A Portal consumes or follows an exposed Port. It is a relationship endpoint to another node and never creates an ordinary node merely because it was followed.
- An authored edge belongs to one graph document and connects nodes through explicit Port ids.
- Cross-graph connectivity is stored by the owning graph declarations as edge references and projected into a workspace as one ordinary typed edge.
- Export Bridges expose structural capability. Import Bridges consume it and must be backed by the corresponding incoming edge. Unconnected import-looking creation affordances are Ports, not Bridges.
- Bridge plumbing may be visible while editing and hidden while browsing. Its projected workspace edge retains the ordinary edge type and class.
- Workspace navigation policy (`navigate`, `expand`, `open alongside`) is independent of security classification.

## Presentation geometry

- Graph extent, graph-node frame, semantic View bounds, and internal graph camera are distinct values.
- Node `width` and `height` size the node shell in its owning graph.
- The authored interface frame is the graph-backed node's shape in a workspace. Its border, hit area, Minimap View window, edge apertures, and semantic-zoom measurement share those bounds.
- An unfocused graph-backed node clips nodes and edges outside that frame. Authors enlarge or reshape the interface frame when that material must appear in the node or its Minimap representation.
- Workspace zoom scales the authored shape and uses its resulting screen occupancy to choose semantic representation.
- Focus may unfold the complete source graph and transfer camera control into graph-local scope; it does not enlarge the unfocused workspace shape.
- The active graph's main minimap is a navigation instrument over the complete graph. It is not clipped to the authored interface frame.
- A deliberate workspace resize is an arrangement-local viewport override. It does not move source nodes or change graph extent.

The landing surface and Declaration geometry currently author the interface frame. View fitting policy and detailed graph-camera behavior remain provisional. Do not rewrite source node positions to make a workspace preview fit.

## Remaining model gaps

### P0 — View fitting and camera rollover

Define:

- whether a View uses responsive, contain, cover, or fixed-aspect fitting;
- the exact hysteresis and anchor rules when zoom crosses between workspace and graph-local camera scope.

### P0 — Edge lanes

Define lane identity, ownership, allocation, routing, editing, projection across graph/workspace seams, persistence, and interaction with manual route pins. See [Edge Lane Contract](../edges/edge-lane-contract.md).

### P1 — Current-graph conformance and migration

Create an executable profile that distinguishes:

- valid current graphs;
- valid legacy graphs readable through compatibility;
- incomplete graphs missing required identity, root exposure, or renderable presentation;
- mechanical migrations from legacy inline Port presentation and duplicated root Ports.

### P1 — View-role normalization

Relationship authority is the write-new rule, while the loader still accepts payload and `semanticLevel` hints. Define deterministic normalization and diagnostics so an authored View cannot silently acquire conflicting roles.

## Rewrite rule

Do not bulk-normalize graphs by shape alone. For each graph:

1. preserve `graphId`, `nodeId`, durable address, and semantic type;
2. identify its Declaration, implicit root, landing surface, Views, Glyph, exposed Ports, Portals, Bridges, and typed edges;
3. separate graph extent from presentation geometry;
4. migrate only rules marked settled above;
5. defer render-size and lane rewrites until their provisional contracts are ratified;
6. validate save/reload, navigation, semantic zoom, and edge endpoint integrity.
