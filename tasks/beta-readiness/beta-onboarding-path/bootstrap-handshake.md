# Twilite Handshake

Read the onboarding guide first:

- `https://twilite.zone/library/documentation/OnboardLLM.md`

If you cannot open links, the rules below are enough for the handshake. Then complete the handshake.

## Handshake requirements

- return JSON only: one fenced `json` block, no prose around it
- return one small additive `transaction` with the exact top-level shape:
  - `{"action":"transaction","commands":[...]}`
- do not wrap the payload as `{"transaction": { ... }}`
- use one `createNodes` command and nothing else
- create two `content` nodes that acknowledge readiness: one with `content.kind: "markdown"` and one with `content.kind: "svg"`
- parse the complete transaction as strict JSON before returning it

## Node rules

- there are no `markdown` or `svg` node types; all authored material is a `content` node, and `data.content` is `{ "kind": "...", "value": "..." }`
- content kinds are `markdown`, `html`, `svg`, `text`, `json`, and `image`
- give each node a real `type`, a `label`, and a `position`
- `label` goes on the node itself, not inside `data`
- `width`, `height`, `visible`, `showLabel`, and `style` go on the node itself, never inside `data`
- use `action`, not `actions` or `command`
- use `id`, not `uuid`; use real RFC 4122 v4 UUIDs
- use `data`, not `metadata`
- do not put `edges` inside a `createNodes` command
- if you create edges later, use `source`, `target`, `sourcePort`, `targetPort`, and `type` (`edge` is the plain default); never `sourceNodeId` or `targetNodeId`
- only use port ids that are explicitly declared; do not invent port names
- if you edit one node, use `updateNode`; use `updateNodes` only for one shared patch (`ids` plus a single `updates` object) across many nodes
- use real existing ids for updates, not placeholder ids

## JSON and SVG safety

- escape double quotes inside any JSON string, or use safe inner single quotes; this applies to markdown, labels, URLs, HTML, SVG, and `fontFamily`
- write `"fontFamily": "Inter, system-ui, 'Segoe UI', sans-serif"`, not unescaped double quotes around `Segoe UI`
- write newlines inside strings as `\n`
- no trailing commas after the last property in an object or array
- inside `svg` or `html` strings, use single quotes for every markup attribute
- keep `xmlns='http://www.w3.org/2000/svg'` as raw XML, never as a markdown link
- SVG needs a root `<svg>` with a `viewBox`, `width='100%'`, `height='100%'`, `preserveAspectRatio`, `role='img'`, and an `aria-label`; put a plain-language description in `data.altText`
- no scripts, event-handler attributes, or empty placeholders like `svg: ""`
- if the app reports a JSON syntax error, fix that before debugging anything else

## Minimal valid handshake example

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "createNodes",
      "nodes": [
        {
          "id": "11111111-1111-4111-8111-111111111111",
          "type": "content",
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
            "content": {
              "kind": "markdown",
              "value": "## LLM Handshake\n\nReady to collaborate through valid Twilite graph mutations."
            }
          }
        },
        {
          "id": "22222222-2222-4222-8222-222222222222",
          "type": "content",
          "label": "Ready",
          "position": { "x": 480, "y": 0 },
          "width": 320,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "style": {
            "background": "#0f172a",
            "borderColor": "#334155",
            "borderWidth": 1,
            "borderStyle": "solid",
            "borderRadius": 24
          },
          "data": {
            "altText": "A green check mark inside a circle.",
            "content": {
              "kind": "svg",
              "value": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160' width='100%' height='100%' preserveAspectRatio='xMidYMid meet' role='img' aria-label='Ready'><circle cx='80' cy='80' r='48' fill='none' stroke='#34d399' stroke-width='8'/><path d='M58 82l16 16 30-34' fill='none' stroke='#34d399' stroke-width='8' stroke-linecap='round' stroke-linejoin='round'/></svg>"
            }
          }
        }
      ]
    }
  ]
}
```

This response is a handshake, not a full graph.

## After the handshake

Continue helping through valid Twilite graph mutations, and make them good: real content, one clear structure, and a diagram where a diagram explains better than prose.

When creating a real graph:

- start from one `root` node with `data.identity` (`graphId`, `name`, `version`, `description`) and `data.intent` (`kind` and `scope`, both non-empty)
- the graph's title belongs in `root.data.identity.name` and its kind in `root.data.intent.kind`; do not create standalone `title` or `type` nodes for the graph itself
- choose `intent.kind` to describe the graph's subject or purpose, such as `person`, `organization`, `event`, `work`, `task-board`, `documentation`, or `graph`
- use `intent.scope: "public"` for intentionally public content, `"local"` for graph-local infrastructure, `"shared"` for reusable shared resources, and `"mixed"` only when the graph genuinely spans scopes
- the root is the implicit root port; do not add a second root `port`
- connect the root to what it points at with edges whose `sourcePort` names the relationship and whose `targetPort` is `root`:
  - `surfaces` (required, at least one): an edge of `type` `surface`, with `data.surfaceId`, to the first `face` of a Surface
  - a Surface is a chain: each `face` points at the next with a `next-face` edge (`sourcePort` `sequence-out`, `targetPort` `sequence-in`), and the last face points at a `glyph` node the same way
  - `ground` (optional, one): an edge of `type` `ground` to the node you land on inside the graph; a graph that is only a document has none
  - `exposes-port`: optional and repeatable, one per extra named port
- a `face` shows material through `data.content` or a `content` node; do not put `renderShape` on new nodes, and do not write `declaration`, `view`, `default-view` or `landing-surface`: they are retired
- an edge's `type` is its kind (`surface`, `next-face`, `ground`, `leads-to`, and so on); a plain edge with no class is `edge`
- create nodes before the edges that reference them
- keep `identity.graphId` consistent across the root and graph-owned nodes

For the full rules, read the guide above.
