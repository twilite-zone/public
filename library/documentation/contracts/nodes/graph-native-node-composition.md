# Graph-Native Node Composition Contract

This is the current write-new authoring model for graph-backed Twilite nodes. Older graphs remain readable, but agents must not copy their legacy root Port, side handles, inline Port presentation, or format-specific content primitives into new work.

## Structural roles

- A `declaration` is the node's implicit root Port. Do not add a separate root Port node.
- A `port` is a named connection endpoint. Its `label` is its authored public name.
- A `view` is a renderable surface. Semantic role comes from its relationship to a Declaration or Port, not from an independently authored level field.
- A `content` node owns durable material through `data.content.kind` and `data.content.value`.
- A `glyph` node defines symbolic identity. It is not an icon View.
- A `portal` consumes an exposed Port or navigates into it. It is not a View or a Port.

## Declaration contract

A new Declaration has five singular relationships plus one optional repeatable Port relationship, and no legacy root or four-side handles:

| Endpoint | Role | Required | Repeatable | Default target |
| --- | --- | --- | --- | --- |
| `default-view` | default detail View | yes | no | `view.root` |
| `summary-view` | shared summary View | yes | no | `view.root` |
| `icon-view` | shared icon View | yes | no | `view.root` |
| `glyph` | shared glyph definition | yes | no | `glyph.root` |
| `port` | exposes an additional named Port | no | yes | `port.root` |
| `landing-surface` | navigation and frame anchor | yes | no | `content.root` or another focusable surface |

Use the runtime-authored placement: the three View relationships are grouped on the left; landing surface is on the right; glyph is on top; repeatable Port creation is on the bottom. The Declaration-to-landing-surface geometry defines the authored interface frame and minimap viewport. The default View selects presentation; it does not size the node.

## Port contract

A Port has:

- one `root` interface endpoint whose direction is `input` or `output`;
- `default-view`, `summary-view`, `icon-view`, `glyph`, and `landing-surface` relationships;
- optional behaviors, such as `drag-create`, when interaction should do more than connect.

The three View relationships sit together on the left. Landing surface sits on the right. On a Port, the root interface is on top and glyph is on the bottom. A Port points to Views; it does not store inline View content. Detail is required by structure, while summary and icon may resolve through shared fallback. A behavior creates or acts; the Port itself remains the connection endpoint.

## View and Content contract

A View has an inbound `root` endpoint at the top and an optional outbound `surface-delegate` relationship at the bottom. It may own `data.content` directly or delegate to a Content node. A surface delegate creates or targets `content.root`.

A Content node has one inbound `root` endpoint and owns:

```json
{
  "content": {
    "kind": "markdown",
    "value": "# Authored material"
  }
}
```

Use `kind` values such as `markdown`, `html`, `svg`, `text`, `json`, or `image`. Do not add `renderShape` presentation hints to new View or Content nodes; `content.kind` is authoritative. Legacy `renderShape`, Markdown, and SVG nodes remain readable.

## Relationship authority

Relationships define meaning:

- `default-view`
- `shared-summary`
- `shared-icon`
- `shared-glyph`
- `exposes-port`
- `landing-surface`
- `view.content`

Do not duplicate those roles as unrelated editor fields. Do not infer a View's semantic role from its label. Validate singular required relationships, edge endpoints, named ports, and save/reload stability.

## Agent checklist

Before calling a graph-backed node or template current:

1. Start from a Declaration with the six authored relationship endpoints.
2. Supply default, summary, and icon Views, one Glyph, and one landing surface.
3. Leave `port` unoccupied when the implicit root interface is sufficient; add each additional named Port through the repeatable `port` relationship.
4. Give Views owned Content or an explicit `surface-delegate` edge.
5. Keep Port behavior separate from View and Content ownership.
6. Verify the interface widget, landing-surface frame, semantic zoom, navigation, and save/reload.
7. Preserve old fields only for reading; write the current model.
