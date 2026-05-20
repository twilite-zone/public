# Edge Contracts

This document defines the **minimal, portable contract** for edges in Twilite graphs.

Edges express relationships.

Plain edges remain valid without classes. Edge classes are the canonical semantic upgrade path.

---

## Required Fields

Every edge must include:

```json
{
  "id": "string",
  "source": "node-id",
  "target": "node-id"
}
```

- `id` must be unique within the graph.
- Readable stable ids are valid; UUIDs are allowed but not required.
- `source` and `target` must reference existing nodes.
- If `type` is omitted, the minimum render resolution is a plain line.

---

## Fields

```json
{
  "label": "string",
  "data": {
    "edgeClassRef": "github://twilite-zone/public/library/classes/edges/task-depends-on.edge-class.node",
    "edgeClassKey": "task.depends-on",
    "edgeClassMeaning": "target must happen before source can complete"
  },
  "style": { "any": "json" },
  "state": { "any": "json" },
  "sourcePort": "port-id",
  "targetPort": "port-id"
}
```

- `label` is human-readable, not semantic logic.
- `data` is where semantic attributes and optional edge-class assignment metadata live.
- `style` and `state` are optional metadata.
- `sourcePort` / `targetPort` may be omitted; omitted ports are treated as `root`.

---

## Port Rules

- `sourcePort` / `targetPort` may be omitted.
- Omitted ports are interpreted as the default `root` port.
- If ports are provided, they must match declared ports on the node.
- Tools and agents must not invent non-existent ports.

---

## Edge Types

Edge `type` may be provided as a string runtime render primitive.

Examples currently in use include:

- `reference`
- `relates`
- `default`
- `straight`
- `governs`

Moving forward:

- A plain edge remains valid without a class or type.
- If `type` is omitted, the renderer falls back to a simple line.
- When an edge class is assigned, the class may provide `defaultEdgeType`.
- An instance-level `type` override wins when both are present.

Projects may still use additional string types, but durable relationship meaning should live in the edge class when reusable semantics are intended.

---

## Edge Class Assignment

A plain edge remains fully valid without a class.

When an edge is classified, the canonical structure is:

```json
{
  "data": {
    "edgeClassRef": "github://twilite-zone/public/library/classes/edges/task-depends-on.edge-class.node",
    "edgeClassKey": "task.depends-on",
    "edgeClassMeaning": "target must happen before source can complete"
  }
}
```

Rules:

- `data.edgeClassRef` is the authoritative class reference moving forward.
- `data.edgeClassKey` is the stable human/search key and should match the referenced class when both are present.
- `data.edgeClassMeaning` is mirrored display metadata only; it is not the semantic authority.
- The class artifact at `manifest.data.edgeClass` owns `meaning`, `defaultEdgeType`, and `renderDefaults`.
- Instance `style`, `label`, and explicit `type` may override class defaults.
- If neither instance `type` nor class `defaultEdgeType` is present, the renderer falls back to a plain line.

Migration note:

- Legacy graphs may still carry `edgeClassKey` without `edgeClassRef`.
- Readers should tolerate that during migration.
- New authored structures should prefer storing both.

---

## Semantic Attributes (Recommended)

Use `edge.data` to express attributes without creating new types:

```json
{
  "data": {
    "strength": "weak | normal | strong",
    "flow": "none | data | energy | control",
    "direction": "forward | reverse | bidirectional",
    "intent": "string"
  }
}
```

Attributes modify meaning without changing `type`.

---

## Forbidden

Edges must never:

- Reference missing nodes
- Reuse an existing edge `id`
- Invent non-existent ports
- Carry `edgeClassRef` that points at a missing edge-class artifact
- Carry both `edgeClassRef` and `edgeClassKey` with mismatched class identity

---

## Validation Summary

An edge is valid if:

1. `id`, `source`, and `target` exist
2. `source` and `target` exist as node IDs
3. If `type` exists, it is a string
4. If ports are provided, they exist on their nodes
5. Omitted ports are interpreted as `root`
6. If `edgeClassRef` exists, the referenced edge-class artifact exists
7. If both `edgeClassRef` and `edgeClassKey` exist, they agree

This is intentionally minimal to preserve portability.
