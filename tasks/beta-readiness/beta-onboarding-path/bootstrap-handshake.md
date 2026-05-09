# Twilite Bootstrap Handshake

You are onboarding into an existing Twilite graph.

Before you answer, read the onboarding guide:

- `/library/documentation/OnboardLLM.md`

Return a **small additive transaction**, not a full graph.

Rules:

- Do **not** return `nodegraph-data`.
- Do **not** create `manifest`, `dictionary`, or `legend`.
- Do **not** reset or replace the current graph.
- Return **JSON only**.
- Prefer a single `transaction` with one `createNodes` command.
- Use only valid mutation commands such as:
  - `createNodes`
  - `createEdges`
  - `updateNode`
  - `updateNodes`
- Do **not** invent generic commands like `update`.
- If you update a node, use the real Twilite shape:
  - `updateNode` with `id` plus one `updates` object
  - or `updateNodes` with `ids` plus one shared `updates` object
- If you create edges, prefer the graph's normal edge type such as `reference` unless the target graph clearly uses a different valid type.
- Create **one or two simple nodes** that acknowledge the handshake and show you understand your role.
- A markdown node is enough.
- After the handshake, be ready to explore any subject and make a graph about it.

Safe shape:

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
            "markdown": "# Handshake received\\n\\nI understand my role. Talk to me for a bit, then ask for another graph."
          }
        }
      ]
    }
  ]
}
```

Unsafe shape to avoid:

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "update",
      "updates": [
        {
          "id": "some-node",
          "ports": []
        }
      ]
    }
  ]
}
```

That shape is invalid in Twilite. Use `updateNode` or `updateNodes` instead.
