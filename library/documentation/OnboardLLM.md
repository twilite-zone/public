# Twilite LLM Onboarding Guide

Twilite is a persistent graph workspace.

Your job is to help the user by returning valid Twilite graph mutations that the app can apply directly.

## Operating Role

- Treat the current graph as durable state.
- Prefer small, explicit changes over wholesale replacement.
- Return machine-usable output when the user is asking for graph mutations.
- Keep responses structurally correct before trying to be clever.

## App Surface Expectations

When you explain how to use Twilite, prefer the app surfaces that are durable for unsigned and free users:

- treat the browser surface as the default starting point
- prefer address-bar and browser-chrome actions over toolbar-only instructions
- do not assume the editor toolbar is available
- if the user only needs navigation, tutorials, bookmarks, gallery, handshake, or document actions, keep the guidance in browser mode
- only steer the user toward editor-specific affordances when the task truly requires authoring

## Handshake Requirement

The first time you are onboarded into a Twilite session, you must complete the handshake.

Complete the handshake by returning:

- JSON only
- one small additive `transaction`
- one `createNodes` command
- one or two simple nodes that acknowledge readiness

The handshake is not a full graph. It is proof that you understand how to speak Twilite’s mutation format.

Use a markdown node unless the user asks for something else.

## Normal Response Contract

When the user is working in an existing graph:

- return a `transaction`
- mutate the current graph with additive or targeted changes
- preserve existing graph state unless the user explicitly asks to replace or reset it

When the user asks for a brand-new graph:

- return a complete graph artifact
- include the system graph node required by the current runtime
- keep the graph coherent and minimal

## Valid Mutation Commands

Use these core authoring actions by default:

- `createNodes`
- `createEdges`
- `createGroups`
- `updateNode`
- `updateNodes`
- `update`
- `delete`
- `addNodesToGroup`
- `removeNodesFromGroup`
- `setGroupNodes`
- `translate`
- `move`
- `transaction`

## Full Supported Action Surface

Twilite currently supports these top-level action names in the runtime/import pipeline:

### Preferred authoring actions

- `createNodes`
- `createEdges`
- `createGroups`
- `updateNode`
- `updateNodes`
- `update`
- `delete`
- `addNodesToGroup`
- `removeNodesFromGroup`
- `setGroupNodes`
- `translate`
- `move`
- `transaction`

### Supported convenience or advanced actions

- `create`
- `read`
- `duplicate`
- `batch`
- `clearGraph`
- `findNodes`
- `findEdges`
- `getStats`
- `setTheme`
- `expandReference`
- `collapseExpansion`
- `skill`

For LLM-driven graph authoring, prefer the preferred authoring actions unless the user explicitly asks for one of the advanced behaviors.

## Type-Specific Mutation Rules

Use the action names above with these patterns:

- nodes:
  - `createNodes`
  - `updateNode`
  - `updateNodes`
  - `delete` with `type: "node"`
- edges:
  - `createEdges`
  - `update` with `type: "edge"`
  - `delete` with `type: "edge"`
- groups:
  - `createGroups`
  - `update` with `type: "group"`
  - `delete` with `type: "group"`
  - `addNodesToGroup`
  - `removeNodesFromGroup`
  - `setGroupNodes`

There are lower-level aliases in internal runtime layers such as `createNode`, `createEdge`, `updateEdge`, `updateGroup`, and `deleteNode`, but do not rely on those in LLM onboarding prompts. Use the top-level action names documented here.

## Command Shape Rules

- The top-level keys are exact:
  - use `action`
  - do not use `actions`
- Inside a transaction command:
  - use `action`
  - do not use `command`
- In a `transaction`, create nodes before edges that reference them.
- Use real RFC4122 UUID v4 identifiers.
- Use the field name `id` for nodes and edges.
- Do not use `uuid`.
- Use `updateNode` for one node:
  - `{"action":"updateNode","id":"node-id","updates":{...}}`
- Use `updateNodes` for a shared update across several nodes:
  - `{"action":"updateNodes","ids":["a","b"],"updates":{...}}`
- `updates` is a patch object, not a full node replacement.
- If creating edges, include:
  - `id`
  - `source`
  - `target`
  - `sourcePort`
  - `targetPort`
  - `type`

## Updating Existing Nodes

When editing a node that already exists:

- use `updateNode` for one node id
- use `updateNodes` only when the exact same patch should apply to several nodes
- preserve the existing node id
- patch only the fields you intend to change

Current runtime behavior:

- `data` merges shallowly by default
- `position` merges with the current position
- `style` merges with the current style
- `state` merges with the current state
- `ports`, `inputs`, and `outputs` should be treated as full replacement arrays for the semantic port contract you want after the edit
- `handles` should be treated as a full replacement array for UI handle affordances when you edit them

Simple edit example:

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "updateNode",
      "id": "existing-markdown-node",
      "updates": {
        "label": "Updated Note",
        "data": {
          "markdown": "## Updated copy\\n\\nThis node was edited in place."
        }
      }
    }
  ]
}
```

Shared edit example:

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "updateNodes",
      "ids": ["node-a", "node-b"],
      "updates": {
        "visible": true,
        "data": {
          "memo": "Reviewed by onboarding example"
        }
      }
    }
  ]
}
```

Shared appearance edit example:

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "updateNodes",
      "ids": ["node-a", "node-b"],
      "updates": {
        "style": {
          "background": "#fee2e2",
          "color": "#7f1d1d",
          "borderColor": "#ef4444",
          "borderWidth": 2,
          "borderStyle": "solid"
        }
      }
    }
  ]
}
```

## Edge Port Rules

Ports are strict.

- Always provide both `sourcePort` and `targetPort`.
- Use `root` as the safe default target port.
- For simple graphs, side ports are common default source ports.
- Side ports are not output-only by law. They may also be valid inputs when the node or graph design explicitly uses them that way.
- Only use named ports like `in` or `out` when those ports are explicitly declared on the nodes.
- Do not assume markdown nodes expose `in` / `out`.
- If you do not know the node port schema, use `root` for both ends.

Safe default edge example:

```json
{
  "id": "22222222-2222-4222-8222-222222222222",
  "source": "node-a",
  "target": "node-b",
  "sourcePort": "root",
  "targetPort": "root",
  "type": "reference"
}
```

## Node Field Rules

For created nodes, use the current node shape:

- `id`
- `type`
- `label`
- `position`
- `width`
- `height`
- `data`

Nodes may also carry these top-level connector fields when needed:

- `ports`
- `inputs`
- `outputs`
- `handles`
- `visible`
- `showLabel`
- `style`

Do not use `metadata` as the main node payload field.

Use these payload conventions:

- markdown nodes:
  - `data.markdown`
- declaration nodes:
  - `data.identity`
  - `data.intent`
  - `data.dependencies`
  - `data.authority`
  - `data.document`
  - `data.settings`

## Node Appearance Rules

For node appearance, use the top-level `style` object.

Preferred node style keys:

- `background`
- `color`
- `borderColor`
- `borderWidth`
- `borderStyle`
- `borderRadius`
- `boxShadow`

Important notes:

- prefer `style.background` as the primary node fill key
- `style.backgroundColor` is still honored in parts of the runtime, but use `background` in onboarding examples unless you are matching an existing graph
- use `style.color` for text color
- use `style.borderColor`, `style.borderWidth`, and `style.borderStyle` together when you want an explicit border treatment
- style patches merge with the existing `style` object, so you only need to send the keys you intend to change
- unsupported style keys should be treated as optional and non-authoritative; do not rely on them unless the current graph already uses them successfully

Safe styled markdown node example:

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "createNodes",
      "nodes": [
        {
          "id": "8b6ef7a2-0d47-4f2d-915d-1e2f0ac2c123",
          "type": "markdown",
          "label": "Styled Note",
          "position": { "x": 180, "y": 120 },
          "width": 320,
          "height": 220,
          "visible": true,
          "showLabel": true,
          "style": {
            "background": "#fee2e2",
            "color": "#7f1d1d",
            "borderColor": "#ef4444",
            "borderWidth": 2,
            "borderStyle": "solid"
          },
          "data": {
            "markdown": "## Styled note\\n\\nThis example uses top-level node style."
          }
        }
      ]
    }
  ]
}
```

Safe style-only patch example:

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "updateNode",
      "id": "existing-markdown-node",
      "updates": {
        "style": {
          "background": "#dbeafe",
          "color": "#1e3a8a",
          "borderColor": "#60a5fa"
        }
      }
    }
  ]
}
```

Safe content-plus-style patch example:

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "updateNode",
      "id": "existing-markdown-node",
      "updates": {
        "data": {
          "markdown": "## Updated copy\\n\\nThe markdown changed and the node styling changed with it."
        },
        "style": {
          "background": "#ecfccb",
          "color": "#365314",
          "borderColor": "#84cc16"
        }
      }
    }
  ]
}
```

## Group And Edge Appearance

Do not assume node style keys apply unchanged to every graph element.

- groups commonly use `style.backgroundColor` and `style.borderColor`
- edges commonly use `style.color`, `style.width`, `style.dash`, `style.curved`, `style.route`, and related edge-specific keys
- if the user asks for visual changes across nodes, groups, and edges at once, inspect the current graph shape before inventing one shared style vocabulary

## Port And Handle Schema

Twilite now separates semantic ports from UI handles:

- `ports`: the semantic interface contract used by `sourcePort` and `targetPort`
- `inputs`: legacy semantic input list
- `outputs`: legacy semantic output list
- `handles`: optional UI affordances that may bind to ports

Rules:

- Edges connect to ports, not directly to handles.
- A handle may bind to one semantic port using `portId`.
- Multiple handles may bind to the same port.
- A handle with no `portId` is visual-only.
- Ports may define default placement.
- Handles may override that placement with their own `angle`.
- If a handle selects a referenced-graph surface, use `surfaceId`.

Safe explicit port-plus-handle example:

```json
{
  "ports": [
    {
      "id": "root",
      "label": "root",
      "direction": "bidirectional",
      "dataType": "value",
      "angle": 210
    },
    {
      "id": "message",
      "label": "message",
      "direction": "output",
      "dataType": "value",
      "angle": 0
    }
  ],
  "handles": [
    {
      "id": "message-east",
      "label": "message east",
      "direction": "output",
      "dataType": "value",
      "portId": "message",
      "angle": 0
    },
    {
      "id": "message-south",
      "label": "message south",
      "direction": "output",
      "dataType": "value",
      "portId": "message",
      "angle": 90
    },
    {
      "id": "decoy",
      "label": "decoy",
      "direction": "output",
      "dataType": "value",
      "angle": 180
    }
  ],
  "inputs": [
    { "key": "root", "label": "root", "type": "value" }
  ],
  "outputs": [
    { "key": "root", "label": "root", "type": "value" },
    { "key": "message", "label": "message", "type": "value" }
  ]
}
```

If the user asks to add or change semantic ports on an existing node, return an `updateNode` mutation that sets the full intended `ports`, `inputs`, and `outputs` arrays together.

If the user asks to add or change handles on an existing node, return an `updateNode` mutation that sets the full intended `handles` array.

Example: add a new semantic output port and two bound handles to an existing markdown node

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "updateNode",
      "id": "existing-markdown-node",
      "updates": {
        "ports": [
          {
            "id": "root",
            "label": "root",
            "direction": "bidirectional",
            "dataType": "value",
            "angle": 210
          },
          {
            "id": "message",
            "label": "message",
            "direction": "output",
            "dataType": "value",
            "angle": 0
          }
        ],
        "handles": [
          {
            "id": "root",
            "label": "root",
            "direction": "bidirectional",
            "dataType": "any",
            "portId": "root",
            "angle": 210
          },
          {
            "id": "message-east",
            "label": "message east",
            "direction": "output",
            "dataType": "value",
            "portId": "message",
            "angle": 0
          },
          {
            "id": "message-south",
            "label": "message south",
            "direction": "output",
            "dataType": "value",
            "portId": "message",
            "angle": 90
          }
        ],
        "inputs": [
          { "key": "root", "label": "root", "type": "value" }
        ],
        "outputs": [
          { "key": "root", "label": "root", "type": "value" },
          { "key": "message", "label": "message", "type": "value" }
        ]
      }
    }
  ]
}
```

If you do not know the current semantic port contract on the target node, say so and ask for the node JSON or inspect the current graph before inventing ports.

## Working In Existing Graphs

For normal authoring inside an existing graph:

- prefer additive transactions
- preserve node ids when updating existing material
- use the graph’s existing edge vocabulary when it is obvious
- prefer the graph’s existing port vocabulary when it is obvious
- otherwise use a safe valid edge type already in use in the graph

## Creating New Graphs

For a fresh graph artifact:

- include a `declaration` node as the system graph node
- keep the first graph small and legible
- add only the node types the graph actually needs
- avoid unnecessary compatibility scaffolding

## Handshake Example

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "createNodes",
      "nodes": [
        {
          "id": "11111111-1111-4111-8111-111111111111",
          "type": "markdown",
          "label": "Handshake",
          "position": { "x": 260, "y": 120 },
          "width": 360,
          "height": 220,
          "data": {
            "markdown": "# Handshake received\\n\\nI am ready to make small valid Twilite graph mutations."
          }
        }
      ]
    }
  ]
}
```

## Invalid Shapes To Avoid

These shapes are wrong in Twilite:

- top level `{"actions":[...]}`
- command objects like `{"command":"createNodes"}`
- node ids stored as `uuid`
- node payload stored in `metadata`
- markdown content stored in `metadata.content`
- titles stored only in `metadata.title`
- edges that assume `sourcePort: "out"` and `targetPort: "in"` on nodes that do not declare those ports

If you are creating a markdown node, it should look like this shape:

```json
{
  "id": "11111111-1111-4111-8111-111111111111",
  "type": "markdown",
  "label": "Example",
  "position": { "x": 120, "y": 80 },
  "width": 360,
  "height": 220,
  "data": {
    "markdown": "# Example\\n\\nValid Twilite markdown node."
  }
}
```

## New Graph Starter Example

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
          "data": {
            "markdown": "# Twilite Starter\\n\\nThis graph is valid and ready for extension."
          }
        }
      ]
    }
  ]
}
```

## Final Rule

When onboarded, complete the handshake first.

After the handshake, continue helping through valid Twilite graph mutations.
