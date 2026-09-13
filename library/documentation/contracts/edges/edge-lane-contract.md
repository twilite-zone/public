# Edge Lane Contract

Status: provisional design contract. This records the gap and constrains implementation experiments; it is not yet a persisted-schema requirement.

## Purpose

An edge lane is a presentation-space corridor used to keep several ordinary typed edges legible. A lane does not create a new relationship, split an edge, change its class, or become a semantic graph primitive.

## Proposed ownership

- The edge owns its semantic identity, endpoints, direction, type, and class.
- The graph View owns lane layout inside that View.
- A workspace View owns lane layout between graph-nodes.
- The router derives lane assignment unless an authored layout override exists.
- Route pins constrain a particular edge path. They do not define a reusable lane.

## Proposed behavior

- Parallel edges receive deterministic, stable lane ordering.
- Typed edge appearance remains identical whether the edge is drawn inside a graph or projected in a workspace.
- A cross-graph edge uses graph-local routing up to its exposed boundary, workspace routing between graph-nodes, and graph-local routing after entry. These are render segments of one logical edge.
- Semantic zoom may simplify a route, but must preserve endpoints, direction, type, class, selection, and logical identity.
- Moving or resizing nodes may recompute derived lanes without dirtying semantic graph data.
- An authored lane override, if supported, belongs under edge layout metadata and must survive save/reload.

## Open decisions

1. Is a lane named and reusable, or only an integer/order derived per routing region?
2. Does `data.layout.lane` mean a stable preference, a hard assignment, or legacy renderer metadata?
3. Which object identifies a routing region: graph View, group, workspace, or a future routing surface?
4. How are lane conflicts resolved after nodes move or graphs collapse?
5. When does a manual route pin override a lane, and when may a lane move the unpinned portions?
6. Which lane information, if any, is semantic enough to persist in the graph document?

## Current implementation boundary

Twilite currently has `layout.edgeLaneGapPx`, renderer-local lane offsets, stable bridge aperture spacing, and layout-preserving route pins. These mechanisms improve rendering but do not yet constitute the contract above.

Agents must not invent lane nodes, split an authored edge into several stored edges, or assign durable lane ids until the open decisions are resolved.
