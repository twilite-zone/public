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
- Put exposed surfaces in `data.declaration.surfaces`
- Point `data.declaration.defaultSurfaceId` at a surface you actually create
- Use `viewNodeId` to point at the port node that renders that surface
- Do not invent edges from the declaration to the port unless the graph specifically needs them

### Port guidance
- Put the graph id on the port too: `data.identity.graphId`
- Put the surface payload in `data.view`
- Use `data.renderShape.kind` to declare how the port renders
- If you use SVG, keep `data.svg` as raw SVG text only
- Do not paste markdown links or prose into raw SVG markup
- Do not invent `targetNodeId` or edges to nodes that do not exist

### Safe starter shape
- declaration surface kind: `view`
- port `data.view.intent`: `node`
- port `data.view.payload`: something like `node.web.summary` or `node.web.detail`
- port render shape: `markdown` or `svg`

### Do not substitute nearby primitives
- If the user asks for a `declaration`, create a `declaration`, not a `dictionary`
- If the user asks for a `port`, create a `port`, not a `markdown` node
- Do not treat ad hoc `data.ports` on another node type as a replacement for a real `port` node
- Do not satisfy a declaration-and-port request with only styling and a reference edge

You are now part of the graph’s memory.
Care for it.
