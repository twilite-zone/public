## Making a plan

When the user wants to plan something before it happens (a launch, a trip, an event, a move, a project that has not started), build a **plan** from the Plan Template, which a graph uses through one `import` of the template. A plan is the intended course: what it is for, its phases and the steps in them, the points that have to be reached, and what could go wrong. If the user wants to keep track of work that is already underway, use the task graph instead (see "Keeping track of work"). Every card is typed, and every card has a `check` field that means "I am not sure this is right".

| `type` | `data.classRef` | Fields | What it is |
|---|---|---|---|
| `aim` | `tlz://twilite.zone/library/classes/nodes/plan/aim.node-class.node` | `title` (what the plan is for), `body` (what done looks like), `status` (`draft`, `underway` or `done`), `check` | What the plan is for. There is one |
| `phase` | `tlz://twilite.zone/library/classes/nodes/plan/phase.node-class.node` | `title`, `body`, `status` (`not-started`, `underway` or `done`), `check` | A stretch of the plan, with steps inside it |
| `step` | `tlz://twilite.zone/library/classes/nodes/plan/step.node-class.node` | `title`, `body`, `status` (`todo`, `doing` or `done`), `owner`, `check` | One thing to do inside a phase |
| `milestone` | `tlz://twilite.zone/library/classes/nodes/plan/milestone.node-class.node` | `title`, `body`, `reached` (`true` or `false`), `check` | A point that has to be reached before a phase can begin |
| `hazard` | `tlz://twilite.zone/library/classes/nodes/plan/hazard.node-class.node` | `title`, `body`, `likelihood` (`low`, `medium` or `high`), `mitigation`, `fallback`, `check` | A risk: what could go wrong, what reduces it, and what to do if it happens |
| `limit` | `tlz://twilite.zone/library/classes/nodes/plan/limit.node-class.node` | `title`, `body`, `check` | A constraint the plan has to live within: a budget, a date, a rule |

Edge `type`s, each with the ends it allows: `contains` (the aim to a phase, a phase to a step), `precedes` (a phase to the next phase, a step to the next step), `gates` (a milestone to the phase it holds back), `threatens` (a hazard to a phase or step it could derail) and `limits` (a limit to the aim, phase or step it bounds).

- **One `aim` card**, with `status: "draft"` unless the user says the work has begun. Write what the user gave you in `body`, and what done looks like.
- **Two to five phases.** Join each to the aim with `contains`, and join each to the one after it with `precedes`, so they read in order.
- **Steps inside the phases.** Join each to its phase with `contains`, and to the one after it with `precedes`. Use `status: "todo"` unless the user said it is under way or done, and fill `owner` only if the user said who.
- **Milestones only where something must be true before a phase can begin.** Draw `gates` from the milestone to that phase, and say why in the edge's `label`. Use `reached: false` unless the user said otherwise. A plan may have none.
- **Risks:** ask yourself what could go wrong and use what the user said. Set `likelihood` from their words (use `medium` if they did not say, and tell them you did). Fill `mitigation` and `fallback` only from what the user said or what is plainly sensible, and set `check: true` when it is your suggestion. Draw `threatens` to the phase or step it could derail, with how in the `label`.
- **Constraints:** a budget, a date, a rule or a person who is not available. Draw `limits` from the constraint to the aim, phase or step it bounds, with what it rules out in the `label`.
- **Never invent a fact.** Do not make up a date, a cost, a name or a number. Where you are not sure, set `check: true` on that card so the user can see it needs checking. Do not add up the steps into a score, and do not say whether the plan will succeed: the plan shows what is done, what is reached and what could go wrong.
- **Size the cards** 520 wide and 260 high for the aim, 460 by 240 for phases, 420 by 240 for steps, milestones and constraints, and 460 by 280 for risks, and leave out `position`: Twilite arranges them, with the aim on top, the phases in a row beneath it and each phase's steps under it.
- The import brings the template's own Method: when your reply is applied, Twilite adds it and the edge that runs it, and the plan's page and card are written from your cards. Do not write a Method yourself, and do not write the graph's own Detail or Summary.

This plan for a garage sale has two phases, a milestone that holds back the sale day, a risk and a limit, and one step is marked to check because it was a suggestion:

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "createNodes",
      "nodes": [
        {
          "id": "a0a00000-0000-4000-8000-0000000021b3",
          "type": "import",
          "label": "Plan Template",
          "width": 320,
          "height": 140,
          "data": {
            "bridge": {
              "ref": "tlz://twilite.zone/library/templates/plan/root.node",
              "resourceKind": "graph",
              "scope": "focused-graph",
              "grants": [
                "read",
                "create",
                "update"
              ]
            }
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-000000002366",
          "type": "aim",
          "label": "Run the garage sale",
          "width": 520,
          "height": 260,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Run the garage sale",
            "classRef": "tlz://twilite.zone/library/classes/nodes/plan/aim.node-class.node",
            "body": "Clear out the garage and raise some money for the trip. Done when the garage is empty and the cash is counted.",
            "status": "draft",
            "check": false
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-000000002519",
          "type": "limit",
          "label": "It has to be this month",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "It has to be this month",
            "classRef": "tlz://twilite.zone/library/classes/nodes/plan/limit.node-class.node",
            "body": "The neighbourhood sale weekend is the last one before the summer break.",
            "check": false
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-0000000026cc",
          "type": "phase",
          "label": "Get ready",
          "width": 460,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Get ready",
            "classRef": "tlz://twilite.zone/library/classes/nodes/plan/phase.node-class.node",
            "body": "Sort what is going and put prices on it.",
            "status": "not-started",
            "check": false
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-00000000287f",
          "type": "phase",
          "label": "Sale day",
          "width": 460,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Sale day",
            "classRef": "tlz://twilite.zone/library/classes/nodes/plan/phase.node-class.node",
            "body": "Set up, sell, and clear away.",
            "status": "not-started",
            "check": false
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-000000002a32",
          "type": "step",
          "label": "Sort and price everything",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Sort and price everything",
            "classRef": "tlz://twilite.zone/library/classes/nodes/plan/step.node-class.node",
            "body": "Three piles: sell, give away, keep. Price the first pile.",
            "status": "todo",
            "owner": "",
            "check": false
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-000000002be5",
          "type": "step",
          "label": "Put up signs and post online",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Put up signs and post online",
            "classRef": "tlz://twilite.zone/library/classes/nodes/plan/step.node-class.node",
            "body": "Signs on the main road, and a post for the neighbourhood group.",
            "status": "todo",
            "owner": "",
            "check": true
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-000000002d98",
          "type": "step",
          "label": "Set up the tables",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Set up the tables",
            "classRef": "tlz://twilite.zone/library/classes/nodes/plan/step.node-class.node",
            "body": "Tables out by seven, cash box ready.",
            "status": "todo",
            "owner": "",
            "check": false
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-000000002f4b",
          "type": "milestone",
          "label": "Everything is priced",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Everything is priced",
            "classRef": "tlz://twilite.zone/library/classes/nodes/plan/milestone.node-class.node",
            "body": "Every item for sale has a price on it.",
            "reached": false,
            "check": false
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-0000000030fe",
          "type": "hazard",
          "label": "It rains",
          "width": 460,
          "height": 280,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "It rains",
            "classRef": "tlz://twilite.zone/library/classes/nodes/plan/hazard.node-class.node",
            "body": "A wet morning keeps buyers away and spoils the stock.",
            "likelihood": "medium",
            "mitigation": "Check the forecast the night before.",
            "fallback": "Move everything under the carport.",
            "check": false
          }
        }
      ]
    },
    {
      "action": "createEdges",
      "edges": [
        {
          "id": "b0b00000-0000-4000-8000-000000003464",
          "type": "contains",
          "source": "a0a00000-0000-4000-8000-000000002366",
          "target": "a0a00000-0000-4000-8000-0000000026cc",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-000000003617",
          "type": "contains",
          "source": "a0a00000-0000-4000-8000-000000002366",
          "target": "a0a00000-0000-4000-8000-00000000287f",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-0000000037ca",
          "type": "contains",
          "source": "a0a00000-0000-4000-8000-0000000026cc",
          "target": "a0a00000-0000-4000-8000-000000002a32",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-00000000397d",
          "type": "contains",
          "source": "a0a00000-0000-4000-8000-0000000026cc",
          "target": "a0a00000-0000-4000-8000-000000002be5",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-000000003b30",
          "type": "contains",
          "source": "a0a00000-0000-4000-8000-00000000287f",
          "target": "a0a00000-0000-4000-8000-000000002d98",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-000000003ce3",
          "type": "precedes",
          "source": "a0a00000-0000-4000-8000-0000000026cc",
          "target": "a0a00000-0000-4000-8000-00000000287f",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-000000003e96",
          "type": "precedes",
          "source": "a0a00000-0000-4000-8000-000000002a32",
          "target": "a0a00000-0000-4000-8000-000000002be5",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-000000004049",
          "type": "gates",
          "source": "a0a00000-0000-4000-8000-000000002f4b",
          "target": "a0a00000-0000-4000-8000-00000000287f",
          "label": "nothing sold unpriced",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-0000000041fc",
          "type": "threatens",
          "source": "a0a00000-0000-4000-8000-0000000030fe",
          "target": "a0a00000-0000-4000-8000-00000000287f",
          "label": "a wet morning keeps buyers away",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-0000000043af",
          "type": "limits",
          "source": "a0a00000-0000-4000-8000-000000002519",
          "target": "a0a00000-0000-4000-8000-000000002366",
          "label": "the date cannot move",
          "data": {}
        }
      ]
    }
  ]
}
```
