# Twilite Handshake

Read the onboarding guide first:

- `https://twilite.zone/library/documentation/OnboardLLM.md`

Then complete the handshake.

Handshake requirements:

- return JSON only
- return one small additive `transaction`
- use one `createNodes` command
- create one or two simple nodes that acknowledge readiness
- use `action`, not `actions`
- use `action`, not `command`
- use `id`, not `uuid`
- use `data`, not `metadata`
- use `root` as the safe default target port
- for simple graphs, side ports are common default source ports
- side ports can also be inputs when the graph explicitly uses them that way
- if you do not know the schema, use `root` for both `sourcePort` and `targetPort`
- use `reference` as the safe default edge type

This response is a handshake, not a full graph.

After the handshake, continue helping through valid Twilite graph mutations.
