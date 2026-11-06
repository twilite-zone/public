## Keeping track of work

When the user wants to keep track of work (a plan, a project, things to decide), use goals, tasks, questions and decisions instead of a markdown checklist. Each is a card with a status the user can change, and the status shows on it at a glance. They come from the Task Template, which a graph uses through one `import` of the template.

1. **Add one `import` node of the template**, as in the example. It brings all four kinds; do not add one for each.
2. **Add the cards.** A card's `type` is `goal`, `task`, `open-question` or `decision`, and `data.classRef` names its class. The card shows `data.title` (put the same text in `label`), `data.body`, `data.status` and `data.owner`.
3. **Draw the relationships as edges with no `sourcePort` and no `targetPort`.** These cards do not carry named ports in a reply, and Twilite refuses an edge that names one.

| `type` | `data.classRef` | `data.status` | Also |
|---|---|---|---|
| `goal` | `tlz://twilite.zone/library/classes/nodes/task-planning/goal.node-class.node` | `todo`, `in-progress`, `blocked`, `waiting`, `done`, `cancelled` | `successMetrics`: a list of short texts, "done when" |
| `task` | `tlz://twilite.zone/library/classes/nodes/task-planning/task.node-class.node` | the same | `blockedReason`; `acceptanceCriteria`: a list of short texts |
| `open-question` | `tlz://twilite.zone/library/classes/nodes/task-planning/open-question.node-class.node` | `open`, `investigating`, `answered`, `resolved` | `answer`: leave it empty; the user writes it |
| `decision` | `tlz://twilite.zone/library/classes/nodes/task-planning/decision.node-class.node` | `proposed`, `decided` | `rationale` |

Edge `type`s: `contains` (a goal to each of its tasks, questions and decisions), `precedes` (a task to the task that comes after it), `blocked-by` (a task to the question or task it waits on), `raises` (a task to a question it raises), `resolves` (a decision to the question it answers).

- Size a card 500 wide and 285 high (262 for a question), and leave out `position`: Twilite arranges the cards from their edges, with the goal on top, the tasks in a row below it in the order they precede one another, and the questions under the tasks.
- Do not mark a goal `done`: when all the work is done, the person confirms the goal. Do not answer a question for the user; leave `answer` empty.
- Do not add a Method or try to build the graph's own Summary. The import of the Task Template brings its Method: Twilite adds it, with the edge that runs it, when your reply is applied, and it derives the graph's views from your cards.

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "createNodes",
      "nodes": [
        {
          "id": "c1a8f3d2-5b7e-4c19-8a64-2d0e9f7b3a11",
          "type": "import",
          "label": "Task Template",
          "width": 320,
          "height": 140,
          "data": {
            "bridge": {
              "ref": "tlz://twilite.zone/library/templates/task-template/root.node",
              "resourceKind": "graph",
              "scope": "focused-graph",
              "grants": [
                "read",
                "create",
                "update",
                "execute"
              ]
            }
          }
        },
        {
          "id": "d2b9a4e3-6c8f-4d2a-9b75-3e1f0a8c4b22",
          "type": "goal",
          "label": "Finish the kitchen",
          "width": 500,
          "height": 285,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Finish the kitchen",
            "classRef": "tlz://twilite.zone/library/classes/nodes/task-planning/goal.node-class.node",
            "status": "in-progress",
            "owner": "Me",
            "body": "A kitchen we enjoy cooking in, finished before the holidays.",
            "successMetrics": [
              "All three quotes are in",
              "Work starts in March"
            ]
          }
        },
        {
          "id": "e3cab5f4-7d90-4e3b-8c86-4f2a1b9d5c33",
          "type": "task",
          "label": "Measure the room",
          "width": 500,
          "height": 285,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Measure the room",
            "classRef": "tlz://twilite.zone/library/classes/nodes/task-planning/task.node-class.node",
            "status": "done",
            "owner": "Me",
            "body": "Exact measurements, including the windows."
          }
        },
        {
          "id": "f4dbc6a5-8ea1-4f4c-9d97-5a3b2c0e6d44",
          "type": "task",
          "label": "Collect three quotes",
          "width": 500,
          "height": 285,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Collect three quotes",
            "classRef": "tlz://twilite.zone/library/classes/nodes/task-planning/task.node-class.node",
            "status": "todo",
            "owner": "Me",
            "body": "Ask three contractors for a quote on the same plan."
          }
        },
        {
          "id": "a5ecd7b6-9fb2-4a5d-8ea8-6b4c3d1f7e55",
          "type": "open-question",
          "label": "Open the kitchen up, or keep the layout?",
          "width": 500,
          "height": 262,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Open the kitchen up, or keep the layout?",
            "classRef": "tlz://twilite.zone/library/classes/nodes/task-planning/open-question.node-class.node",
            "status": "open",
            "owner": "Me",
            "body": "Opening it up costs more but changes the quotes.",
            "answer": ""
          }
        }
      ]
    },
    {
      "action": "createEdges",
      "edges": [
        {
          "id": "01b1c2d3-4e5f-4a6b-8c7d-9e0f1a2b3c41",
          "type": "contains",
          "source": "d2b9a4e3-6c8f-4d2a-9b75-3e1f0a8c4b22",
          "target": "e3cab5f4-7d90-4e3b-8c86-4f2a1b9d5c33",
          "data": {}
        },
        {
          "id": "02b1c2d3-4e5f-4a6b-8c7d-9e0f1a2b3c42",
          "type": "contains",
          "source": "d2b9a4e3-6c8f-4d2a-9b75-3e1f0a8c4b22",
          "target": "f4dbc6a5-8ea1-4f4c-9d97-5a3b2c0e6d44",
          "data": {}
        },
        {
          "id": "03b1c2d3-4e5f-4a6b-8c7d-9e0f1a2b3c43",
          "type": "contains",
          "source": "d2b9a4e3-6c8f-4d2a-9b75-3e1f0a8c4b22",
          "target": "a5ecd7b6-9fb2-4a5d-8ea8-6b4c3d1f7e55",
          "data": {}
        },
        {
          "id": "04b1c2d3-4e5f-4a6b-8c7d-9e0f1a2b3c44",
          "type": "precedes",
          "source": "e3cab5f4-7d90-4e3b-8c86-4f2a1b9d5c33",
          "target": "f4dbc6a5-8ea1-4f4c-9d97-5a3b2c0e6d44",
          "data": {}
        },
        {
          "id": "05b1c2d3-4e5f-4a6b-8c7d-9e0f1a2b3c45",
          "type": "raises",
          "source": "f4dbc6a5-8ea1-4f4c-9d97-5a3b2c0e6d44",
          "target": "a5ecd7b6-9fb2-4a5d-8ea8-6b4c3d1f7e55",
          "data": {}
        }
      ]
    }
  ]
}
```

### Changing what you already made

The conversation goes on after the first reply. When the person asks for a change, answer with a `transaction` of only the change, never the whole graph again:

- To change a card you made, send `updateNode` with the `id` you gave it in your earlier reply, and only the fields that change, as in `{ "data": { "status": "in-progress" } }`. Do not send the card's other fields.
- To add something, send `createNodes` and `createEdges` as before. Draw an edge to a card you made earlier by its `id` in `source` or `target`. Leave out `position` on new cards; Twilite arranges them from their edges and places them clear of what is there.
- Keep every `id` you wrote, so you can refer to it. If you no longer have an id, ask the person to paste the graph rather than guessing.

The example starts the second task, adds a task and puts it under the goal:

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "updateNode",
      "id": "f4dbc6a5-8ea1-4f4c-9d97-5a3b2c0e6d44",
      "updates": {
        "data": {
          "status": "in-progress"
        }
      }
    },
    {
      "action": "createNodes",
      "nodes": [
        {
          "id": "0b6fdf17-a0c3-4b6e-9fb9-7c5d4e2a8f66",
          "type": "task",
          "label": "Choose a tile",
          "position": {
            "x": 0,
            "y": 0
          },
          "width": 500,
          "height": 285,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Choose a tile",
            "classRef": "tlz://twilite.zone/library/classes/nodes/task-planning/task.node-class.node",
            "status": "todo",
            "owner": "Me",
            "body": "Pick a tile for the floor and the wall."
          }
        }
      ]
    },
    {
      "action": "createEdges",
      "edges": [
        {
          "id": "0c7e0e28-b1d4-4c7f-8ac0-8d6e5f3b9a77",
          "type": "contains",
          "source": "d2b9a4e3-6c8f-4d2a-9b75-3e1f0a8c4b22",
          "target": "0b6fdf17-a0c3-4b6e-9fb9-7c5d4e2a8f66",
          "data": {}
        }
      ]
    }
  ]
}
```
