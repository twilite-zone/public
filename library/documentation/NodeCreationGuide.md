# Twilite Node Creation Guide

This guide explains how to create node types in Twilite with the current runtime and editor behavior.

Use this as the canonical reference for:
- creating a new node class graph,
- bridging it into a host graph,
- validating it,
- and working with LLM copy/paste constraints.

---

## 1) Mental Model

In Twilite, there are two different things:

- **Node instance**: a concrete node in a host graph (`type`, `label`, `data`, `ports`, `position`).
- **Node class**: a graph document that defines how a type behaves/renders through declaration and view surfaces, with dictionary tolerated only for legacy compatibility.

The host graph should import class authority through a visible `bridge`. The bridged instance then carries `_classBinding` for runtime resolution.

---

## 2) What Makes a Type Available in the Palette

A type appears as usable when the graph exposes a visible node-class bridge for it.

Important:
- `key` must match the `type` you create on instance nodes.
- `ref` must resolve from the bridge target.
- No bridge means no class authority. Without a bridge, the graph should stay on primitive node types.

---

## 3) Node Class Graph Minimum Shape

A class graph should contain at least:

1. `declaration` node (or legacy `manifest` during migration)
2. one class declaration surface (`declaration` is preferred; `dictionary` is legacy compatibility only)
3. at least one `view` node for `node.web`
4. optional `view` node for `editor.web`
5. optional `markdown` notes node

Recommended identity:
- `data.identity.graphId`: stable class ID
- `data.intent.kind`: `"definition"`
- `data.intent.scope`: `"node"`

Legend entries are derived from visible bridge/class structure. Do not add a graph-local Legend node just to make a new graph usable. The host graph should not need its own dictionary registration for usage if the class comes in through a bridge.

---

## 4) View Semantics (Current Behavior)

- `node.web`: render behavior in-canvas for the node instance.
- `editor.web`: edit UI behavior for the node instance.

Notes:
- Runtime now prefers local `_classBinding` and bridge-derived registry state before any legacy dictionary fallback.
- Do not rely on host-dictionary registration as the primary way a bridged class becomes renderable.
- Keep `data` schema stable and documented in your class notes.

---

## 5) Ports and Edges for New Types

For instance nodes:
- Declare `ports` explicitly when the node is intended for graph flow.
- If omitted, `root` is treated as the default virtual port path in many flows.

For edges:
- Always persist both `sourcePort` and `targetPort`.
- If unspecified, set both to `"root"`.

Example edge:

```json
{
  "id": "edge-uuid",
  "source": "node-a",
  "sourcePort": "root",
  "target": "node-b",
  "targetPort": "root",
  "type": "relates"
}
```

---

## 6) LLM Copy/Paste Workflow (Critical)

Because many LLM workflows can only safely emit one artifact at a time, use this protocol:

### Pass 1: Create class file
- Output full class graph JSON only.
- Save to `/library/classes/nodes/<name>.node-class.node`.

### Pass 2: Add host bridge
- Output only host graph mutation creating the bridge node/port that points at the class graph.
- Do not mix unrelated graph rewrites in same pass.

### Pass 3: Smoke instance
- Output `createNodes` (and optional `createEdges`) that creates one instance through that bridge path.
- Verify create/edit/save/reload behavior.

Do not ask the LLM to create class file + update host + create instances in one huge paste command.

---

## 7) Path and Reference Rules

Use one of these `ref` styles:

- local absolute path in Twilite-hosted content:
  - `"github://twilite-zone/public/library/classes/nodes/my.node-class.node"`
- fully qualified remote URL:
  - `"https://twilite.zone/library/classes/nodes/my.node-class.node"`

Avoid ambiguous strings without leading slash/scheme when possible.

---

## 8) Validation Checklist Before You Trust a New Type

1. Legacy dictionary:
- only if you are intentionally maintaining a legacy class graph.
- host graph should not require dictionary registration for a bridged class.
- treat dictionary surfaces as compatibility or projection, not as the primary authority path for new work.

2. Instance:
- Can create from visible bridge vocabulary.
- Node renders expected `node.web` behavior.
- Edit flow works (properties or editor view).

3. Persistence:
- Save, reload, and verify:
  - `type` unchanged,
  - `data` unchanged,
  - `ports` preserved,
  - edges preserved with explicit ports.

4. Cross-surface:
- Verify in web and VS Code plugin if both are target runtimes.

---

## 9) Recommended Starter Pattern for New Types

Start simple:

- version `0.1.0`
- one required `data` field
- one `node.web` rendering path
- optional `editor.web` for ergonomics
- no script side effects until basic persistence is stable

Then iterate:

1. add richer data schema,
2. add editor controls,
3. add script/runtime behavior,
4. add integration edges/ports.

---

## 10) Common Failure Modes

- Type key mismatch between instance `type` and bridged class key.
- Broken `ref` path (wrong prefix, wrong case, wrong folder).
- Host graph relying on dictionary registration instead of a bridge.
- Creating new dictionary infrastructure when the graph should be importing class authority through visible bridges.
- Edge creation without explicit ports.
- Single giant transaction trying to mutate multiple files/contexts at once.

---

## 11) Quick Templates

### Host bridge target

```json
{
  "endpoint": "github://twilite-zone/public/library/classes/nodes/node.node-class.node:root",
  "mode": "bridge",
  "kind": "node-class",
  "key": "node"
}
```

### Instance node

```json
{
  "id": "uuid-v4",
  "type": "node",
  "label": "My Node",
  "position": { "x": 200, "y": 120 },
  "width": 360,
  "height": 220,
  "data": {
    "content": "# Hello"
  }
}
```

### Root edge fallback

```json
{
  "id": "uuid-v4",
  "source": "a",
  "sourcePort": "root",
  "target": "b",
  "targetPort": "root",
  "type": "relates"
}
```

---

## 12) Decision Rule: Which Primitive to Use

- Need a new reusable type: create a **node class**.
- Need direct navigation/action endpoint: use a **port node**.
- Need embedded child graph runtime: use **graph-reference**.
- Need one-off text link: use **markdown + tlz://**.
- Need custom executable extension: use **plugin/script** with explicit trust model.
