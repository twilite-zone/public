# Twilite Handshake

Read the onboarding guide first:

- `https://twilite.zone/library/documentation/OnboardLLM.md`

Then complete the handshake.

Handshake requirements:

- return JSON only
- return one small additive `transaction`
- use one `createNodes` command
- create one or two simple nodes that acknowledge readiness
- use the exact top-level shape:
  - `{"action":"transaction","commands":[...]}`
- do not wrap the payload as:
  - `{"transaction": { ... }}`
- use `action`, not `actions`
- use `action`, not `command`
- use `id`, not `uuid`
- use `data`, not `metadata`
- give each created node a real `type`
- put the node `label` on the node itself, not inside `data`
- for markdown nodes, put the content in `data.markdown`
- include a `position`
- do not invent port names
- only use port ids that are explicitly declared on the nodes
- do not confuse handle placement like `side` with a port id
- if you do not know the schema, inspect first
- use `root` only when the nodes are known to expose `root`
- use `reference` as the safe default edge type
- if you create edges later, use `source` and `target`
- do not use `sourceNodeId` and `targetNodeId` in `createEdges`
- do not put `edges` inside a `createNodes` command
- if you edit one node, use `updateNode`
- use `updateNodes` only for one shared patch across many ids
- in `updateNodes`, `updates` must be one object
- do not use `updateNodes` with:
  - a `nodes` array
  - an `updates` array
  - per-node `{ id, updates }` entries
- if you edit one edge, use `updateEdge`
- use `updateEdges` only for one shared patch across many ids
- use real existing ids for updates, not placeholder example ids
- put visual edge styling in `updates.style`
- do not use top-level `animated: true` for edge styling
- do not use `updates.style.animated: true`; use `updates.style.animation` instead

This response is a handshake, not a full graph.

Minimal valid handshake example:

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
          "visible": true,
          "showLabel": true,
          "data": {
            "markdown": "## LLM Handshake\\n\\nReady to collaborate through valid Twilite graph mutations."
          }
        }
      ]
    }
  ]
}
```

After the handshake, continue helping through valid Twilite graph mutations.
