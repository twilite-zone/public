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

## Current Node Composition Model

For new graph-backed nodes and templates, follow [Graph-Native Node Composition](nodes/graph-native-node-composition.md). It is the write-new authority for roots, ports, faces, content, glyphs, ground, and interface geometry. Older declaration-plus-root-Port, inline Port presentation, Markdown-node, SVG-node, and `renderShape` examples in this guide are compatibility references only.

## Current vocabulary

Use these names in new graph files and mutation transactions:

| Word | Meaning | Stored form |
|---|---|---|
| `root` | The one node a graph begins from; it owns identity, intent, and surfaces. | node `type: "root"`; `data.identity`, `data.intent`, `data.root` |
| `face` | One authored presentation, ordered inside a Surface. | node `type: "face"`; `next-face` edges |
| `content` | Durable authored material. | node `type: "content"`; `data.content.kind` and `data.content.value` |
| `glyph` | The symbolic mark that ends each Surface chain. | node `type: "glyph"` |
| `ground` | The authored inside frame, optional for document graphs. | `ground` edge from the root's `ground` port |
| `property` | One named value on a node. | node `type: "property"`; `name`, `valueType`, `value` |
| `import` / `export` | The two ends of a Bridge. | node type `import` or `export`; one `data.bridge` record |
| `next-face` | Orders faces in a Surface. | edge `type: "next-face"` |
| `invokes` | Runs a Method from an event source in the same graph. | edge `type: "invokes"` |

Edges store their kind in `type`, their class graph in `data.classRef`, and their endpoints in `sourcePort` and `targetPort`. Handles are runtime affordances, not stored endpoints. `declaration`, `view`, `view-sequence`, `landing-surface`, `field`, `bridge` nodes, `markdown`/`svg` node types, groups, and Event Handler/listens infrastructure are legacy names for reading only.

## Agent handshake

The first response in a newly onboarded Twilite session is a small additive transaction. Return JSON only in one fenced `json` block, with one `createNodes` command containing two `content` nodes: one with `data.content.kind: "markdown"` and one with `data.content.kind: "svg"`. The top level is `{ "action": "transaction", "commands": [...] }`; `transaction` is not a wrapper key. Put `label`, `position`, dimensions, visibility, and shell style on each node, and put authored material under `data.content`. Do not return `markdown` or `svg` node types, `data.markdown`, `data.svg`, or a `createNodes` command containing edges.

## Node Property Ownership

Node shell properties and renderer payload fields are different contracts.

> **Node presentation properties are top-level.** Put `style`, `width`, `height`, `visible`, `showLabel`, and `position` directly on the node. Do not place these properties inside `data`. The `data` object contains type-specific content and behavior only.

Transactions must first be valid strict JSON. Escape double quotes inside every JSON string, not only inside HTML or SVG. For font stacks, prefer safe inner single quotes:

```json
{
  "style": {
    "fontFamily": "Inter, system-ui, 'Segoe UI', sans-serif"
  }
}
```

Unescaped inner double quotes make the whole transaction unparsable, so no graph validation or mutation can occur.

```text
Node shell
  position
  width / height
  visible / showLabel
  style
  ports
  handles (only when they add visual placement or bindings)
  inputs / outputs (legacy-only compatibility)

Renderer and type payload
  data.content
  data.src
  data.identity
  data.target
  data.view
  data.classRef

Graph semantics
  root
  surfaces and ground
  edges
  exposed ports
  imports and exports
```

Correct:

```json
{
  "id": "example-content",
  "type": "content",
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
    "content": {
      "kind": "markdown",
      "value": "# Example\n\nContent goes here."
    }
  }
}
```

Wrong for presentation:

```json
{
  "data": {
    "content": { "kind": "markdown", "value": "# Example" },
    "style": {
      "background": "#182018"
    }
  }
}
```

`data.style` is payload data. It does not style the node shell. In an update transaction, use `updates.style`, `updates.width`, `updates.height`, and `updates.position`; do not nest those fields inside `updates.data`.

## First-Class Content Nodes

`content` is the material primitive; `data.content.kind` selects markdown, SVG, HTML, text, JSON, or image.

- Use `content.kind: "markdown"` for prose, links, lists, instructions, and documents.
- Use `content.kind: "svg"` for diagrams, visual explanations, icons, maps, cards, and authored vector graphics.
- A normal graph-owned illustration does not need to be wrapped in a port.
- Use a `port` only when the visual is intended to be an exposed graph surface.

Canonical SVG content node:

```json
{
  "id": "example-svg-content",
  "type": "content",
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
    "content": {
      "kind": "svg",
      "value": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 180' width='100%' height='100%' preserveAspectRatio='xMidYMid meet' role='img' aria-label='Two labeled circles connected by an arrow'><rect width='320' height='180' rx='20' fill='#0f172a'/><circle cx='80' cy='90' r='34' fill='#38bdf8'/><circle cx='240' cy='90' r='34' fill='#a78bfa'/><path d='M120 90h72' stroke='#f8fafc' stroke-width='6' stroke-linecap='round'/><path d='m182 76 18 14-18 14' fill='none' stroke='#f8fafc' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/></svg>"
    }
  }
}
```

SVG authoring rules:

- Store the graphic in `data.content.value` with `data.content.kind: "svg"`.
- Give the SVG a `viewBox`, responsive dimensions, `preserveAspectRatio`, `role="img"`, and `aria-label`.
- Put a plain-language description in `data.altText`.
- Keep node dimensions and shell styling at the top level.
- Do not include scripts, event-handler attributes, or executable embedded content.
- Twilite sanitizes SVG before rendering.

## How to Work in a Graph
1. Read the root first
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
Twilite accepts graph resources through multiple address schemes. Preserve the address the author or user chose.

### `github://` addresses repository resources
- Use `github://owner/repo/path/to/file.node` when referring to a graph through its GitHub repository location
- It is legal in `ref`, `sourceRef`, `classRef`, `src`, `endpoint`, browser navigation, portals, bridges, and class bindings
- Prefer explicit file paths like `root.node` instead of relying on folder inference

### `http://` and `https://` address web-hosted graph resources
- A web-hosted `.node` or `.node-class.node` file is a first-class graph resource, not merely a launch page
- HTTP and HTTPS graph addresses are legal anywhere Twilite accepts a graph address
- Twilite fetches, caches, reloads, displays, and saves the address as entered; do not silently substitute a GitHub address
- Two addresses may publish equivalent content while briefly returning different revisions during deployment

### Public document-root projection
For the Twilite application repository:

```text
physical: twilite/public/<relative-path>
web:      https://twilite.zone/<relative-path>
GitHub:   github://TwiliteLLC/twilite/public/<relative-path>
```

- `public/root.node` is the application entry graph
- `public/company/root.node` is the separate Twilite LLC company graph
- Do not collapse an organization or company graph into the application root merely because the application opens it prominently
- `public/` remains part of the GitHub repository path
- `public/` is omitted from the web URL because it is the web server's document root
- Both address forms are valid and legal; choose the form that expresses the location you mean
- A graph published through `twilite.zone` should use the HTTPS form when it intends to consume the web-hosted resource and its richer hosting behavior
- Keep the GitHub form when repository provenance is intentional or no verified web projection exists
- Apply address migration in bounded graph or collection passes and prove the projected target exists before rewriting references
- Do not create hidden aliases or rewrite one form into the other
- This projection applies to graph resources under the configured public document root and does not require a per-graph manifest

### `tlz://` is Twilite navigation
- Use `tlz://` for in-app navigation and markdown links
- Treat it as browser-level navigation sugar, not a provider or storage address
- If a value tells Twilite where to navigate, `tlz://` is fine
- If a value identifies where a graph is fetched, use its actual `github://`, `http://`, or `https://` address

## Practical Rule
- Repository location: `github://`
- Web-hosted graph location: `http://` or `https://`
- User-facing navigation inside Twilite: `tlz://`
- Preserve the entered provider address instead of canonicalizing it

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

- `root`: use for graph identity, intent, authority, the implicit root interface, and its Surfaces and optional ground
- `port`: use for an additional named connection endpoint; it points to faces and may carry behaviors, but does not own inline presentation
- `face`: use for a renderable surface; its place in a Surface chain determines its fallback order
- `content`: use for durable markdown, HTML, SVG, text, JSON, or image material through `data.content.kind` and `data.content.value`
- `glyph`: use for symbolic node identity at the end of a Surface chain
- `portal`: use for a consumer/opening node that targets another declared surface
- `dictionary`: use only when the task is specifically about dictionary infrastructure or compatibility behavior, not as a substitute for `root` or `port`
- `import` / `export`: use for Bridge boundaries and explicit external authority

## Root-First Starter Pattern
When creating a first real graph-backed node, begin with one `root`. The root is the implicit root Port; do not create a second root Port node. Give it at least one `surface` edge, optionally one `ground` edge, and repeatable `exposes-port` edges only when the graph needs additional named interfaces.

### Declaration guidance
- Put graph identity in `data.identity`
- Always put non-empty `kind` and `scope` fields in `data.intent`
- `data.intent.kind` describes the graph's subject or purpose, such as `person`, `organization`, `event`, `work`, `task-board`, `documentation`, or `graph`
- Use `data.intent.scope: "public"` for intentionally public content, `"local"` for graph-local infrastructure, `"shared"` for reusable shared resources, and `"mixed"` only when the graph genuinely spans scopes or a narrower scope cannot be determined
- `data.root.kind` describes the graph's structural kind, usually `graph`
- `data.intent.kind` describes the graph's subject or purpose, such as `person`, `organization`, `work`, or `plan`
- Set `data.root.targetMode` explicitly, usually `artifact`
- Author Surfaces as `surface` edges, the optional inside frame as a `ground` edge, and additional interfaces as `exposes-port` edges
- Keep `data.root.defaultSurfaceId` aligned with a real `surface` edge
- Keep `dependencies.nodeTypes` honest: list the node types the graph actually uses
- Keep `identity.graphId` consistent across the declaration and graph-owned nodes
- Give the root at least one Surface and no more than one ground
- Leave repeatable `exposes-port` unoccupied when the implicit root interface is sufficient

### Root checklist
- `data.identity.graphId`, `name`, `version`, and `description` should be real values, not placeholders
- `data.intent.kind` and `scope` are required, must be non-empty, and should describe the graph honestly
- `data.root.kind`, `targetMode`, and `defaultSurfaceId` should be real values, not placeholders
- `data.root.defaultSurfaceId` must resolve to a real Surface edge
- A Surface edge points to a face and carries its `data.surfaceId`; its chain ends in a glyph
- A ground edge, when present, leaves from the root's `ground` port and points to the graph's authored frame
- Named ports are optional and explicitly exposed. Never infer a named or sole port as root
- Do not author legacy classification or view aliases in new roots: `artifactKind`, `graphViewRole`, `declaresKind`, `primaryNodeViewId`, `primaryEditorViewId`, `iconViewNodeId`, or `portViewNodeId`
- Twilite may still read those legacy fields from existing graphs as silent compatibility fallbacks; their presence or staleness must not make a root invalid
- A graph with a partial root may load, but it can still trigger saveability or interpretation problems

### Custom node classes are executable infrastructure

- A `.node-class.node` file is itself an inspectable graph artifact; a working renderer does not excuse a poor definition graph
- Author one real `root`, one explanatory `content` contract node, and visible primitive `port` nodes for the surfaces the class exposes
- Expose the root through the class's primary face or port, set `data.root.defaultSurfaceId` to a real Surface id, and retain only the faces and surfaces the class actually needs
- Connect the root directly to the contract content and each exposed port with meaningful edges; do not chain loose faces merely to make the graph connected
- Give every definition node a deliberate position and complete canonical `ports`; include matching `inputs` and `outputs` when the class-artifact convention requires the full shape
- Every authored editor field must have a meaningful representation in the detail surface. Summary and icon surfaces are deliberate smaller projections, not discarded editor data
- `data.dependencies.nodeTypes` is descriptive; it does not register a custom type or grant runtime authority
- Every external node class used by the graph requires a real `import` node pointing to its `.node-class.node` resource
- Give the import focused-graph creation authority with `scope: "focused-graph"` and `grants: ["create"]`
- Connect the root to the import using the graph's class-authority edge pattern
- Store each class instance's key in `type` and durable class address in `data.classRef`; loaded `_classBinding` is compatibility state and is not written
- Preserve `data.bridge` provenance and the import-to-instance instantiation edge when the template supplies them
- A node with `type: "person"`, `type: "role"`, or another custom type is not sufficiently class-resolved merely because that string appears in `dependencies.nodeTypes`

### Deriving a graph from a template

- Clone the template structurally; do not recreate only what is visually apparent
- Preserve the root, Surface edges and chains, real face targets, class imports, authority edges, class bindings, instantiation edges, and required port contracts
- Replace or extend example content only after the executable infrastructure is intact
- Omit infrastructure only when the relevant class or template contract explicitly says it is optional
- Never infer that a custom node type is globally available

### Root editor contract
If you author a custom editor for a `root`, treat the built-in root editor as the minimum executable contract.

- A custom declaration editor may choose its own layout, styling, grouping, and HTML
- A custom declaration editor may present the fields in a different order
- A custom declaration editor may use a class-backed editor surface instead of the stock visual layout
- But if it claims to edit a `root`, it must still correctly edit the root contract

Minimum required root fields:

- `data.identity.name`
- `data.identity.graphId`
- `data.identity.version`
- `data.identity.description`
- `data.intent.kind`
- `data.intent.scope`
- `data.root.kind`
- `data.root.targetMode`
- `data.root.defaultSurfaceId`
- at least one `surface` edge and its `data.surfaceId`
- `data.purpose`
- optional `data.analytics` through the bounded analytics opt-out control

Legacy declaration metadata remains readable when present but is not part of the authoring contract.

Required declaration-editor behaviors:

- `data.identity.graphId` is not just a text box:
  - changing it must participate in the graph id rename flow
  - the declaration node id and canonical graph id must stay aligned
- `data.root.kind` is the graph's structural kind:
  - do not substitute `data.intent.kind` or legacy duplicates such as `data.declaresKind` and `data.declaration.artifactKind`
  - use a control that permits real graph kinds rather than a closed list
- `data.root.defaultSurfaceId` is not a freeform string only:
  - it should resolve against a real Surface edge
  - it should not silently point at a missing Surface
- Surface and ground edges are the authored presentation contract:
  - preserve each Surface id and target face, and preserve a valid ground edge when present
  - the editor should preserve valid graph relationships instead of downgrading them into opaque text
- analytics is inherited repository policy with bounded reporting metadata:
  - verified public GitHub repositories participate under the default Commons policy; private, local, unresolved, and unrecognized sources fail closed
  - declarations may provide optional `pageTitle`, `contentGroup`, and hosted `url` fields but cannot change participation
  - do not reduce analytics authoring to an opaque JSON textarea

Failure rule:

- If a custom declaration editor cannot correctly edit those required fields and behaviors, it is not a valid declaration editor
- Twilite injects omitted primitive baseline fields into class-backed editors so valid declarations remain editable
- Authored fields win at matching paths, and classes may add fields, sections, appearance, help, and specialized behavior
- Class authors must still declare the complete baseline; fallback injection is a safety net, not alternate syntax
- Unsupported extension field types remain authoring errors until the runtime explicitly implements them

### Graph analytics repository policy

Focused graph page views inherit policy from their verified source repository. Analytics permission is not declaration-owned.

```json
"analytics": {
  "pageTitle": "Optional reporting title",
  "contentGroup": "people",
  "url": "https://example.com/people/example.node"
}
```

- Put the optional object on the declaration node at `data.analytics`
- Absence of `data.analytics` does not affect repository enrollment
- Legacy `enabled` values are ignored for permission decisions
- `pageTitle`, `contentGroup`, and `url` are the authored reporting fields currently supported; all are optional
- `url` must name a real HTTPS-hosted graph location; never infer one merely because the graph is stored on GitHub
- Do not author `page_location`, a measurement id, arbitrary event parameters, dispatch instructions, or consent state in the graph
- Twilite resolves `page_location` from the graph's real hosting state:
  - a directly loaded HTTP(S) graph reports its actual sanitized source URL
  - a GitHub-only graph reports its deterministic Twilite HTTPS launch URL
  - a valid `analytics.url` overrides a GitHub storage ref only when it names a real HTTPS-hosted graph
- Keep durable identity, provider fetch location, hosted location, and Twilite launch location distinct:
  - `github://...` identifies stored repository content, not a hosted page
  - a direct HTTP(S) graph URL identifies a hosted graph resource
  - a provider URL or API may be the fetch location
  - `https://twilite.zone/?doc=...` is the web launch location for a graph without its own hosted address
- A page view occurs only when an eligible graph becomes the focused Twilite document after a successful load
- Twilite Back and Forward may create new page views; retries, previews, embeds, bridges, class resolution, and background loads must not
- Graph navigation belongs to Twilite's browser history and must not mutate web-browser history merely for analytics
- Twilite defaults all advertising-related consent states to denied and keeps advertising signals disabled
- Never rely on graph content or a portal to establish eligibility; the runtime rechecks provider visibility, Commons recognition, and repository identity at dispatch

### Port guidance
- When a user says "create a port for this graph", interpret that as: create a graph-owned entry surface that can open or connect back to this graph
- Before inventing a port shape, inspect the port tutorial graph: `github://twilite-zone/public/tutorial/basic-primitives/port/root.node`
- Put the graph id on the port too: `data.identity.graphId`
- Give the port a real navigation target in `data.target`
- For a graph-owned entry port, prefer `data.target.graphId` and `data.target.mode: "navigate"` unless the graph is using a more specific endpoint contract
- A port points to faces through graph edges; it does not own an inline face or content payload
- If a port needs a preview, expose a face whose content is a separate `content` node
- Before returning the transaction, parse the complete payload as strict JSON
- When authoring inline SVG in JSON, copy a known-good SVG specimen and edit only the shapes, colors, labels, and geometry
- Do not hand-type or rewrite the `xmlns` attribute unless you are pasting the exact raw XML namespace
- Do not paste markdownified links such as `[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)` into SVG attributes
- Do not emit placeholder inline render fields on ports or portals
- `data.sourceNodeId` may delegate a port's view only to a node in the same graph
- `data.targetNodeId` may delegate a port's landing focus only to a visible node in the same graph
- Do not invent `sourceNodeId`, `targetNodeId`, or edges to nodes that do not exist
- Do not expect `title`, `description`, `icon`, or `cover` alone to render a port card body; expose a real face and content when a preview is needed

### What "create a port" usually means
- Create a real `port` node, not a `portal`, `content`, or `dictionary`
- Make it graph-owned with `data.identity.graphId`
- Every graph has exactly one implicit root Port: the root node itself. Do not create a second root Port node.
- A named port points to its faces through explicit relationships and may carry behavior, but it does not own presentation inline.
- Port delegation is graph-local. Do not put `data.sourceRef` on a port or delegate a port view or landing target to another graph; use a `portal` for every cross-graph consumer
- Give non-root ports an explicit target only when their purpose requires navigation or connection
- Give it a real preview payload if you want it to render as a card
- Expose a named port deliberately with an `exposes-port` edge from the root; a port node's existence does not make it externally connectable
- Do not stop at metadata-only fields such as `title`, `icon`, `description`, or `cover`

### Reference specimens in this repo
- Primary tutorial reference: `github://twilite-zone/public/tutorial/basic-primitives/port/root.node`
  - Use this first when the task is to author or repair a `port`
  - It now includes a markdown reader port, an SVG card port, an HTML port, a graph entry port, and a sample consumer portal
  - Copy the pattern that matches the user request instead of inventing a new schema
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
  - use the tutorial graph first
  - use the real target shape from the navigate specimen when you need a portal-style opener
  - use the real SVG/render-shape pattern from the visual specimen when you need a custom card
  - do not invent a third schema

### SVG red flags
- If you see `[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)` anywhere inside `data.svg`, the payload is invalid
- If you see unescaped `"` characters inside the SVG string in JSON, the transaction is invalid
- The safe inline form is `"svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 180'>...</svg>"`
- If you are not sure the SVG string is safe, use a simpler `markdown` preview instead of inventing a new SVG block from scratch

### Portal guidance
- A `portal` is a consumer/opening node, not the place to stash blank preview payloads
- If the portal should preview a remote surface, bind it through `data.sourceRef`, `data.sourceNodeId`, `data.sourcePayload`, and `data.target`
- If the portal should navigate only, keep the navigation target clean and omit inline payload fields entirely
- Keep the durable graph/save address as the clean `.node` ref and store the selected declared port separately as `data.target.surfaceId`
- A bare graph address resolves the root's default Surface; portal navigation passes any named Surface as separate transient intent
- The older `<graph-ref>:<surface-id>` input form may be parsed for compatibility, but the viewer must normalize it back to the clean graph ref before updating the address bar or save target
- A port node is not public merely because it exists. The root must expose it through an `exposes-port` edge
- When a requested port is missing, hidden, ambiguous, or not exposed, navigation fails before the destination replaces the current graph
- In the portal editor, select from the destination graph's declared surfaces instead of typing an internal node id
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

### Complete SVG port transaction
When the user asks to add a port to the current graph, create the real port and expose that same node through the declaration in one transaction. Inspect the declaration first, use its real id and graph id, and preserve every existing surface when supplying the complete `surfaces` array.

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "createNodes",
      "nodes": [
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
              "graphId": "example-graph",
              "name": "Example Graph"
            },
            "target": {
              "graphId": "example-graph",
              "mode": "navigate"
            },
            "viewRole": "card",
            "renderShape": {
              "kind": "svg"
            },
            "svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 420 240' width='100%' height='100%' preserveAspectRatio='xMidYMid meet' role='img' aria-label='Example graph entry'><rect width='420' height='240' rx='28' fill='#0f172a'/><text x='210' y='112' text-anchor='middle' fill='#f8fafc' font-family='Inter, system-ui, sans-serif' font-size='28' font-weight='700'>Example Graph</text><text x='210' y='148' text-anchor='middle' fill='#bae6fd' font-family='Inter, system-ui, sans-serif' font-size='15'>Open graph</text></svg>"
          },
          "style": {
            "background": "transparent",
            "border": "none",
            "borderRadius": 28,
            "padding": 0
          }
        }
      ]
    },
    {
      "action": "updateNode",
      "id": "example-declaration",
      "updates": {
        "data": {
          "declaration": {
            "defaultSurfaceId": "root",
            "surfaces": [
              {
                "id": "root",
                "kind": "port",
                "label": "Root",
                "memo": "Required safe graph entry port.",
                "portNodeId": "example-entry-port"
              }
            ]
          }
        }
      }
    }
  ]
}
```

The example is illustrative. Replace its ids with inspected real ids. If the declaration already has surfaces, include all of them in the replacement array and add the new surface; never erase existing surfaces accidentally.

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

### Lossless script-source boundary

- Put graph-owned JavaScript in `data.source`.
- Escape it only as required to make the containing graph or transaction valid JSON.
- After JSON parsing, treat the resulting source string as opaque authored JavaScript.
- Do not globally expand `\n`, `\r`, backslashes, quotes, template literals, regular expressions, or HTML-looking text.
- A remaining escape such as `.join('\n')` belongs to JavaScript and must reach the ScriptRunner unchanged.
- Decode source only at an explicit import boundary that declares an external encoding.

The required transport is:

```text
JSON transport -> one JSON decode -> unchanged data.source -> ScriptRunner
```

If compilation fails, report it as a script compilation failure with the source
node id. Do not silently rewrite the source and retry.

## Markdown content versus node styling

- `data.markdown` is for authored content, not for canvas styling
- Do not use inline CSS inside markdown payloads to change text color, borders, or layout
- Twilite sanitizes markdown HTML, so `style=` attributes inside markdown should be treated as unsupported authoring
- Use node-level style fields like `style.color`, `style.background`, `style.borderColor`, and `style.boxShadow` for the node's presentation
- If the authored content itself must be richly styled, use an `html` or `svg` render path instead of trying to smuggle CSS through markdown

### Markdown styling anti-pattern

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

Correct intent-preserving alternative:

```json
{
  "action": "updateNode",
  "id": "classic-rag",
  "updates": {
    "style": {
      "color": "#172033"
    },
    "data": {
      "markdown": "# Classic RAG"
    }
  }
}
```

### Task identity and graph promotion

- Keep `task` as the semantic type inside a task's own graph and when another graph consumes it.
- Treat project as a scope and point-of-view description, not a separate node type.
- Keep small work as local task nodes when the containing graph owns it completely.
- Promote a task into its own graph when it needs subordinate structure, independent authority, or an exposed durable surface.
- Promotion changes authority and detail, not semantic type. Leave an ordinary portal-backed task projection in the parent collection or workboard.
- Use a task collection as a durable index. Use a workboard as an operational projection with local `data.board` policy.
- Keep status and progress in the authoritative task graph; keep lane, rank, pinning, and review time in the consuming workboard.
- Treat a graph-adjacent `SKILL.md` and its neighboring template graph as one versioned derivation package.

### Do not substitute nearby primitives
- If the user asks for a `root`, create a `root`, not a `dictionary`
- If the user asks for a `port`, create a `port`, not a `content` node
- Do not treat ad hoc `data.ports` on another node type as a replacement for a real `port` node
- Do not satisfy a root-and-port request with only styling and a reference edge
- Do not omit `data.root.targetMode`, `data.root.defaultSurfaceId`, or the real `surface` edges when authoring a root
- Do not emit empty inline payload placeholders such as `html: ""` or `svg: ""` on `port` or `portal` nodes
- Do not put the graph id at `data.graphId` when authoring a real port; use `data.identity.graphId`
- Do not return a metadata-only card when the user asked for a working port back to the graph
- Do not add an external delegated target to the root. Root is the graph's safe entry boundary; use a named port for deliberate forwarding
- Do not assume `cover`, `icon`, and `description` will render a visual card body on their own
- Do not author a normal graph root as:
  - `data.root.kind: "knowledge-graph"`
  - `data.root.targetMode: "graph"`
  - a surface whose kind is only `card`
- For a normal graph, prefer:
  - `data.root.kind: "graph"`
  - `data.root.targetMode: "artifact"`
  - a `surface` edge to a face

You are now part of the graph’s memory.
Care for it.
