# Twilite guide: reference

Read this page only when nothing is open and you must write a whole new graph from scratch (a root, its faces and a glyph), or when the user asks for custom node classes, portals, bridges or Methods. For ordinary requests the core page and one recipe are enough.

Canonical language specs: `tlz://twilite.zone/library/primitives/root.node`; authoring form: `tlz://twilite.zone/library/primitives/specification/root.node`. Semantic responsibility is separate from node/edge/chain encoding. Specs distinguish agreed contracts, implementation evidence, known gaps and open decisions; structural validation alone does not prove runtime behavior.

## Current vocabulary

These are the words to write in new graphs. Older files remain readable, but their older names are compatibility material and must not be copied into new mutations.

| Current word | Meaning | Stored form |
|---|---|---|
| **root** | The one node a graph begins from. It owns graph identity, intent, and exposed surfaces. | node `type: "root"`; identity in `data.identity`; graph kind in `data.intent.kind` |
| **face** | One authored way a node or graph looks. Faces are ordered from richest to smallest. | node `type: "face"`; ordered by `next-face` edges |
| **content** | Durable material shown by a face or held on its own. | node `type: "content"`; `data.content = { kind, value }` |
| **glyph** | The symbolic mark at the end of a Surface chain. It is not a face. | node `type: "glyph"` |
| **ground** | The graph's authored inside frame, when it has one. A document graph may have no ground. | `ground` edge from the root's `ground` port |
| **property** | One named value on a node. | node `type: "property"`; it announces `property.changed` |
| **port** | A named connection endpoint. The root is the graph's implicit root Port. | node `type: "port"`; edges end at named ports |
| **portal** | A consumer or opening that follows an exposed Port in another graph. | node `type: "portal"` |
| **import / export** | The two ends of a Bridge. An import uses what an export offers. | node `type: "import"` or `type: "export"`; one record in `data.bridge` |
| **Bridge** | The connection between an export and the import that uses it. | workspace connection; not a stored bridge node |
| **next-face** | The edge that orders one face before the next face in a Surface. | edge `type: "next-face"` |
| **invokes** | The edge from an event source to a Method. | edge `type: "invokes"`; events do not use Event Handler nodes |

Edges store their kind in `type`, their class graph in `data.classRef`, and their endpoints in `sourcePort` and `targetPort`. `sourceHandle` and `targetHandle` are runtime compatibility copies and are not written. Graph metadata does not duplicate the root's name or description. Groups, Graph Reference, Markdown/SVG node types, Event Handler, `listens`, and the old per-view relationship names are retired for write-new work.

- A **root** carries identity (`graphId`, `name`, `version`, `description`) and intent (`kind`, `scope`). It points at Surfaces, an optional ground, and exposed Ports through typed edges.
- A **Surface** is one ordered chain of faces, richest first, ending in a glyph. Twilite uses the nearest available face as the workspace becomes smaller; do not manufacture Detail, Summary, and Icon faces just to fill bands.
- **Content** carries markdown, html, svg, text, json, or image values. A face may own `data.content` or delegate to a content node.
- **A face is how the graph looks from outside**, in a workspace at a distance. It is not shown on the canvas while the person works inside the graph. So what the person should read inside the graph, such as an overview, a summary or notes, goes in a `content` node on the canvas, never only in a face.
- **Ports** are named connection points. **Portals** open into another graph's exposed surfaces. Graphs can only use what other graphs choose to expose.
- **Properties** hold functional data inside the graph. They are never for the graph's own title or kind; those belong to the root.
- **Methods** are the executable primitive. A property or other event source runs a Method only through an authored `invokes` edge in the same graph.

## Authoring a new graph (write-new rules)

A current graph is a root plus the things it points at.

Root relationships. Each is an edge from the root, where `sourcePort` is the relationship name and `targetPort` is `root`:

| `sourcePort` | Purpose | Required | Repeatable |
|---|---|---|---|
| `surfaces` | the first face of one Surface (a chain of faces that ends in a glyph) | yes, at least one | yes |
| `ground` | where entry and focus land inside the graph; its geometry with the root defines the authored frame | optional | no |
| `exposes-port` | an additional named Port offered to other graphs | no | yes |

A Surface is a chain: a `surface` edge (usually from the root's `surfaces` port) points at its first face; each face points at the next with a `next-face` edge (`sourcePort` `sequence-out`, `targetPort` `sequence-in`); the last face points at the `glyph` node with the same kind of edge, but a glyph has one port, `root`, so that edge's `targetPort` is `root`, not `sequence-in`. Every Surface begins with a face and ends with a glyph. A document graph may omit ground when its first face is the page. Older graphs use declaration, View, landing-surface, and per-view relationship names; they still load, but do not write them.

Do:

- Start from one `root` with `identity`, `intent`, and at least one `surface` edge. The root is the implicit root Port; never add a second root Port node.
- Put graph title in `root.data.identity.name` and graph kind in `root.data.intent.kind`. Do not create standalone `title` or `type` nodes for the graph itself.
- Put material in `content` nodes (`data.content = { "kind": "markdown", "value": "..." }`) or directly in a face's `data.content`.
- Give the `surface` edge `type` `surface` and a `data.surfaceId`. Give each chain edge `type` `next-face`. Give the ground edge `type` `ground` from the root's `ground` port when the graph has an authored inside frame. The root's exposed named ports use `exposes-port` edges, commonly from its `port` port.
- One face is enough for a Surface. Add another face only when it shows something different at a smaller scale.
- Keep the first version small and legible; grow it in later transactions.

Do not, in new graphs:

- add new `markdown` or `svg` node types (they are retired; use `content` with the matching `kind`)
- add `renderShape` hints, four-side handles, inline Port presentation, or a duplicate root Port
- invent schemas for view fitting, camera behavior, or edge lanes (these are still being designed)
- copy shapes out of older graphs just because they exist; older graphs stay readable, new graphs use the model above

### A complete starter you can adapt

This is a valid new graph: one root, one Surface (a face followed by a glyph), and a ground with an SVG diagram.

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "createNodes",
      "nodes": [
        {
          "id": "3f6c1a52-8d47-4b0e-9a1c-2e5f7b8d9c01",
          "type": "root",
          "label": "Launch Plan",
          "position": { "x": 0, "y": 0 },
          "width": 360,
          "height": 240,
          "data": {
            "identity": {
              "graphId": "launch-plan",
              "name": "Launch Plan",
              "version": "0.1.0",
              "description": "A small plan for shipping the first release."
            },
            "intent": { "kind": "plan", "scope": "local" },
            "root": { "kind": "graph", "defaultSurfaceId": "default" }
          }
        },
        {
          "id": "7a9d2b64-1c3e-4f85-8b06-4d7e9f0a1b02",
          "type": "face",
          "label": "Plan",
          "position": { "x": -540, "y": 0 },
          "width": 440,
          "height": 320,
          "visible": true,
          "showLabel": true,
          "style": {
            "background": "#111827",
            "color": "#e5e7eb",
            "borderColor": "#38bdf8",
            "borderWidth": 2,
            "borderStyle": "solid",
            "borderRadius": 20
          },
          "data": {
            "content": {
              "kind": "markdown",
              "value": "# Launch Plan\n\n1. Freeze scope\n2. Ship the beta\n3. Collect feedback\n\n**Goal:** a calm, boring launch."
            }
          }
        },
        {
          "id": "b2c4e6f8-0a1b-4c3d-8e5f-6a7b8c9d0e03",
          "type": "content",
          "label": "Overview",
          "position": { "x": 540, "y": 0 },
          "width": 440,
          "height": 280,
          "visible": true,
          "showLabel": true,
          "data": {
            "altText": "Three stages connected by arrows: Scope, Beta, Launch.",
            "content": {
              "kind": "svg",
              "value": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 160' width='100%' height='100%' preserveAspectRatio='xMidYMid meet' role='img' aria-label='Scope to Beta to Launch'><rect width='400' height='160' rx='18' fill='#0f172a'/><circle cx='70' cy='80' r='30' fill='#38bdf8'/><circle cx='200' cy='80' r='30' fill='#a78bfa'/><circle cx='330' cy='80' r='30' fill='#34d399'/><path d='M104 80h62M234 80h62' stroke='#f8fafc' stroke-width='5' stroke-linecap='round'/><text x='70' y='134' fill='#cbd5e1' font-size='14' text-anchor='middle'>Scope</text><text x='200' y='134' fill='#cbd5e1' font-size='14' text-anchor='middle'>Beta</text><text x='330' y='134' fill='#cbd5e1' font-size='14' text-anchor='middle'>Launch</text></svg>"
            }
          }
        },
        {
          "id": "c3d5f7a9-1b2c-4d4e-9f60-7b8c9d0e1f04",
          "type": "glyph",
          "label": "Launch Glyph",
          "position": { "x": 0, "y": -320 },
          "width": 220,
          "height": 140,
          "data": { "glyph": { "kind": "icon", "name": "Checklist" } }
        }
      ]
    },
    {
      "action": "createEdges",
      "edges": [
        {
          "id": "d4e6a8b0-2c3d-4e5f-a071-8c9d0e1f2a05",
          "type": "surface",
          "source": "3f6c1a52-8d47-4b0e-9a1c-2e5f7b8d9c01",
          "target": "7a9d2b64-1c3e-4f85-8b06-4d7e9f0a1b02",
          "sourcePort": "surfaces",
          "targetPort": "root",
          "data": { "surfaceId": "default" }
        },
        {
          "id": "a7b9d1e3-5f60-4182-b3a4-1f2a3b4c5d08",
          "type": "next-face",
          "source": "7a9d2b64-1c3e-4f85-8b06-4d7e9f0a1b02",
          "target": "c3d5f7a9-1b2c-4d4e-9f60-7b8c9d0e1f04",
          "sourcePort": "sequence-out",
          "targetPort": "root",
          "data": {}
        },
        {
          "id": "b8c0e2f4-6071-4293-84b5-2a3b4c5d6e09",
          "type": "ground",
          "source": "3f6c1a52-8d47-4b0e-9a1c-2e5f7b8d9c01",
          "target": "b2c4e6f8-0a1b-4c3d-8e5f-6a7b8c9d0e03",
          "sourcePort": "ground",
          "targetPort": "root",
          "data": {}
        }
      ]
    }
  ]
}
```

The nodes come first and the edges second because edges must reference nodes that already exist.

## Growing a graph

- **More rungs:** add faces to the chain, between the first face and the glyph, when they show something different at a smaller size. **More Surfaces:** add another `surface` edge with its own `surfaceId`, its own chain, and its own glyph, for a genuinely different presentation. Add an `exposes-port` edge to expose an additional named Port.
- **Opening another graph:** use a `portal`. It carries a `data.target` with an `endpoint` (an address plus `:portId`), `mode: "navigate"`, and `ref`, plus `data.authority: "navigate"`. Copy the shape from an existing portal in the graph when one exists rather than inventing it.
- **Functional data:** use `property` nodes (`name`, `valueType`, `value`), not the root.
- **Existing graphs written in older shapes:** do not "clean them up" as a side effect. Preserve `graphId`, node ids, addresses, and semantic types, and migrate only when the user asks.

## Using the app, and when things go wrong

- Prefer the browser surface as the default starting point, and prefer address-bar and browser-chrome actions in instructions. Do not assume the editor toolbar is available; send users to editor-only features only when the task requires authoring.
- If a user says they are signed in but GitHub installations vanished, repos are empty, or GitHub save stopped: do not assume anything was removed from GitHub, and do not call it a generic save failure. The GitHub provider session has most likely expired while the Twilite account session stayed alive. Say "GitHub linked but provider session expired" and tell them to reconnect GitHub inside Twilite.

## Advanced: custom node classes, Methods, bridges

Only when the user asks. A **fragment** is a piece of one node kept in its own file: a `fragment` node stands in for the other piece and draws a face of it, and expanding it brings that piece's nodes into the graph. Its code and Bridges stay withheld unless the stand-in's `data.target.allow` grants them. An event reaches another open graph only across a Bridge: the export lists the events it offers and the import lists the ones it shows. A node type is not activated by being named in `dependencies.nodeTypes`; a class needs an `import` to its `.node-class.node` reference with `scope: "focused-graph"` and `grants: ["create"]`. Store the instance's class as its `type` plus `data.classRef`; `_classBinding` is a loaded compatibility copy and is not written. Methods are supplied through an import when a template exposes them. A Method's source is an opaque string after JSON parsing: keep it valid JSON-escaped and never invent runtime authority. If you cannot satisfy a contract, say so instead of inventing partial syntax.

For the full contracts, read `contracts/nodes/graph-native-node-composition.md` and `contracts/model/twilite-structural-model-inventory.md`. They are authoritative when anything here is unclear.
