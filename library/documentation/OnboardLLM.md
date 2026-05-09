# Twilite LLM Onboarding Guide (Current Capability)

Twilite is a persistent graph workspace. The graph is state. Mutate it with small, explicit deltas.

---

## 1) Non-Negotiable Rules

- Never replace an existing graph with full `nodegraph-data` unless user explicitly asks to reset.
- Use action commands only: `createNodes`, `createEdges`, `updateNode`, `updateNodes`, `delete`, `move`, `translate`, `transaction`.
- In transactions: create nodes first, then edges.
- Use unique RFC4122 UUID v4 IDs (hex only).
- Prefer `updateNode` / `updateNodes` over delete+recreate to preserve IDs/history.

---

## 2) New Graph Minimum

When creating a new graph, include this system node:

1. `declaration` (or legacy `manifest` only when repairing older graphs)

Do not create a `dictionary` by default.

Custom class authority should enter a graph through visible `bridge` nodes. If no class is bridged in, the graph should stay primitive and explicit rather than silently inventing dictionary registration.

Notes:
- Built-in node types (`declaration`, `manifest`, `dictionary`, `markdown`, `script`, `port`, `view`, `api`) do not need dictionary entries.
- The Legend panel is derived; do not seed a graph-local `legend` node in new graphs just to make creation work.
- Legacy graphs may still contain dictionaries, but new graphs should not seed them unless the user explicitly asks for legacy support.
- Runtime now prefers this authority order:
  1. local `_classBinding`
  2. bridge-derived registry state
  3. legacy dictionary fallback
- Unknown custom node types should fail visibly through shared error surfaces, not by inventing dictionary registration.

---

## 3) Canonical Data Shapes

### Declaration (recommended shape)

Use this structure to stay compatible with current editor/validator behavior:

- `data.identity`: `graphId`, `name`, `version`, `description`, `createdAt`, `updatedAt`
- `data.intent`: `kind`, `scope`
- `data.dependencies`: `nodeTypes`, `portContracts`, `skills`, `schemaVersions`, `optional`
- `data.authority`: `mutation`, `actors`, `styleAuthority`, `history`
- `data.document`: `url`
- `data.settings`: defaults (theme/background/layout/github/autoSave)

### Dictionary (legacy only)

Do not create by default.

Only use a dictionary when you are intentionally maintaining or repairing older graphs that still depend on legacy `nodeDefs` / `views` support.

Treat it as:
- compatibility fallback
- optional inspectable projection
- not sovereign runtime authority for new graph authoring

---

## 4) Edges and Ports

Required for edge mutations:

- `id`, `source`, `target`, `sourcePort`, `targetPort`, `type`

Rules:

- `source`/`target` must exist.
- `sourcePort`/`targetPort` must exist on nodes.
- `root` is treated as a valid virtual port.
- Prefer explicit ports (`in`/`out`) for functional flow.
- Use a known edge type; safe default in Twilite task/doc graphs is usually `reference`.

---

## 5) Common Failure Modes

- Duplicate edge IDs in one payload.
- Invalid UUIDs (non-hex chars).
- Custom node type declared in graph dependencies but missing a visible bridge-based authority path.
- Using stale dictionary-first guidance on new graphs.
- Creating fresh dictionary infrastructure when a visible bridge would provide the class authority directly.
- Missing `sourcePort`/`targetPort`.
- Inventing generic commands like `update` instead of using `updateNode` / `updateNodes`.
- Using `updateNode` with the wrong shape. The valid form is:
  - `{"action":"updateNode","id":"node-id","updates":{...}}`
  - or `{"action":"updateNodes","ids":["a","b"],"updates":{...}}`

---

## 6) Command Template (Safe Starter)

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "createNodes",
      "nodes": [
        {
          "id": "11111111-1111-4111-8111-111111111111",
          "type": "declaration",
          "label": "Declaration",
          "position": { "x": -520, "y": -220 },
          "width": 420,
          "height": 280,
          "data": {
            "identity": {
              "graphId": "starter-graph",
              "name": "Starter Graph",
              "version": "0.1.0",
              "description": "Starter graph",
              "createdAt": "2026-02-22T00:00:00.000Z",
              "updatedAt": "2026-02-22T00:00:00.000Z"
            },
            "intent": { "kind": "graph", "scope": "foundation" },
            "declaration": {
              "kind": "graph",
              "targetMode": "artifact",
              "artifactKind": "graph",
              "graphViewRole": "authoring",
              "defaultSurfaceId": "view",
              "surfaces": [
                {
                  "id": "view",
                  "kind": "view",
                  "label": "View",
                  "memo": "Default human-facing graph surface.",
                  "exposes": {
                    "views": { "mode": "allow" },
                    "declarations": { "mode": "allow" }
                  }
                }
              ]
            },
            "dependencies": {
              "nodeTypes": ["declaration", "markdown"],
              "portContracts": ["core"],
              "skills": [],
              "schemaVersions": { "nodes": ">=1.0.0", "ports": ">=1.0.0" },
              "optional": []
            },
            "authority": {
              "mutation": {
                "allowCreate": true,
                "allowUpdate": true,
                "allowDelete": true,
                "appendOnly": false
              },
              "actors": { "humans": true, "agents": true, "tools": true },
              "styleAuthority": "descriptive",
              "history": { "rewriteAllowed": false, "squashAllowed": false }
            },
            "document": { "url": "" },
            "settings": {
              "theme": null,
              "backgroundImage": null,
              "defaultNodeColor": "#1976d2",
              "defaultEdgeColor": "#666666",
              "snapToGrid": false,
              "gridSize": 20,
              "edgeRouting": "auto",
              "github": { "repo": "", "path": "", "branch": "main" },
              "autoSave": false
            }
          }
        },
        {
          "id": "44444444-4444-4444-8444-444444444444",
          "type": "markdown",
          "label": "Start Here",
          "position": { "x": 40, "y": -40 },
          "width": 420,
          "height": 240,
          "ports": [
            { "id": "in", "label": "In", "direction": "input", "dataType": "any", "position": { "side": "left", "offset": 0.5 } },
            { "id": "out", "label": "Out", "direction": "output", "dataType": "any", "position": { "side": "right", "offset": 0.5 } }
          ],
          "data": {
            "markdown": "# Twilite Starter\n\nThis graph is valid and ready for extension."
          }
        }
      ]
    },
    {
      "action": "createEdges",
      "edges": [
        {
          "id": "66666666-6666-4666-8666-666666666666",
          "source": "11111111-1111-4111-8111-111111111111",
          "sourcePort": "root",
          "target": "44444444-4444-4444-8444-444444444444",
          "targetPort": "in",
          "type": "relates"
        }
      ]
    }
  ]
}
```

---

## 7) Behavior When Unsure

- Do not guess schema.
- Ask for missing constraints.
- Prefer warnings over destructive auto-fixes.
- Keep diffs small and reversible.
