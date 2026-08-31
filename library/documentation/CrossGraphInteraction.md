# Cross-Graph Interaction and Typed Handoffs

Twilite separates four concerns that often look like one action in the UI:

1. A **Portal** owns opening, expanding, and collapsing another graph.
2. An **inter-graph edge** owns durable connectivity between declared graph, node, and Port identities.
3. The **focus transition** owns camera movement and may follow a rendered edge route.
4. A **typed handoff envelope** owns runtime data delivery.

Do not move one responsibility into another merely because the same gesture exposes them together. Creating an edge must not make it an expansion command. Sending data must not silently open a graph. Focusing a node must not mutate graph content.

## Authoring an inter-graph edge

The UI creates an inter-graph edge when an author starts from a node in one graph and drops on a node inside an expanded fragment. Twilite records the durable semantic endpoints under `edge.data.interGraph`:

```json
{
  "version": 1,
  "source": {
    "graphRef": "github://owner/repo/graphs/host.node",
    "graphId": "host-graph",
    "nodeId": "producer-script",
    "portId": "result"
  },
  "target": {
    "graphRef": "github://owner/repo/graphs/fragment.node",
    "graphId": "fragment-graph",
    "nodeId": "receiver",
    "portId": "set"
  }
}
```

The canvas endpoint may temporarily project onto the responsible Portal while the fragment is collapsed. `data.interGraph` remains authoritative and must retain the canonical node and Port identities. Re-expansion reconnects the edge to the materialized target.

## Focus behavior

Following a connected node uses the shared focus transition. When a rendered route exists, the camera may follow that route. Reduced-motion preferences must produce coherent immediate navigation without forcing animation.

Focus is presentation state. It does not deliver data, expand an unrelated graph, or rewrite the edge contract.

## Typed handoff v1

Script nodes send through the bounded host API:

```js
return await api.sendHandoff({
  edgeId: 'host-to-fragment-handoff',
  payload: {
    schema: 'twilite://schema/text@1',
    contentType: 'text/plain',
    value: 'Hello from the host graph'
  }
});
```

The runtime derives the source and destination from the authored inter-graph edge. The Script does not supply replacement endpoint addresses.

The returned envelope contains:

- `version`, `id`, and `correlationId`
- `mode` and `lifetime`
- durable `source` and `destination` graph, node, and Port identities
- payload `schema`, `contentType`, and `value`
- run provenance and creation time
- an explicit delivery result

V1 supports only:

- `mode: "send"`
- `lifetime: "ephemeral"`
- one expanded destination
- one explicitly selected edge when a source output has multiple routes

Request-response, streaming, session storage, durable delivery, retries, replay, persistence, and fan-out are reserved. An agent must not claim or encode them as working behavior.

## Validation and authority

Before emitting receiver input, Twilite verifies:

- the Script has mutation authority
- the edge has a valid inter-graph contract
- the source node and declared output Port match the edge
- the destination fragment is expanded and its canonical node resolves
- the destination Port is a declared input
- the payload schema is compatible with both Ports

The receiver sees a normal `nodeInput` event at the addressed Port. The receiving node class decides whether to display the raw value, retain the envelope, format a projection, or perform another bounded behavior.

Rejected delivery does not emit receiver input. The returned envelope uses `delivery.status: "rejected"` with a code and message. Common v1 codes include:

- `AUTHORITY_REQUIRED`
- `ROUTE_NOT_FOUND`
- `ROUTE_AMBIGUOUS`
- `DESTINATION_NOT_EXPANDED`
- `SCHEMA_REQUIRED`
- `SCHEMA_MISMATCH`
- `MODE_UNSUPPORTED`
- `LIFETIME_UNSUPPORTED`

Generic `nodeOutput` propagation never crosses an inter-graph edge. Cross-graph data must use `api.sendHandoff`; otherwise it would bypass schema and authority validation and could deliver twice.

## Canonical smoke pair

Host:

```text
github://mikemartinez1974/public/graphs/cross-graph-focus-smoke/host.node
```

Fragment:

```text
github://mikemartinez1974/public/graphs/cross-graph-focus-smoke/fragment.node
```

Test the happy path:

1. Open the host.
2. Expand **Fragment Portal**.
3. Confirm **Received Handoff** is visible in the fragment.
4. Run **Send Typed Handoff** with mutation authority enabled.
5. Confirm the receiver shows the authored payload and the Script result reports `delivery.status: "delivered"`.

Test the boundary:

1. Collapse the fragment.
2. Run the producer again.
3. Confirm `delivery.status: "rejected"` and `delivery.code: "DESTINATION_NOT_EXPANDED"`.

## Agent rule

Inspect the exact edge, both declarations, and both Port contracts before changing cross-graph behavior. Treat authored endpoint mistakes as graph-content problems and delivery/focus/materialization mistakes as runtime problems. Preserve the separation between connectivity, expansion, focus, and data.
