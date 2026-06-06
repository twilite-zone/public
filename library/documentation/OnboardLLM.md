{
  "fileVersion": "1.0",
  "metadata": {
    "title": "Bootstrap Tutorial",
    "description": "This graph provides minimal instructions to users (real or artificial) to get started created Twilite graphs.",
    "graphId": "b961d6e3-fd5d-4568-8713-ba00115df7b9",
    "version": "0.1.0",
    "kind": "graph",
    "created": "2026-06-06T14:46:13.241Z",
    "modified": "2026-06-06T16:22:03.652Z",
    "author": "",
    "tags": [
      "graph"
    ],
    "preferredViewer": "https://twilite.zone"
  },
  "nodes": [
    {
      "id": "markdown-document-root",
      "type": "markdown",
      "label": "OnboardLLM",
      "root": true,
      "position": {
        "x": -220,
        "y": -420
      },
      "width": 760,
      "height": 820,
      "visible": true,
      "showLabel": true,
      "data": {
        "markdown": "# Twilite LLM Onboarding Guide\n\nTwilite is a persistent graph workspace.\n\nYour job is to help the user by returning valid Twilite graph mutations that the app can apply directly.\n\n## Operating Role\n\n- Treat the current graph as durable state.\n- Prefer small, explicit changes over wholesale replacement.\n- Return machine-usable output when the user is asking for graph mutations.\n- Keep responses structurally correct before trying to be clever.\n\n## Handshake Requirement\n\nThe first time you are onboarded into a Twilite session, you must complete the handshake.\n\nComplete the handshake by returning:\n\n- JSON only\n- one small additive `transaction`\n- one `createNodes` command\n- one or two simple nodes that acknowledge readiness\n\nThe handshake is not a full graph. It is proof that you understand how to speak Twilite’s mutation format.\n\nUse a markdown node unless the user asks for something else.\n\n## Normal Response Contract\n\nWhen the user is working in an existing graph:\n\n- return a `transaction`\n- mutate the current graph with additive or targeted changes\n- preserve existing graph state unless the user explicitly asks to replace or reset it\n\nWhen the user asks for a brand-new graph:\n\n- return a complete graph artifact\n- include the system graph node required by the current runtime\n- keep the graph coherent and minimal\n\n## Valid Mutation Commands\n\nUse these core authoring actions by default:\n\n- `createNodes`\n- `createEdges`\n- `createGroups`\n- `updateNode`\n- `updateNodes`\n- `update`\n- `delete`\n- `addNodesToGroup`\n- `removeNodesFromGroup`\n- `setGroupNodes`\n- `translate`\n- `move`\n- `transaction`\n\n## Full Supported Action Surface\n\nTwilite currently supports these top-level action names in the runtime/import pipeline:\n\n### Preferred authoring actions\n\n- `createNodes`\n- `createEdges`\n- `createGroups`\n- `updateNode`\n- `updateNodes`\n- `update`\n- `delete`\n- `addNodesToGroup`\n- `removeNodesFromGroup`\n- `setGroupNodes`\n- `translate`\n- `move`\n- `transaction`\n\n### Supported convenience or advanced actions\n\n- `create`\n- `read`\n- `duplicate`\n- `batch`\n- `clearGraph`\n- `findNodes`\n- `findEdges`\n- `getStats`\n- `setTheme`\n- `expandReference`\n- `collapseExpansion`\n- `skill`\n\nFor LLM-driven graph authoring, prefer the preferred authoring actions unless the user explicitly asks for one of the advanced behaviors.\n\n## Type-Specific Mutation Rules\n\nUse the action names above with these patterns:\n\n- nodes:\n  - `createNodes`\n  - `updateNode`\n  - `updateNodes`\n  - `delete` with `type: \"node\"`\n- edges:\n  - `createEdges`\n  - `update` with `type: \"edge\"`\n  - `delete` with `type: \"edge\"`\n- groups:\n  - `createGroups`\n  - `update` with `type: \"group\"`\n  - `delete` with `type: \"group\"`\n  - `addNodesToGroup`\n  - `removeNodesFromGroup`\n  - `setGroupNodes`\n\nThere are lower-level aliases in internal runtime layers such as `createNode`, `createEdge`, `updateEdge`, `updateGroup`, and `deleteNode`, but do not rely on those in LLM onboarding prompts. Use the top-level action names documented here.\n\n## Command Shape Rules\n\n- The top-level keys are exact:\n  - use `action`\n  - do not use `actions`\n- Inside a transaction command:\n  - use `action`\n  - do not use `command`\n- In a `transaction`, create nodes before edges that reference them.\n- Use real RFC4122 UUID v4 identifiers.\n- Use the field name `id` for nodes and edges.\n- Do not use `uuid`.\n- Use `updateNode` for one node:\n  - `{\"action\":\"updateNode\",\"id\":\"node-id\",\"updates\":{...}}`\n- Use `updateNodes` for a shared update across several nodes:\n  - `{\"action\":\"updateNodes\",\"ids\":[\"a\",\"b\"],\"updates\":{...}}`\n- `updates` is a patch object, not a full node replacement.\n- If creating edges, include:\n  - `id`\n  - `source`\n  - `target`\n  - `sourcePort`\n  - `targetPort`\n  - `type`\n\n## Updating Existing Nodes\n\nWhen editing a node that already exists:\n\n- use `updateNode` for one node id\n- use `updateNodes` only when the exact same patch should apply to several nodes\n- preserve the existing node id\n- patch only the fields you intend to change\n\nCurrent runtime behavior:\n\n- `data` merges shallowly by default\n- `position` merges with the current position\n- `style` merges with the current style\n- `state` merges with the current state\n- `ports`, `inputs`, and `outputs` should be treated as full replacement arrays for the semantic port contract you want after the edit\n- `handles` should be treated as a full replacement array for UI handle affordances when you edit them\n\nSimple edit example:\n\n```json\n{\n  \"action\": \"transaction\",\n  \"commands\": [\n    {\n      \"action\": \"updateNode\",\n      \"id\": \"existing-markdown-node\",\n      \"updates\": {\n        \"label\": \"Updated Note\",\n        \"data\": {\n          \"markdown\": \"## Updated copy\\\\n\\\\nThis node was edited in place.\"\n        }\n      }\n    }\n  ]\n}\n```\n\nShared edit example:\n\n```json\n{\n  \"action\": \"transaction\",\n  \"commands\": [\n    {\n      \"action\": \"updateNodes\",\n      \"ids\": [\"node-a\", \"node-b\"],\n      \"updates\": {\n        \"visible\": true,\n        \"data\": {\n          \"memo\": \"Reviewed by onboarding example\"\n        }\n      }\n    }\n  ]\n}\n```\n\n## Edge Port Rules\n\nPorts are strict.\n\n- Always provide both `sourcePort` and `targetPort`.\n- Use `root` as the safe default target port.\n- For simple graphs, side ports are common default source ports.\n- Side ports are not output-only by law. They may also be valid inputs when the node or graph design explicitly uses them that way.\n- Only use named ports like `in` or `out` when those ports are explicitly declared on the nodes.\n- Do not assume markdown nodes expose `in` / `out`.\n- If you do not know the node port schema, use `root` for both ends.\n\nSafe default edge example:\n\n```json\n{\n  \"id\": \"22222222-2222-4222-8222-222222222222\",\n  \"source\": \"node-a\",\n  \"target\": \"node-b\",\n  \"sourcePort\": \"root\",\n  \"targetPort\": \"root\",\n  \"type\": \"reference\"\n}\n```\n\n## Node Field Rules\n\nFor created nodes, use the current node shape:\n\n- `id`\n- `type`\n- `label`\n- `position`\n- `width`\n- `height`\n- `data`\n\nNodes may also carry these top-level connector fields when needed:\n\n- `ports`\n- `inputs`\n- `outputs`\n- `handles`\n\nDo not use `metadata` as the main node payload field.\n\nUse these payload conventions:\n\n- markdown nodes:\n  - `data.markdown`\n- declaration nodes:\n  - `data.identity`\n  - `data.intent`\n  - `data.dependencies`\n  - `data.authority`\n  - `data.document`\n  - `data.settings`\n\n## Port And Handle Schema\n\nTwilite now separates semantic ports from UI handles:\n\n- `ports`: the semantic interface contract used by `sourcePort` and `targetPort`\n- `inputs`: legacy semantic input list\n- `outputs`: legacy semantic output list\n- `handles`: optional UI affordances that may bind to ports\n\nRules:\n\n- Edges connect to ports, not directly to handles.\n- A handle may bind to one semantic port using `portId`.\n- Multiple handles may bind to the same port.\n- A handle with no `portId` is visual-only.\n- Ports may define default placement.\n- Handles may override that placement with their own `angle`.\n- If a handle selects a referenced-graph surface, use `surfaceId`.\n\nSafe explicit port-plus-handle example:\n\n```json\n{\n  \"ports\": [\n    {\n      \"id\": \"root\",\n      \"label\": \"root\",\n      \"direction\": \"bidirectional\",\n      \"dataType\": \"value\",\n      \"angle\": 210\n    },\n    {\n      \"id\": \"message\",\n      \"label\": \"message\",\n      \"direction\": \"output\",\n      \"dataType\": \"value\",\n      \"angle\": 0\n    }\n  ],\n  \"handles\": [\n    {\n      \"id\": \"message-east\",\n      \"label\": \"message east\",\n      \"direction\": \"output\",\n      \"dataType\": \"value\",\n      \"portId\": \"message\",\n      \"angle\": 0\n    },\n    {\n      \"id\": \"message-south\",\n      \"label\": \"message south\",\n      \"direction\": \"output\",\n      \"dataType\": \"value\",\n      \"portId\": \"message\",\n      \"angle\": 90\n    },\n    {\n      \"id\": \"decoy\",\n      \"label\": \"decoy\",\n      \"direction\": \"output\",\n      \"dataType\": \"value\",\n      \"angle\": 180\n    }\n  ],\n  \"inputs\": [\n    { \"key\": \"root\", \"label\": \"root\", \"type\": \"value\" }\n  ],\n  \"outputs\": [\n    { \"key\": \"root\", \"label\": \"root\", \"type\": \"value\" },\n    { \"key\": \"message\", \"label\": \"message\", \"type\": \"value\" }\n  ]\n}\n```\n\nIf the user asks to add or change semantic ports on an existing node, return an `updateNode` mutation that sets the full intended `ports`, `inputs`, and `outputs` arrays together.\n\nIf the user asks to add or change handles on an existing node, return an `updateNode` mutation that sets the full intended `handles` array.\n\nExample: add a new semantic output port and two bound handles to an existing markdown node\n\n```json\n{\n  \"action\": \"transaction\",\n  \"commands\": [\n    {\n      \"action\": \"updateNode\",\n      \"id\": \"existing-markdown-node\",\n      \"updates\": {\n        \"ports\": [\n          {\n            \"id\": \"root\",\n            \"label\": \"root\",\n            \"direction\": \"bidirectional\",\n            \"dataType\": \"value\",\n            \"angle\": 210\n          },\n          {\n            \"id\": \"message\",\n            \"label\": \"message\",\n            \"direction\": \"output\",\n            \"dataType\": \"value\",\n            \"angle\": 0\n          }\n        ],\n        \"handles\": [\n          {\n            \"id\": \"root\",\n            \"label\": \"root\",\n            \"direction\": \"bidirectional\",\n            \"dataType\": \"any\",\n            \"portId\": \"root\",\n            \"angle\": 210\n          },\n          {\n            \"id\": \"message-east\",\n            \"label\": \"message east\",\n            \"direction\": \"output\",\n            \"dataType\": \"value\",\n            \"portId\": \"message\",\n            \"angle\": 0\n          },\n          {\n            \"id\": \"message-south\",\n            \"label\": \"message south\",\n            \"direction\": \"output\",\n            \"dataType\": \"value\",\n            \"portId\": \"message\",\n            \"angle\": 90\n          }\n        ],\n        \"inputs\": [\n          { \"key\": \"root\", \"label\": \"root\", \"type\": \"value\" }\n        ],\n        \"outputs\": [\n          { \"key\": \"root\", \"label\": \"root\", \"type\": \"value\" },\n          { \"key\": \"message\", \"label\": \"message\", \"type\": \"value\" }\n        ]\n      }\n    }\n  ]\n}\n```\n\nIf you do not know the current semantic port contract on the target node, say so and ask for the node JSON or inspect the current graph before inventing ports.\n\n## Working In Existing Graphs\n\nFor normal authoring inside an existing graph:\n\n- prefer additive transactions\n- preserve node ids when updating existing material\n- use the graph’s existing edge vocabulary when it is obvious\n- prefer the graph’s existing port vocabulary when it is obvious\n- otherwise use a safe valid edge type already in use in the graph\n\n## Creating New Graphs\n\nFor a fresh graph artifact:\n\n- include a `declaration` node as the system graph node\n- keep the first graph small and legible\n- add only the node types the graph actually needs\n- avoid unnecessary compatibility scaffolding\n\n## Handshake Example\n\n```json\n{\n  \"action\": \"transaction\",\n  \"commands\": [\n    {\n      \"action\": \"createNodes\",\n      \"nodes\": [\n        {\n          \"id\": \"11111111-1111-4111-8111-111111111111\",\n          \"type\": \"markdown\",\n          \"label\": \"Handshake\",\n          \"position\": { \"x\": 260, \"y\": 120 },\n          \"width\": 360,\n          \"height\": 220,\n          \"data\": {\n            \"markdown\": \"# Handshake received\\\\n\\\\nI am ready to make small valid Twilite graph mutations.\"\n          }\n        }\n      ]\n    }\n  ]\n}\n```\n\n## Invalid Shapes To Avoid\n\nThese shapes are wrong in Twilite:\n\n- top level `{\"actions\":[...]}`\n- command objects like `{\"command\":\"createNodes\"}`\n- node ids stored as `uuid`\n- node payload stored in `metadata`\n- markdown content stored in `metadata.content`\n- titles stored only in `metadata.title`\n- edges that assume `sourcePort: \"out\"` and `targetPort: \"in\"` on nodes that do not declare those ports\n\nIf you are creating a markdown node, it should look like this shape:\n\n```json\n{\n  \"id\": \"11111111-1111-4111-8111-111111111111\",\n  \"type\": \"markdown\",\n  \"label\": \"Example\",\n  \"position\": { \"x\": 120, \"y\": 80 },\n  \"width\": 360,\n  \"height\": 220,\n  \"data\": {\n    \"markdown\": \"# Example\\\\n\\\\nValid Twilite markdown node.\"\n  }\n}\n```\n\n## New Graph Starter Example\n\n```json\n{\n  \"action\": \"transaction\",\n  \"commands\": [\n    {\n      \"action\": \"createNodes\",\n      \"nodes\": [\n        {\n          \"id\": \"11111111-1111-4111-8111-111111111111\",\n          \"type\": \"declaration\",\n          \"label\": \"Declaration\",\n          \"position\": { \"x\": -520, \"y\": -220 },\n          \"width\": 420,\n          \"height\": 280,\n          \"data\": {\n            \"identity\": {\n              \"graphId\": \"starter-graph\",\n              \"name\": \"Starter Graph\",\n              \"version\": \"0.1.0\",\n              \"description\": \"Starter graph\",\n              \"createdAt\": \"2026-02-22T00:00:00.000Z\",\n              \"updatedAt\": \"2026-02-22T00:00:00.000Z\"\n            },\n            \"intent\": { \"kind\": \"graph\", \"scope\": \"foundation\" },\n            \"dependencies\": {\n              \"nodeTypes\": [\"declaration\", \"markdown\"],\n              \"portContracts\": [\"core\"],\n              \"skills\": [],\n              \"schemaVersions\": { \"nodes\": \">=1.0.0\", \"ports\": \">=1.0.0\" },\n              \"optional\": []\n            },\n            \"authority\": {\n              \"mutation\": {\n                \"allowCreate\": true,\n                \"allowUpdate\": true,\n                \"allowDelete\": true,\n                \"appendOnly\": false\n              },\n              \"actors\": { \"humans\": true, \"agents\": true, \"tools\": true },\n              \"styleAuthority\": \"descriptive\",\n              \"history\": { \"rewriteAllowed\": false, \"squashAllowed\": false }\n            },\n            \"document\": { \"url\": \"\" },\n            \"settings\": {\n              \"theme\": null,\n              \"backgroundImage\": null,\n              \"defaultNodeColor\": \"#1976d2\",\n              \"defaultEdgeColor\": \"#666666\",\n              \"snapToGrid\": false,\n              \"gridSize\": 20,\n              \"edgeRouting\": \"auto\",\n              \"github\": { \"repo\": \"\", \"path\": \"\", \"branch\": \"main\" },\n              \"autoSave\": false\n            }\n          }\n        },\n        {\n          \"id\": \"44444444-4444-4444-8444-444444444444\",\n          \"type\": \"markdown\",\n          \"label\": \"Start Here\",\n          \"position\": { \"x\": 40, \"y\": -40 },\n          \"width\": 420,\n          \"height\": 240,\n          \"data\": {\n            \"markdown\": \"# Twilite Starter\\\\n\\\\nThis graph is valid and ready for extension.\"\n          }\n        }\n      ]\n    }\n  ]\n}\n```\n\n## Final Rule\n\nWhen onboarded, complete the handshake first.\n\nAfter the handshake, continue helping through valid Twilite graph mutations.\n",
        "identity": {
          "graphId": "markdown-document-manifest"
        }
      }
    },
    {
      "id": "b961d6e3-fd5d-4568-8713-ba00115df7b9",
      "type": "declaration",
      "label": "Declaration",
      "root": false,
      "position": {
        "x": -1053.7889193434476,
        "y": -684.0891712069683
      },
      "width": 569.7542734899749,
      "height": 585.5717337968134,
      "handles": [
        {
          "id": "root",
          "label": "root",
          "direction": "bidirectional",
          "dataType": "value",
          "side": "left",
          "offset": 0.2,
          "position": {
            "side": "left",
            "offset": 0.2
          }
        },
        {
          "id": "top",
          "label": "top",
          "direction": "bidirectional",
          "dataType": "value",
          "side": "top",
          "offset": 0.5,
          "position": {
            "side": "top",
            "offset": 0.5
          }
        },
        {
          "id": "bottom",
          "label": "bottom",
          "direction": "bidirectional",
          "dataType": "value",
          "side": "bottom",
          "offset": 0.5,
          "position": {
            "side": "bottom",
            "offset": 0.5
          }
        },
        {
          "id": "left",
          "label": "left",
          "direction": "bidirectional",
          "dataType": "value",
          "side": "left",
          "offset": 0.5,
          "position": {
            "side": "left",
            "offset": 0.5
          }
        },
        {
          "id": "right",
          "label": "right",
          "direction": "bidirectional",
          "dataType": "value",
          "side": "right",
          "offset": 0.5,
          "position": {
            "side": "right",
            "offset": 0.5
          }
        }
      ],
      "ports": [
        {
          "id": "root",
          "label": "root",
          "direction": "bidirectional",
          "dataType": "value",
          "side": "left",
          "offset": 0.2,
          "position": {
            "side": "left",
            "offset": 0.2
          }
        },
        {
          "id": "top",
          "label": "top",
          "direction": "bidirectional",
          "dataType": "value",
          "side": "top",
          "offset": 0.5,
          "position": {
            "side": "top",
            "offset": 0.5
          }
        },
        {
          "id": "bottom",
          "label": "bottom",
          "direction": "bidirectional",
          "dataType": "value",
          "side": "bottom",
          "offset": 0.5,
          "position": {
            "side": "bottom",
            "offset": 0.5
          }
        },
        {
          "id": "left",
          "label": "left",
          "direction": "bidirectional",
          "dataType": "value",
          "side": "left",
          "offset": 0.5,
          "position": {
            "side": "left",
            "offset": 0.5
          }
        },
        {
          "id": "right",
          "label": "right",
          "direction": "bidirectional",
          "dataType": "value",
          "side": "right",
          "offset": 0.5,
          "position": {
            "side": "right",
            "offset": 0.5
          }
        }
      ],
      "inputs": [
        {
          "key": "root",
          "label": "root",
          "type": "value",
          "position": {
            "side": "left",
            "offset": 0.2
          }
        },
        {
          "key": "top",
          "label": "top",
          "type": "value",
          "position": {
            "side": "top",
            "offset": 0.5
          }
        },
        {
          "key": "bottom",
          "label": "bottom",
          "type": "value",
          "position": {
            "side": "bottom",
            "offset": 0.5
          }
        },
        {
          "key": "left",
          "label": "left",
          "type": "value",
          "position": {
            "side": "left",
            "offset": 0.5
          }
        },
        {
          "key": "right",
          "label": "right",
          "type": "value",
          "position": {
            "side": "right",
            "offset": 0.5
          }
        }
      ],
      "outputs": [
        {
          "key": "root",
          "label": "root",
          "type": "value",
          "position": {
            "side": "left",
            "offset": 0.2
          }
        },
        {
          "key": "top",
          "label": "top",
          "type": "value",
          "position": {
            "side": "top",
            "offset": 0.5
          }
        },
        {
          "key": "bottom",
          "label": "bottom",
          "type": "value",
          "position": {
            "side": "bottom",
            "offset": 0.5
          }
        },
        {
          "key": "left",
          "label": "left",
          "type": "value",
          "position": {
            "side": "left",
            "offset": 0.5
          }
        },
        {
          "key": "right",
          "label": "right",
          "type": "value",
          "position": {
            "side": "right",
            "offset": 0.5
          }
        }
      ],
      "visible": true,
      "showLabel": true,
      "data": {
        "identity": {
          "graphId": "b961d6e3-fd5d-4568-8713-ba00115df7b9",
          "name": "Bootstrap Tutorial",
          "version": "0.1.0",
          "description": "This graph provides minimal instructions to users (real or artificial) to get started created Twilite graphs. "
        },
        "intent": {
          "kind": "graph",
          "scope": "local"
        },
        "declaration": {
          "targetMode": "artifact",
          "defaultSurfaceId": "minimap",
          "surfaces": []
        },
        "memo": "",
        "link": "",
        "html": "",
        "svg": "",
        "_placement": {
          "version": 1,
          "state": "manually-shaped",
          "source": "manual",
          "updatedAt": 1780762614707,
          "reason": "node-drag"
        },
        "settings": {
          "theme": null,
          "backgroundImage": null,
          "defaultNodeColor": "#1976d2",
          "defaultEdgeColor": "#666666",
          "snapToGrid": false,
          "gridSize": 20,
          "edgeRouting": "auto",
          "layout": {
            "mode": "autoOnMissingPositions",
            "defaultLayout": "layered",
            "direction": "DOWN",
            "edgeLaneGapPx": 10,
            "serpentine": {
              "maxPerRow": 6
            },
            "cycleFallback": {
              "enabled": true
            },
            "elk": {
              "algorithm": "fixed",
              "edgeRouting": "ORTHOGONAL",
              "portConstraints": "FIXED_SIDE",
              "nodeSpacing": 120,
              "layeredEdgeSpacing": 80
            }
          },
          "autoSave": false
        },
        "document": {
          "url": "github://twilite-zone/public/library/documentation/OnboardLLM.md"
        }
      }
    }
  ],
  "edges": [],
  "clusters": [],
  "settings": {
    "theme": null,
    "backgroundImage": null,
    "defaultNodeColor": "#1976d2",
    "defaultEdgeColor": "#666666",
    "snapToGrid": false,
    "gridSize": 20,
    "edgeRouting": "auto",
    "layout": {
      "mode": "autoOnMissingPositions",
      "defaultLayout": "layered",
      "direction": "DOWN",
      "edgeLaneGapPx": 10,
      "serpentine": {
        "maxPerRow": 6
      },
      "cycleFallback": {
        "enabled": true
      },
      "elk": {
        "algorithm": "fixed",
        "edgeRouting": "ORTHOGONAL",
        "portConstraints": "FIXED_SIDE",
        "nodeSpacing": 120,
        "layeredEdgeSpacing": 80
      }
    },
    "github": {
      "repo": "twilite-zone/public",
      "path": "library/documentation/OnboardLLM.md",
      "branch": "main",
      "autoCreateRepo": true,
      "repoVisibility": "private",
      "seedOnCommit": false,
      "enableGithubPages": false,
      "installationId": "120403738"
    },
    "autoSave": false
  },
  "scripts": []
}