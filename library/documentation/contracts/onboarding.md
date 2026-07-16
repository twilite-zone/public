# Twilite Onboarding Guide

## Purpose
Welcome, orient, and align humans working inside existing Twilite graphs.

Twilite is not a canvas. It is a living artifact with history, intent, and obligations.
When you open a graph, you become its steward.

## Core Mindset
- Graphs are shared memory
- Every mutation has consequences
- Preserve intent before improving form
- Never surprise future readers (human or agent)

## How to Work in a Graph
1. Read the Manifest first
2. Run validation before mutation
3. Prefer transformation skills over manual edits
4. Leave notes when intent changes
5. Keep diffs small and meaningful

## Continuity Expectations
- Do not delete history casually
- Use refactors instead of rewrites
- Respect schema versions
- Never break execution silently

## First Steps
- Explore node schemas
- Inspect skill contracts
- Run validation
- Make one small, reversible change

## Ref Schemes
Twilite uses two important address schemes and they do different jobs.

### `github://` is the canonical graph identity
- Use `github://owner/repo/path/to/file.node` when you mean the real graph asset
- Prefer it for durable refs like `ref`, `sourceRef`, `classRef`, `src`, and `endpoint`
- When someone asks for the graph address, return the exact `github://...` handle
- Prefer explicit file paths like `root.node` instead of relying on folder inference

### `tlz://` is Twilite navigation
- Use `tlz://` for in-app navigation and markdown links
- Treat it as browser-level navigation sugar, not the canonical storage identity
- If a value tells Twilite where to navigate, `tlz://` is fine
- If a value identifies where a graph lives in repo space, use `github://`

## Practical Rule
- Durable graph identity: `github://`
- User-facing navigation inside Twilite: `tlz://`

## GitHub Session Recovery
Twilite has two related but different auth states:

- a broader Twilite account session
- a GitHub provider session that must still hold a usable token for installations and repo access

If someone says "my GitHub installations disappeared" or "I look signed in but GitHub repos are gone", do not assume GitHub itself lost the installations.

Usually the real problem is:

- the Twilite account session still exists
- the GitHub identity still appears linked
- but the GitHub provider token used for installations expired or went missing

When that happens:

- tell the user the account session and GitHub provider session can drift apart
- tell them to disconnect GitHub in Twilite and reconnect it
- if the UI exposes a reconnect action, prefer that over vague "sign in again" language
- describe the state precisely as "GitHub linked but provider session expired" instead of "not signed in"

## Primitive Chooser
Use the primitive that matches the job directly. Do not substitute a nearby concept just because it feels related.

- `declaration`: use for graph identity, intent, authority, and exposed surfaces
- `port`: use for a declared renderable or navigable surface
- `markdown`: use for text content only
- `portal`: use for a consumer/opening node that targets another declared surface
- `dictionary`: use only when the task is specifically about dictionary infrastructure or compatibility behavior, not as a substitute for `declaration` or `port`
- `bridge`: use for import/export boundaries and explicit external authority

## Declaration-First Starter Pattern
When creating a first real graph, prefer one `declaration` node and one `port` node.

### Declaration guidance
- Put graph identity in `data.identity`
- Put graph kind and scope in `data.intent`
- Set `data.declaration.kind` to the kind of artifact you are declaring, usually `graph`
- Set `data.declaration.targetMode` explicitly, usually `artifact`
- Set `data.declaration.artifactKind` explicitly, usually `graph` for normal graphs
- Put exposed surfaces in `data.declaration.surfaces`
- Point `data.declaration.defaultSurfaceId` at a surface you actually create
- Use `viewNodeId` to point at the port node that renders that surface
- Keep `dependencies.nodeTypes` honest: list the node types the graph actually uses
- Keep `identity.graphId` consistent across the declaration and graph-owned nodes
- Do not invent edges from the declaration to the port unless the graph specifically needs them

### Declaration checklist
- `data.identity.graphId`, `name`, `version`, and `description` should be real values, not placeholders
- `data.intent.kind` and `scope` should describe the graph honestly
- `data.declaration.targetMode` should usually be `artifact`
- `data.declaration.artifactKind` should usually be `graph` unless the graph is really a different artifact class
- `data.declaration.defaultSurfaceId` must name a surface that exists in `data.declaration.surfaces`
- Each declared view surface should include `id`, `kind`, `label`, `memo`, and `viewNodeId`
- If you include compatibility fields like `primaryNodeViewId` or `portViewNodeId`, keep them aligned with the declared surfaces instead of letting them disagree
- A graph with a partial declaration may load, but it can still trigger saveability or interpretation problems

### Port guidance
- When a user says "create a port for this graph", interpret that as: create a graph-owned entry surface that can open or connect back to this graph
- Put the graph id on the port too: `data.identity.graphId`
- Give the port a real navigation target in `data.target`
- For a graph-owned entry port, prefer `data.target.graphId` and `data.target.mode: "navigate"` unless the graph is using a more specific endpoint contract
- Put the surface payload in `data.view`
- Put the port role in `data.viewRole`
- `card` is a good `data.viewRole`, but it is not a supported `data.renderShape.kind`
- Use `data.renderShape.kind` to declare how the port renders
- Supported authored render kinds are `markdown`, `html`, `svg`, `text`, `image`, and `canvas`
- Do not use a bare string like `renderShape: "svg"`; use an object like `renderShape: { "kind": "svg" }`
- If you use SVG, keep `data.svg` as raw SVG text only
- For SVG roots, use a real XML namespace like `xmlns="http://www.w3.org/2000/svg"`
- When authoring inline SVG in JSON, copy a known-good SVG specimen and edit only the shapes, colors, labels, and geometry
- Do not hand-type or rewrite the `xmlns` attribute unless you are pasting the exact raw XML namespace
- Do not paste markdownified links such as `[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)` into SVG attributes
- Only include inline render fields like `data.svg` or `data.html` when they contain real authored content
- Do not emit placeholder fields like `html: ""` or `svg: ""`
- Do not paste markdown links or prose into raw SVG markup
- Do not invent `targetNodeId` or edges to nodes that do not exist
- Do not expect `title`, `description`, `icon`, or `cover` alone to render a port card body; they are metadata unless you also provide a real inline payload such as `data.svg` or `data.markdown`

### What "create a port" usually means
- Create a real `port` node, not a `portal`, `markdown`, or `dictionary`
- Make it graph-owned with `data.identity.graphId`
- Give it a real target so it can open or connect back to the graph
- Give it a real preview payload if you want it to render as a card
- If the graph has a declaration, expose that same port through `data.declaration.surfaces` and `defaultSurfaceId`
- Do not stop at metadata-only fields such as `title`, `icon`, `description`, or `cover`

### Reference specimens in this repo
- Visual card specimen: `github://mikemartinez1974/public/graphs/indiana-jones.node`
  - Look at the `port` node labeled `Indiana Jones Portal Card`
  - This is a good example of a real `data.viewRole`, `data.renderShape.kind: "svg"`, and valid raw SVG payload
- Navigate-target specimen: `github://twilite/public/root.node`
  - Look at the `portal` node `port-github-root`
  - This is a good example of a real `data.target.endpoint` plus `data.target.mode: "navigate"`
- Surface specimen: `github://twilite/public/root.node`
  - Look at the `port` node `public-root-view`
  - This is a good example of a graph-owned rendered surface with valid SVG
- If you need a graph entry `port`, combine those lessons:
  - use the real target shape from the navigate specimen
  - use the real SVG/render-shape pattern from the visual specimen
  - do not invent a third schema

### SVG red flags
- If you see `[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)` anywhere inside `data.svg`, the payload is invalid
- If you see unescaped `"` characters inside the SVG string in JSON, the transaction is invalid
- If you are not sure the SVG string is safe, use a simpler `markdown` preview instead of inventing a new SVG block from scratch

### Portal guidance
- A `portal` is a consumer/opening node, not the place to stash blank preview payloads
- If the portal should preview a remote surface, bind it through `data.sourceRef`, `data.sourceNodeId`, `data.sourcePayload`, and `data.target`
- If the portal should navigate only, keep the navigation target clean and omit inline payload fields entirely
- Do not add `data.html`, `data.svg`, `data.markdown`, or `data.text` unless the portal itself truly owns that inline content
- Empty inline fields can mask the real remote surface and cause blank cards

### Port card example
Use a port like this when you want a declared card-style surface that another graph can open or render:

```json
{
  "id": "example-summary-port",
  "type": "port",
  "label": "Example Summary",
  "position": { "x": 320, "y": 120 },
  "width": 420,
  "height": 240,
  "visible": true,
  "showLabel": true,
  "data": {
    "identity": {
      "graphId": "example-graph"
    },
    "target": {
      "graphId": "example-graph",
      "mode": "navigate"
    },
    "view": {
      "intent": "node",
      "payload": "node.web.summary"
    },
    "viewRole": "card",
    "renderShape": {
      "kind": "svg"
    },
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 320 180\" role=\"img\" aria-label=\"Example summary card\"><rect x=\"16\" y=\"16\" width=\"288\" height=\"148\" rx=\"20\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"5\"/><rect x=\"36\" y=\"38\" width=\"136\" height=\"18\" rx=\"9\" fill=\"#2563eb\" opacity=\"0.9\"/><rect x=\"36\" y=\"72\" width=\"220\" height=\"12\" rx=\"6\" fill=\"#cbd5e1\"/><rect x=\"36\" y=\"96\" width=\"184\" height=\"12\" rx=\"6\" fill=\"#dbeafe\"/><rect x=\"36\" y=\"128\" width=\"112\" height=\"20\" rx=\"10\" fill=\"#0f172a\" opacity=\"0.92\"/><text x=\"92\" y=\"142\" text-anchor=\"middle\" fill=\"#f8fafc\" font-family=\"Arial, sans-serif\" font-size=\"11\" font-weight=\"700\">OPEN GRAPH</text></svg>"
  }
}
```

If this port is the graph's primary declared surface, point the declaration surface at this node with `viewNodeId`.

### Minimal navigable port starter
Use this shape when the user asks for "a port for this graph" and the main goal is a working graph entry surface:

```json
{
  "id": "example-entry-port",
  "type": "port",
  "label": "Example Graph",
  "position": { "x": 320, "y": 120 },
  "width": 420,
  "height": 240,
  "visible": true,
  "showLabel": true,
  "data": {
    "identity": {
      "graphId": "example-graph"
    },
    "target": {
      "graphId": "example-graph",
      "mode": "navigate"
    },
    "view": {
      "intent": "node",
      "payload": "node.web.summary"
    },
    "viewRole": "card",
    "renderShape": {
      "kind": "svg"
    },
    "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 320 180\" role=\"img\" aria-label=\"Example graph card\"><rect x=\"16\" y=\"16\" width=\"288\" height=\"148\" rx=\"20\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"5\"/><text x=\"36\" y=\"58\" fill=\"#0f172a\" font-family=\"Arial, sans-serif\" font-size=\"20\" font-weight=\"700\">Example Graph</text><text x=\"36\" y=\"88\" fill=\"#334155\" font-family=\"Arial, sans-serif\" font-size=\"12\">Open this graph from another graph.</text></svg>"
  }
}
```

### Safe starter shape
- declaration surface kind: `view`
- port `data.view.intent`: `node`
- port `data.view.payload`: something like `node.web.summary` or `node.web.detail`
- port `data.identity.graphId`: the graph's real id
- port `data.target.graphId`: the graph's real id
- port `data.target.mode`: usually `navigate`
- port `data.viewRole`: something honest like `card`, `summary`, `port`, or `document`
- port render shape: `markdown` or `svg`

### Transaction syntax traps
- A transaction must still be valid JSON even when it contains SVG or HTML strings
- Keep the top-level shape exactly `{"action":"transaction","commands":[...]}`
- Do not leave trailing commas after the last property in an object or array
- Keep quotes inside `data.svg` or `data.html` escaped so the outer JSON string stays valid
- If you paste fenced JSON from a chat response, make sure the payload inside the fence is complete and balanced
- If the app reports a JSON syntax error, fix that first before debugging node contracts

### Do not substitute nearby primitives
- If the user asks for a `declaration`, create a `declaration`, not a `dictionary`
- If the user asks for a `port`, create a `port`, not a `markdown` node
- Do not treat ad hoc `data.ports` on another node type as a replacement for a real `port` node
- Do not satisfy a declaration-and-port request with only styling and a reference edge
- Do not omit `targetMode`, `artifactKind`, `defaultSurfaceId`, or the declared `surfaces` array when authoring a real declaration
- Do not emit empty inline payload placeholders such as `html: ""` or `svg: ""` on `port` or `portal` nodes
- Do not put the graph id at `data.graphId` when authoring a real port; use `data.identity.graphId`
- Do not return a metadata-only card when the user asked for a working port back to the graph
- Do not omit `data.target` on a graph-owned entry port unless the task is explicitly to make a visual stub only
- Do not set `data.renderShape.kind: "card"` on a `port`; use `data.viewRole: "card"` plus a real render payload such as `data.svg` or `data.markdown`
- Do not assume `cover`, `icon`, and `description` will render a visual card body on their own
- Do not author a normal graph declaration as:
  - `data.declaration.kind: "knowledge-graph"`
  - `data.declaration.targetMode: "graph"`
  - `data.declaration.artifactKind: "educational"`
  - surface `kind: "card"`
- For a normal graph, prefer:
  - `data.declaration.kind: "graph"`
  - `data.declaration.targetMode: "artifact"`
  - `data.declaration.artifactKind: "graph"`
  - surface `kind: "view"`

You are now part of the graph’s memory.
Care for it.
