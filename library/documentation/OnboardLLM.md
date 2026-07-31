# Twilite LLM Onboarding Guide

Twilite is a persistent graph workspace.

Your job is to help the user by returning valid Twilite graph mutations that the app can apply directly.

## Operating Role

- Treat the current graph as durable state.
- Prefer small, explicit changes over wholesale replacement.
- Return machine-usable output when the user is asking for graph mutations.
- Keep responses structurally correct before trying to be clever.

## Strict JSON String Safety

Twilite transactions are strict JSON before they are graph commands. A syntax failure prevents the entire transaction from reaching node, edge, or declaration validation.

- double quotes inside any JSON string must be escaped as `\"` or replaced with safe inner single quotes
- this rule applies to `fontFamily`, markdown, labels, descriptions, URLs, HTML, SVG, and every other string field
- prefer `"fontFamily": "Inter, system-ui, 'Segoe UI', sans-serif"` for CSS font stacks
- inside a JSON `data.svg` or `data.html` string, use single quotes for markup attributes; for example, write `"svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 180'>...</svg>"`
- never allow a URL inside SVG markup to become Markdown link syntax; `xmlns` is the literal XML attribute `xmlns='http://www.w3.org/2000/svg'`
- never emit `"fontFamily": "Inter, system-ui, "Segoe UI", sans-serif"` because the inner double quotes terminate the JSON string
- validate the complete transaction as JSON before returning it

## Node Property Ownership

Treat the node shell and the renderer payload as separate ownership boundaries.

**Node presentation properties are top-level.** Put `style`, `width`, `height`, `visible`, `showLabel`, and `position` directly on the node. Do not place these properties inside `data`.

The `data` object contains type-specific content, behavior, identity, targets, and render instructions.

```text
Node shell
  id
  type
  label
  position
  width
  height
  visible
  showLabel
  style
  ports
  handles (only when they add visual placement or bindings)
  inputs / outputs (legacy-only compatibility)

Renderer and type payload
  data.markdown
  data.svg
  data.src
  data.identity
  data.target
  data.view
  data.renderShape

Graph semantics
  declaration
  edges
  exposed ports
  class bridges and bindings
```

For mutations, the same boundary remains in effect:

- `updates.style` changes the node shell
- `updates.width` and `updates.height` change node dimensions
- `updates.position` moves the node
- `updates.data` changes type-specific payload
- `updates.data.style` is payload data and does not style the node shell

Canonical styled markdown node:

```json
{
  "id": "example-markdown",
  "type": "markdown",
  "label": "Example",
  "position": { "x": 0, "y": 0 },
  "width": 600,
  "height": 320,
  "visible": true,
  "showLabel": true,
  "style": {
    "background": "#182018",
    "color": "#edf3df",
    "borderColor": "#9dbb83",
    "borderWidth": 2,
    "borderStyle": "solid",
    "borderRadius": 24
  },
  "data": {
    "markdown": "# Example\n\nContent goes here."
  }
}
```

Invalid for node presentation:

```json
{
  "data": {
    "markdown": "# Example",
    "style": {
      "background": "#182018"
    }
  }
}
```

`data.style` does not style the node shell. Before emitting a create or update transaction, check that every shell-owned property is outside `data`.

## First-Class Content Nodes

Treat `markdown` and `svg` as peer authoring primitives:

- use `markdown` for prose, lists, links, instructions, and readable documents
- use `svg` for diagrams, maps, visual explanations, icons, cards, and other authored vector graphics
- do not wrap SVG in markdown or create a port merely to display a graph-owned illustration
- use a `port` when the graphic is an exposed graph surface, not merely because the content is visual

An SVG node stores its graphic in `data.svg`. SVG presentation attributes inside that string belong to the vector artwork; node-shell presentation still belongs in top-level `style`.

Canonical SVG node:

```json
{
  "id": "example-svg",
  "type": "svg",
  "label": "Example Diagram",
  "position": { "x": 680, "y": 0 },
  "width": 420,
  "height": 320,
  "visible": true,
  "showLabel": true,
  "style": {
    "background": "#0f172a",
    "borderColor": "#334155",
    "borderWidth": 1,
    "borderStyle": "solid",
    "borderRadius": 20
  },
  "data": {
    "altText": "Two labeled circles connected by an arrow.",
    "svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 180' width='100%' height='100%' preserveAspectRatio='xMidYMid meet' role='img' aria-label='Two labeled circles connected by an arrow'><rect width='320' height='180' rx='20' fill='#0f172a'/><circle cx='80' cy='90' r='34' fill='#38bdf8'/><circle cx='240' cy='90' r='34' fill='#a78bfa'/><path d='M120 90h72' stroke='#f8fafc' stroke-width='6' stroke-linecap='round'/><path d='m182 76 18 14-18 14' fill='none' stroke='#f8fafc' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/></svg>"
  }
}
```

SVG authoring rules:

- provide a real root `<svg>` element and a `viewBox`
- prefer `width="100%"`, `height="100%"`, and `preserveAspectRatio`
- include `role="img"` and an `aria-label` in the SVG, and put a plain-language description in `data.altText`
- keep the JSON string valid by using single quotes for every SVG attribute inside `data.svg`
- never emit Markdown link syntax inside SVG markup
- never include scripts, event-handler attributes, or executable embedded content
- expect Twilite to sanitize SVG before rendering
- use top-level `width` and `height` for the node dimensions; `data.width` and `data.height` do not size the node shell

## Analytics Is Explicit Opt-In

- Never add `data.analytics` to a declaration unless the user explicitly asks to track that graph or a clearly bounded set of graphs.
- The presence of a valid declaration `data.analytics` object, including `{}`, makes the graph eligible for a Twilite virtual page view.
- Absence means untracked; do not treat public visibility as analytics consent.
- Only author optional `pageTitle`, `contentGroup`, and `url` fields. `url` is allowed only when it names a real HTTPS-hosted location for the graph; GitHub storage alone is not hosting.
- Twilite owns measurement configuration, dispatch, deduplication, cookieless consent defaults, and viewer-level policy.
- Do not opt in templates, classes, support graphs, or private graphs by inference.

## App Surface Expectations

When you explain how to use Twilite, prefer the app surfaces that are durable for unsigned and free users:

- treat the browser surface as the default starting point
- prefer address-bar and browser-chrome actions over toolbar-only instructions
- do not assume the editor toolbar is available
- if the user only needs navigation, tutorials, bookmarks, gallery, handshake, or document actions, keep the guidance in browser mode
- only steer the user toward editor-specific affordances when the task truly requires authoring

## Graph Address Legality

- Accept `github://`, `http://`, and `https://` graph resources anywhere Twilite accepts a graph address, including portals, bridges, `ref`, `sourceRef`, `classRef`, `src`, and `endpoint`.
- Preserve the provider address the user or author entered. Do not silently rewrite an HTTP graph address as GitHub or a GitHub graph address as HTTP.
- Fetch and cache the requested form. Equivalent publications may briefly expose different revisions during deployment.
- For the Twilite application repository, `twilite/public/<relative-path>` is available as both:
  - `https://twilite.zone/<relative-path>`
  - `github://TwiliteLLC/twilite/public/<relative-path>`
- Keep `public/root.node` as the application entry graph and `public/company/root.node` as the separate Twilite LLC company graph.
- Do not merge a company or organization graph into the application root merely because it is a primary destination.
- In a web-published graph, use the HTTPS address when the graph intends to consume the web-hosted resource; use GitHub when repository provenance is intentional or no verified web projection exists.
- Migrate references in bounded graph or collection passes and verify every projected target before rewriting it.
- The `public/` directory is omitted only from the web URL because it is the configured document root.
- Do not invent legacy aliases. A legacy repository reference works only while the named repository file remains available.

## GitHub Auth Reality

Twilite can have:

- a Twilite account session
- a linked GitHub identity
- and a separate GitHub provider token that is required for installations, repos, and GitHub save actions

Those states can drift apart.

If a user says they are signed in but GitHub installations disappeared, repos are empty, or GitHub save suddenly stopped working:

- do not assume the installations were removed from GitHub
- do not describe the problem as a generic save failure
- explain that the GitHub provider session likely expired while the broader account session stayed alive
- recommend reconnecting GitHub inside Twilite
- if you are describing the state, prefer wording like `GitHub linked but provider session expired`

## Handshake Requirement

The first time you are onboarded into a Twilite session, you must complete the handshake.

Complete the handshake by returning:

- JSON only
- one small additive `transaction`
- one `createNodes` command
- one or two simple nodes that acknowledge readiness

The handshake is not a full graph. It is proof that you understand how to speak Twilite’s mutation format.

Use a markdown node for a prose handshake. An SVG node is equally valid when the user asks for a visual handshake or when a small diagram is the clearest proof of authoring readiness.

## Handshake Shape That Must Be Used

For the first handshake, use this exact structural pattern:

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
          "label": "LLM Handshake",
          "position": { "x": 0, "y": 0 },
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "style": {
            "background": "#182018",
            "color": "#edf3df",
            "borderColor": "#9dbb83",
            "borderWidth": 2,
            "borderStyle": "solid",
            "borderRadius": 24
          },
          "data": {
            "markdown": "## LLM Handshake\\n\\nReady to collaborate through valid Twilite graph mutations."
          }
        }
      ]
    }
  ]
}
```

For the handshake:

- the top level must be `action`, not `transaction`
- `transaction` is the value of `action`, not a wrapper key
- `commands` must be an array
- `createNodes` must contain `nodes`, not `edges`
- each created node should include a real `type`
- for markdown nodes, the content should go in `data.markdown`
- `label` is a node field, not a `data` field
- include a `position`
- put `width`, `height`, visibility, and presentation `style` on the node shell, never inside `data`

## Invalid Handshake Patterns

Do not return any of these shapes:

- `{"transaction": { ... }}`
- a `createNodes` command that also contains `edges`
- a node with no `type`
- a markdown node that uses `data.title` and `data.body` instead of `data.markdown`
- a created node where `label` is only nested inside `data`

Wrong:

```json
{
  "transaction": {
    "action": "createNodes",
    "nodes": [
      {
        "id": "llm-handshake-node",
        "data": {
          "label": "LLM Readiness Acknowledged"
        }
      }
    ]
  }
}
```

Why it is wrong:

- the top-level wrapper is invalid
- `createNodes` is in the wrong place
- the node is missing `type`
- the node label is placed in `data` instead of `label`
- there is no `position`

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
- `updateEdge`
- `updateEdges`
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
- `updateEdge`
- `updateEdges`
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
  - `updateEdge`
  - `updateEdges`
  - `update` with `type: "edge"` when you are patching mixed resource types in a generic flow
  - `delete` with `type: "edge"`
- groups:
  - `createGroups`
  - `update` with `type: "group"`
  - `delete` with `type: "group"`
  - `addNodesToGroup`
  - `removeNodesFromGroup`
  - `setGroupNodes`

There are lower-level aliases in internal runtime layers such as `createNode`, `createEdge`, `updateGroup`, and `deleteNode`, but for graph authoring you should prefer the documented top-level action names above. Edge edits are first-class and should use `updateEdge` or `updateEdges`.

## Command Shape Rules

- The top-level keys are exact:
  - use `action`
  - do not use `actions`
- do not wrap the payload in a top-level `transaction` object
- correct:
  - `{"action":"transaction","commands":[...]}`
- incorrect:
  - `{"transaction":{"action":"createNodes","nodes":[...]}}`
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
- Use `updateEdge` for one edge:
  - `{"action":"updateEdge","id":"edge-id","updates":{...}}`
- Use `updateEdges` for a shared update across several edges:
  - `{"action":"updateEdges","ids":["edge-a","edge-b"],"updates":{...}}`
- For updates, the `id` or `ids` must be real existing graph ids.
- Do not repeat placeholder example ids like `edge-id`, `node-id`, `edge-a`, or `edge-b` in a live mutation unless those exact ids already exist in the graph.
- `updates` is a patch object, not a full node replacement.
- In `updateNodes`, `updates` must be one object.
- Do not make `updates` an array.
- Do not put per-node entries inside `updateNodes`.

## Markdown Styling Rules

- Treat `data.markdown` as content, not as a CSS styling channel
- Do not try to change markdown node text color with inline HTML like `<div style="color:#172033">...`
- Twilite sanitizes markdown HTML, so inline CSS is the wrong authoring path even when the JSON is otherwise valid
- For markdown node presentation, use node-level style fields such as `style.color`, `style.background`, `style.borderColor`, and related node chrome properties
- If the user really needs richly styled inline content, switch to a node or surface contract that explicitly supports `html` or `svg`
- If you place HTML inside `data.markdown`, keep it structurally simple and do not rely on `style=` attributes surviving sanitization

Wrong:

```json
{
  "action": "updateNode",
  "id": "classic-rag",
  "updates": {
    "data": {
      "markdown": "<div style=\"color:#172033\"><h1>Classic RAG</h1></div>"
    }
  }
}
```

Why it is wrong:

- it uses `data.markdown` as a presentation channel
- inline CSS in markdown is sanitized and should be treated as unsupported
- if the quotes are not escaped, the whole transaction becomes invalid JSON before Twilite can even apply it

Right:

```json
{
  "action": "updateNode",
  "id": "classic-rag",
  "updates": {
    "style": {
      "color": "#172033"
    },
    "data": {
      "markdown": "# Classic RAG\n\nBest for fast retrieval, FAQs, documentation, and semantic search."
    }
  }
}
```
- In `updateEdges`, `updates` must be one object.
- Do not make `updates` an array in `updateEdges`.
- Do not put per-edge entries inside `updateEdges`.
- If creating edges, include:
  - `id`
  - `source`
  - `target`
  - `sourcePort`
  - `targetPort`
  - `type`
- Do not use:
  - `sourceNodeId`
  - `targetNodeId`
  as edge endpoint keys in `createEdges` payloads.

## Create Command Examples

Create one markdown node:

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
          "label": "Note",
          "position": { "x": 120, "y": 180 },
          "visible": true,
          "showLabel": true,
          "data": {
            "markdown": "## Note\\n\\nCreated through a valid Twilite transaction."
          }
        }
      ]
    }
  ]
}
```

Create a node and then an edge in the same transaction:

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
          "label": "Source",
          "position": { "x": 80, "y": 120 },
          "data": {
            "markdown": "## Source"
          }
        }
      ]
    },
    {
      "action": "createEdges",
      "edges": [
        {
          "id": "22222222-2222-4222-8222-222222222222",
          "type": "reference",
          "source": "11111111-1111-4111-8111-111111111111",
          "target": "existing-target-node",
          "sourcePort": "root",
          "targetPort": "root"
        }
      ]
    }
  ]
}
```

## Updating Existing Nodes

When editing a node that already exists:

- use `updateNode` for one node id
- use `updateNodes` only when the exact same patch should apply to several nodes
- do not use `updateNodes` with a `nodes` array of per-node changes
- do not use `updateNodes` with an `updates` array
- do not nest `{ id, updates }` entries inside `updateNodes`
- preserve the existing node id
- patch only the fields you intend to change
- if the user is editing an existing graph, prefer a `transaction` patch over a raw exported `nodegraph-data` wrapper
- use `nodegraph-data` only when the user explicitly asks for a full graph artifact, export payload, or complete replace-style graph body

Current runtime behavior:

- `data` merges shallowly by default
- `position` merges with the current position
- `style` merges with the current style
- `state` merges with the current state
- `ports` should be treated as the full replacement array for the semantic connection contract
- `inputs` and `outputs` are legacy-only compatibility arrays; do not add or update them when canonical `ports` exist
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

Invalid shared edit pattern:

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "updateNodes",
      "nodes": [
        {
          "id": "node-a",
          "label": "Wrong Shape"
        },
        {
          "id": "node-b",
          "label": "Also Wrong"
        }
      ]
    }
  ]
}
```

Why it is wrong:

- `updateNodes` does not accept a `nodes` array
- `updateNodes` is for one shared patch across many ids
- if each node needs a different label, markdown body, or style, use separate `updateNode` commands

Also invalid:

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "updateNodes",
      "updates": [
        {
          "id": "node-a",
          "updates": {
            "style": {
              "backgroundColor": "#ffeeaa"
            }
          }
        },
        {
          "id": "node-b",
          "updates": {
            "style": {
              "backgroundColor": "#ddeeff"
            }
          }
        }
      ]
    }
  ]
}
```

Why it is wrong:

- `updateNodes.updates` must be one patch object
- `updateNodes` does not support an array of per-node patch records
- different styles per node require separate `updateNode` commands

Correct shared style update pattern:

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "updateNodes",
      "ids": ["node-a", "node-b"],
      "updates": {
        "style": {
          "borderColor": "#334155",
          "color": "#0f172a"
        }
      }
    }
  ]
}
```

Correct per-node update pattern:

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "updateNode",
      "id": "node-a",
      "updates": {
        "label": "Node A",
        "data": {
          "markdown": "## Node A"
        }
      }
    },
    {
      "action": "updateNode",
      "id": "node-b",
      "updates": {
        "label": "Node B",
        "data": {
          "markdown": "## Node B"
        }
      }
    }
  ]
}
```

Correct existing port-surface edit pattern:

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "updateNode",
      "id": "products-view",
      "updates": {
        "data": {
          "title": "Products",
          "purpose": "Shared host-facing products page card.",
          "svg": "<svg viewBox='0 0 220 160' xmlns='http://www.w3.org/2000/svg'><rect width='220' height='160' rx='24' fill='#0f172a'/></svg>"
        }
      }
    }
  ]
}
```

Why this is the safe pattern:

- the node already exists, so it should be patched in place
- the top-level shape stays a `transaction`
- only the changed `data` fields are sent
- the SVG stays valid JSON because the XML attributes use single quotes inside the string
- the SVG namespace stays a literal string, not a markdown link

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

Per-node appearance edit example:

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "updateNode",
      "id": "node-a",
      "updates": {
        "style": {
          "backgroundColor": "#fee2e2",
          "borderColor": "#ef4444"
        }
      }
    },
    {
      "action": "updateNode",
      "id": "node-b",
      "updates": {
        "style": {
          "backgroundColor": "#dbeafe",
          "borderColor": "#3b82f6"
        }
      }
    }
  ]
}
```

Concrete "make the graph more colorful" example:

If the user asks:

`can you make the graph more colorful?`

and each node should receive a different color, answer with separate `updateNode` commands like this:

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "updateNode",
      "id": "node-a",
      "updates": {
        "style": {
          "backgroundColor": "#fee2e2",
          "borderColor": "#ef4444",
          "color": "#7f1d1d"
        }
      }
    },
    {
      "action": "updateNode",
      "id": "node-b",
      "updates": {
        "style": {
          "backgroundColor": "#dbeafe",
          "borderColor": "#3b82f6",
          "color": "#1e3a8a"
        }
      }
    },
    {
      "action": "updateNode",
      "id": "node-c",
      "updates": {
        "style": {
          "backgroundColor": "#dcfce7",
          "borderColor": "#22c55e",
          "color": "#14532d"
        }
      }
    }
  ]
}
```

Do not answer that request with:

- one `updateNodes` command containing `nodes: [...]`
- one `updateNodes` command containing `updates: [...]`

Use `updateNodes` only when every targeted node should receive the exact same style patch.

## Updating Existing Edges

When editing an edge that already exists:

- use `updateEdge` for one edge id
- use `updateEdges` only when the exact same patch should apply to several edge ids
- preserve the existing edge id
- use a real existing edge id from the current graph
- patch only the fields you intend to change
- put visual edge styling inside `updates.style`
- use top-level `label` when you are renaming the edge label itself
- do not use top-level `animated: true` as a visual styling shortcut
- do not use `updates.style.animated: true` for normal edge animation
- for animated edges, use `updates.style.animation`

Current runtime behavior:

- edge updates merge shallowly
- `style` merges with the current edge style
- `state` merges with the current edge state
- `data` merges shallowly
- top-level `color` may be tolerated by some render paths as a fallback, but the correct visual contract is `updates.style.color`
- `style.animated` is a legacy or selection-oriented flag and should not be used as the normal animation contract
- visible edge animation in the live renderer should use `style.animation`

Preferred visual edge style fields:

- `color`
- `width`
- `dash`
- `curved`
- `route`
- `orthogonal`
- `opacity`
- `arrowSize`
- `showArrow`
- `arrowPosition`
- `animation`
- `animationSpeed`
- `glow`
- `gradient`

Supported animation values in the live renderer include:

- `dash`
- `glow`
- `pulse`
- `flow`

Alias normalization that Twilite now tolerates:

- `stroke` -> `color`
- `strokeWidth` -> `width`
- `strokeDasharray` -> `dash`
- `routing` or `router` -> `route`

Animation may be:

- a simple string like `animation: "flow"`
- or an object like `animation: { "type": "flow", "duration": 1800, "glow": { "color": "#7DD3FC", "blur": 12 } }`

When the animation is an object:

- `type` maps to the live animation mode
- `duration` or `durationMs` is converted into `animationSpeed`
- nested `glow` becomes `style.glow`

Simple edge edit example:

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "updateEdge",
      "id": "existing-edge",
      "updates": {
        "label": "supports",
        "style": {
          "color": "#2563eb",
          "width": 3,
          "showArrow": true,
          "arrowPosition": "end"
        }
      }
    }
  ]
}
```

Shared edge style update example:

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "updateEdges",
      "ids": ["edge-a", "edge-b"],
      "updates": {
        "style": {
          "color": "#0f766e",
          "width": 2,
          "dash": [8, 4],
          "showArrow": true,
          "arrowPosition": "end"
        }
      }
    }
  ]
}
```

Concrete "do something fancy with the edges" example:

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "updateEdge",
      "id": "edge-indy-archaeologist",
      "updates": {
        "label": "studies",
        "style": {
          "color": "#d97706",
          "strokeDasharray": "10 8",
          "animation": {
            "type": "dash",
            "duration": 1200
          }
        }
      }
    },
    {
      "action": "updateEdge",
      "id": "edge-indy-gear",
      "updates": {
        "label": "carries",
        "style": {
          "color": "#92400e",
          "gradient": {
            "start": "#f59e0b",
            "end": "#f97316"
          },
          "showArrow": true,
          "arrowPosition": "end"
        }
      }
    },
    {
      "action": "updateEdge",
      "id": "edge-indy-rivals",
      "updates": {
        "label": "opposes",
        "style": {
          "color": "#7f1d1d",
          "animation": {
            "type": "glow",
            "duration": 1600,
            "glow": {
              "color": "#fca5a5",
              "blur": 14
            }
          }
        }
      }
    }
  ]
}
```

Invalid animation example:

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "updateEdge",
      "id": "real-existing-edge-id",
      "updates": {
        "label": "explores",
        "style": {
          "color": "#ca8a04",
          "animated": true
        }
      }
    }
  ]
}
```

Why it is wrong:

- `style.animated` is not the preferred live animation contract
- it may have no visible effect in normal edge rendering
- use `style.animation` instead
- if you want dashes, do not rely on `animated: true`; set a real dash pattern or a dash animation contract

Correct animation example:

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "updateEdge",
      "id": "real-existing-edge-id",
      "updates": {
        "label": "explores",
        "style": {
          "color": "#ca8a04",
          "dash": [10, 8],
          "animation": "dash",
          "animationSpeed": 1.2
        }
      }
    }
  ]
}
```

Do not answer that request with:

- placeholder ids copied literally from documentation examples
- `updateEdge` plus top-level `animated: true`
- `updateEdge` plus `updates.style.animated: true`
- `updateEdge` plus top-level `color` when the goal is visual styling
- `updateEdges` with an `updates` array
- `updateEdges` with per-edge `{ id, updates }` records

## Edge Port Rules

Ports are strict.

- Always provide both `sourcePort` and `targetPort`.
- Do not invent port names.
- Only use port ids that are explicitly declared on the nodes.
- Do not confuse handle placement fields like `position.side` or `handle.side` with a port id.
- Only use named ports like `in` or `out` when those ports are explicitly declared on the nodes.
- Do not assume markdown nodes expose `in` / `out`.
- If you do not know the node port schema, inspect first.
- Use `root` only when the nodes are known to expose `root`.

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
- `fontFamily`
- `fontSize`
- `fontWeight`
- `lineHeight`
- `letterSpacing`

Important notes:

- prefer `style.background` as the primary node fill key
- `style.backgroundColor` is still honored in parts of the runtime, but use `background` in onboarding examples unless you are matching an existing graph
- use `style.color` for text color
- use `style.borderColor`, `style.borderWidth`, and `style.borderStyle` together when you want an explicit border treatment
- use `style.fontFamily` when the user wants a different typeface or font stack
- use `style.fontSize`, `style.fontWeight`, `style.lineHeight`, and `style.letterSpacing` for typography tuning
- font stacks should be emitted as normal JSON strings, for example: `"'Caveat', 'Segoe Print', cursive"`
- style patches merge with the existing `style` object, so you only need to send the keys you intend to change
- unsupported style keys should be treated as optional and non-authoritative; do not rely on them unless the current graph already uses them successfully

Typography example:

If the user wants the same font treatment on several existing nodes, `updateNodes` is appropriate because the patch is shared:

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "updateNodes",
      "ids": ["node-a", "node-b", "node-c"],
      "updates": {
        "style": {
          "fontFamily": "'Caveat', 'Segoe Print', 'Comic Sans MS', cursive"
        }
      }
    }
  ]
}
```

If only one node needs a typography change, prefer `updateNode`:

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "updateNode",
      "id": "node-a",
      "updates": {
        "style": {
          "fontFamily": "'Alegreya Sans SC', 'Trebuchet MS', sans-serif",
          "fontSize": 20,
          "fontWeight": 700,
          "letterSpacing": "0.02em"
        }
      }
    }
  ]
}
```

## SVG In JSON Rules

When you place SVG markup inside a JSON string:

- keep the outer JSON string in double quotes
- prefer single quotes for SVG attribute values inside the string
- keep `xmlns='http://www.w3.org/2000/svg'` literal
- do not emit markdown links such as `[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)` inside SVG
- do not leave unescaped double quotes inside the SVG string

Safe example:

```json
{
  "svg": "<svg viewBox='0 0 220 160' xmlns='http://www.w3.org/2000/svg'><rect width='220' height='160' rx='24' fill='#0f172a'/></svg>"
}
```

Unsafe example:

```json
{
  "svg": "<svg viewBox="0 0 220 160" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)">...</svg>"
}
```

Why it is unsafe:

- the inner double quotes break JSON parsing
- the namespace is no longer valid SVG

## Script Source Is Opaque After JSON Parsing

Store graph-owned JavaScript in `data.source`.

The transaction or graph file must be valid JSON, so JSON transport escaping is
still required. Once Twilite parses that JSON, however, the resulting
`data.source` string is the authored JavaScript. Do not decode, normalize, or
globally replace its backslashes, quotes, newlines, template literals, regular
expressions, or HTML-looking text.

In particular, this valid JavaScript must remain unchanged:

```js
const text = items.map(item => item.label).join('\n');
```

Do not turn the remaining `\n` sequence into a literal newline. Doing so places
a newline inside the quoted JavaScript string and causes script compilation to
fail.

Boundary rule:

```text
transaction JSON escaping -> JSON parser -> opaque data.source -> ScriptRunner
```

Only an explicit source-import adapter may decode an external encoding. The
ordinary graph and inline-script paths must pass source through losslessly.

## Reusing Exported Node Data

Exported graph fragments often contain runtime or bridge metadata such as:

- `_classBinding`
- `_bridge`
- `definitionKey`
- `_placement`

Do not blindly carry those fields forward when changing the semantic role of a node.

Examples:

- if a node is now a plain authored `port`, do not re-emit stale `ui-view` bridge metadata just because the old export contained it
- if the user only asked to recolor or restyle an existing node, patch the visible fields and preserve the existing node id
- if you are not intentionally authoring a class-bound node, omit copied class-binding metadata from new mutations

## Visual Authoring

Valid graphs are not automatically good-looking graphs.

When the user is making something explanatory, presentational, navigational, or poster-like, you should treat visual styling as part of the authoring task rather than as optional decoration.

Use styling to communicate meaning:

- use color to distinguish roles, states, or emphasis
- use borders to mark importance, grouping, warnings, or active status
- use text color to preserve contrast and strengthen hierarchy
- use size and spacing to separate headline nodes from supporting notes
- use consistent palettes across related nodes instead of styling each node independently

When to style aggressively:

- poster-style landing graphs
- tutorials and onboarding graphs
- dashboards, summaries, and navigation hubs
- user-facing presentation graphs where visual hierarchy matters

When to style lightly:

- handshake responses
- tiny corrective edits
- low-confidence mutations where the surrounding palette is unknown
- graphs that are already visually quiet and should stay that way

If the current graph already has a clear palette or design language, match it before inventing a new one.

## Color And Emphasis Conventions

Prefer semantically meaningful color choices over arbitrary rainbow styling.

Good default patterns:

- blue tones for structure, navigation, references, and informational nodes
- green tones for success, completion, readiness, or positive status
- amber or orange tones for caution, pending work, or attention
- red tones for errors, blocked states, or destructive meaning
- neutral creams, grays, and off-whites for documentation, prose, and low-drama supporting nodes

Practical guidance:

- prefer one accent family for a cluster of related nodes
- avoid using too many saturated colors in the same local area
- if a node background becomes darker or more saturated, adjust `style.color` for readable text
- if you want emphasis without a new fill color, add or strengthen the border first
- if a node is purely informational prose, neutral backgrounds are often better than loud accents

## Labels And Text Treatment

Labels are part of the visual hierarchy, not just metadata.

- keep `label` short and scannable
- use `showLabel: true` when the node title should be visible in the canvas composition
- use the markdown body or node content for detail, not the label
- if a label is doing no visual work, it is acceptable to hide it and let the node content carry the meaning
- if the node is meant to read like a card, poster tile, or chapter block, make sure the label, size, and border treatment reinforce that role

Use text color intentionally:

- darker text on light fills
- lighter text on dark or saturated fills
- avoid weak contrast between `background` and `color`

## Poster And Layout Conventions

Twilite graphs often read more like posters, canvases, or curated maps than plain diagrams.

For poster-style layouts:

- give the main title or anchor node more space and stronger contrast
- cluster supporting nodes around a visual center or reading path
- leave breathing room between major sections
- use repeated styling within a section so the graph feels authored as one composition
- reserve the strongest accent color for the most important nodes, not every node

For documentation-style layouts:

- prefer calmer backgrounds
- keep spacing regular
- use styling to support readability rather than spectacle

If the user asks for a polished or beautiful result, do not stop at structurally correct node placement. Use size, spacing, and style together.

## Themes

Twilite supports graph theming in addition to per-node styling.

- use per-node `style` when the task is local emphasis or targeted visual differentiation
- use theme-oriented guidance when the user wants the whole graph to share one visual language
- a graph may rely on browser theme fallback, legacy document theme settings, or a dedicated theme node
- if the user asks for a graph-wide visual refresh, inspect whether the graph already appears theme-authored before mixing local node overrides everywhere

In onboarding examples, it is fine to demonstrate node-level styling without authoring a full theme. But you should still recognize that graph-wide theme control exists.

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

Styled poster-card example:

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "createNodes",
      "nodes": [
        {
          "id": "95f3b464-61c3-4c34-8fc4-891ee76f9d11",
          "type": "markdown",
          "label": "Launch Board",
          "position": { "x": 120, "y": 80 },
          "width": 420,
          "height": 260,
          "visible": true,
          "showLabel": true,
          "style": {
            "background": "#fff7ed",
            "color": "#7c2d12",
            "borderColor": "#ea580c",
            "borderWidth": 3,
            "borderStyle": "solid",
            "borderRadius": 18,
            "boxShadow": "0 12px 30px rgba(124,45,18,0.12)"
          },
          "data": {
            "markdown": "# Launch Board\\n\\nA strong headline card can anchor a poster-style graph and establish the palette for nearby nodes."
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

Style emphasis patch example:

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "updateNode",
      "id": "supporting-note",
      "updates": {
        "showLabel": true,
        "style": {
          "background": "#eff6ff",
          "color": "#1e3a8a",
          "borderColor": "#2563eb",
          "borderWidth": 2,
          "borderStyle": "solid",
          "borderRadius": 14
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
- `inputs`: legacy semantic input list; omit when canonical `ports` exist
- `outputs`: legacy semantic output list; omit when canonical `ports` exist
- `handles`: optional UI affordances that may bind to ports

Rules:

- New and updated nodes should author `ports` as the canonical semantic connection contract.
- Do not duplicate canonical ports into `inputs` and `outputs`.
- Preserve `inputs` and `outputs` only when repairing a legacy-only node that has no `ports` yet.
- Edges connect to ports, not directly to handles.
- A handle may bind to one semantic port using `portId`.
- Multiple handles may bind to the same port.
- A handle with no `portId` is visual-only.
- Ports may define default placement.
- Handles may override that placement with their own `angle`.
- Omit `handles` when they would be structurally identical to `ports`; add them only when they provide distinct visual placement or bindings.
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
  ]
}
```

If the user asks to add or change semantic ports on an existing node, return an `updateNode` mutation that sets the full intended `ports` array. Do not add derived `inputs` or `outputs`.

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

## Using Custom Node Classes In A New Graph

Custom node types are not activated merely by naming them in the declaration.

`data.dependencies.nodeTypes` is descriptive. It tells readers and validators which node types the graph uses, but it does not register those types or grant authority to create them. A node such as `{ "type": "person" }` is not class-resolved solely because `person` appears in that list.

For every external node class used by a new graph:

- create or preserve a `bridge` node that points to the class's durable `.node-class.node` `github://` reference
- give that bridge focused-graph creation authority through `scope: "focused-graph"` and `grants: ["create"]`
- connect the declaration to the bridge with an explicit class-authority edge
- preserve `_classBinding` on every class instance, including its class key and source reference
- preserve the instance's `_bridge` provenance when the template or source graph supplies it
- connect the class bridge to each instance with the template's instantiation edge pattern

The bridge is executable graph infrastructure. The declaration's dependency list is not a substitute for it.

### Template derivation rule

When creating a graph from a template, clone its executable structure before changing its example content.

Preserve all of the following unless the relevant contract explicitly says they may be omitted:

- the declaration node and declaration-first ordering
- declared surfaces and their real `viewNodeId` targets
- class bridges and their grants
- declaration-to-bridge authority edges
- class-instance `_classBinding` and `_bridge` data
- instantiation edges and required port or handle contracts

Replace or extend the example content only after that infrastructure is intact. Do not visually imitate a template by recreating its apparent person, role, work, or other semantic nodes without the linkage machinery that makes those types resolvable.

### Minimal custom-class pattern

This fragment assumes the graph's declaration and surface nodes already exist. It shows the required bridge, class-bound instance, authority edge, and instantiation edge:

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "createNodes",
      "nodes": [
        {
          "id": "11111111-1111-4111-8111-111111111111",
          "type": "bridge",
          "label": "Person",
          "position": { "x": 0, "y": 0 },
          "ports": [
            { "id": "root", "label": "root", "direction": "bidirectional", "dataType": "any", "angle": 210 }
          ],
          "handles": [
            { "id": "root", "label": "root", "direction": "bidirectional", "dataType": "any", "portId": "root", "angle": 210 }
          ],
          "data": {
            "intent": "external",
            "scope": "focused-graph",
            "grants": ["create"],
            "target": {
              "mode": "bridge",
              "ref": "github://example/public/people/template/person.node-class.node",
              "kind": "node-class",
              "resourceKind": "node-class",
              "scope": "focused-graph",
              "grants": ["create"],
              "key": "person"
            },
            "_classBinding": {
              "key": "person",
              "sourceRef": "github://example/public/people/template/person.node-class.node"
            },
            "_bridge": {
              "sourceRef": "github://example/public/people/template/person.node-class.node",
              "entryPort": "root",
              "kind": "node-class",
              "targetKind": "node-class",
              "classKey": "person",
              "classRef": "github://example/public/people/template/person.node-class.node"
            }
          }
        },
        {
          "id": "22222222-2222-4222-8222-222222222222",
          "type": "person",
          "label": "Example Person",
          "position": { "x": 360, "y": 220 },
          "ports": [
            { "id": "root", "label": "root", "direction": "bidirectional", "dataType": "any", "angle": 210 }
          ],
          "handles": [
            { "id": "root", "label": "root", "direction": "bidirectional", "dataType": "any", "portId": "root", "angle": 210 }
          ],
          "data": {
            "displayName": "Example Person",
            "definitionKey": "person",
            "_classBinding": {
              "key": "person",
              "sourceRef": "github://example/public/people/template/person.node-class.node",
              "ref": "github://example/public/people/template/person.node-class.node"
            },
            "_bridge": {
              "sourceNodeId": "existing-declaration-node",
              "sourceRef": "github://example/public/people/template/person.node-class.node",
              "entryPort": "root",
              "kind": "node-class",
              "targetKind": "node-class",
              "classKey": "person",
              "classRef": "github://example/public/people/template/person.node-class.node"
            }
          }
        }
      ]
    },
    {
      "action": "createEdges",
      "edges": [
        {
          "id": "33333333-3333-4333-8333-333333333333",
          "type": "reference",
          "source": "existing-declaration-node",
          "target": "11111111-1111-4111-8111-111111111111",
          "sourcePort": "root",
          "targetPort": "root",
          "label": "class authority"
        },
        {
          "id": "44444444-4444-4444-8444-444444444444",
          "type": "reference",
          "source": "11111111-1111-4111-8111-111111111111",
          "target": "22222222-2222-4222-8222-222222222222",
          "sourcePort": "root",
          "targetPort": "root",
          "label": "instantiates"
        }
      ]
    }
  ]
}
```

Before returning this pattern, replace the example class reference and declaration id with real values from the template or target graph. The one-port arrays above are only a minimal standalone specimen. When deriving from a real template, preserve its full canonical `ports` contract and any `handles` that add distinct placement or bindings; do not collapse them to `root` or invent `top` or `bottom` unless the inspected nodes actually expose those ports. Preserve legacy-only `inputs` and `outputs` only when no canonical `ports` exist.

## Declaration Editor Contract

If you are authoring or repairing a custom editor for a `declaration`, use the built-in declaration editor as the minimum functional contract.

- A custom declaration editor may use a different layout
- A custom declaration editor may use custom HTML or a class-backed editor surface
- A custom declaration editor may group fields differently
- But it still must correctly edit the declaration contract

At minimum, a valid declaration editor must support:

- `data.identity.name`
- `data.identity.graphId`
- `data.identity.version`
- `data.identity.description`
- `data.intent.kind`
- `data.intent.scope`
- `data.declaration.kind`
- `data.declaration.targetMode`
- `data.declaration.defaultSurfaceId` (required value: `root`)
- `data.declaration.surfaces`
- `data.purpose`
- optional `data.analytics` through the bounded analytics opt-in control

Legacy classification and preferred-view aliases may still be read from existing graphs, but do not author them in new declarations.

These fields are not just plain strings:

- `data.identity.graphId` must participate in graph-id rename behavior
- `data.declaration.kind` is the graph's extensible type; do not replace it with legacy duplicates such as `data.declaresKind` or `data.declaration.artifactKind`
- `data.declaration.defaultSurfaceId` must be `root`
- `data.declaration.surfaces` must preserve valid surface objects and contain exactly one root surface whose `portNodeId` resolves to the graph's required `Root Port` node
- The root node of a graph is the declaration-bound Root Port. Do not author `root` or `isRoot` flags on any node; those fields are legacy compatibility only
- Named ports require deliberate exposure and addressing; never promote a sole or named port to root by inference
- declared surfaces are the sole authored presentation contract; do not add legacy preferred-view aliases
- analytics must remain absent by default and use the bounded enable toggle, page title, content group, and hosted URL fields rather than an opaque JSON editor

Do not assume that a pretty `editor.web.html` specimen is enough.

- If the editor cannot actually edit the required declaration state, it is invalid
- Twilite preserves baseline editability by supplying any omitted primitive fields to a class-backed editor
- Authored class fields take precedence at matching paths; additional fields and sections are allowed
- Do not deliberately omit baseline fields or depend on fallback injection as the authored contract
- If you cannot satisfy the declaration editor contract, say so instead of inventing partial syntax

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
            "intent": { "kind": "graph", "scope": "local" },
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

## Task Identity, Projection, And Promotion

Keep `task` as the semantic invariant:

- A task is a regular `task` inside its own graph.
- The same task remains a `task` when exposed through a port and projected into a collection or workboard.
- Project describes the scope and internal point of view of a task with its own graph. Do not create a separate `project` type merely because the task has subordinate structure.
- A portal is the external carrier and provenance record; it does not become the semantic type of the resolved task.

Keep a task local when the containing graph fully owns and explains it. Promote it into its own graph when it needs subordinate tasks, questions, decisions, risks, independent authority, or a durable external surface. Promotion changes authority and available detail, not type.

Use collections and workboards for different purposes:

- A task collection remembers durable local tasks and projected task graphs.
- A workboard presents a small operational point of view through lanes, ordering, pinning, and review policy.
- Source task graphs own status, progress, priority, next actions, blockers, and summaries.
- Workboards own only local projection state under `data.board`.

When deriving a workboard, use the `SKILL.md` stored beside the canonical workboard template. Preserve its declaration, controller, exposed port, lane anchors, graph-owned reconciler, bridges, and class bindings. Do not move reconciliation into application-side React code.

## Final Rule

When onboarded, complete the handshake first.

After the handshake, continue helping through valid Twilite graph mutations.
Edge class note:

- edge instances and edge-class `renderDefaults` now share the same visual vocabulary
- edge classes may still use older names like `renderDefaults.stroke`, `renderDefaults.width`, `renderDefaults.dash`, and `renderDefaults.routingHint`
- but when authoring new material, prefer the same conceptual contract you would use on a live edge: color, width, dash, route, arrows, opacity, animation, glow, and gradient
