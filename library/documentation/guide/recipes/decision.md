## Making a decision

When the user is weighing a choice (which tool, which job, which plan, whether to do something at all), build a **decision** from the Decision Template, which a graph uses through one `import` of the template. Every card is typed, and every card has a `check` flag.

| `type` | `data.classRef` | Fields | What it is |
|---|---|---|---|
| `choice` | `tlz://twilite.zone/library/classes/nodes/decision/choice.node-class.node` | `title` (what is being decided), `body` (the context), `status` (`open` or `decided`), `check` | The decision itself. There is one |
| `option` | `tlz://twilite.zone/library/classes/nodes/decision/option.node-class.node` | `title`, `body`, `check` | One way to go |
| `criterion` | `tlz://twilite.zone/library/classes/nodes/decision/criterion.node-class.node` | `title`, `body`, `weight` (`low`, `medium` or `high`), `check` | Something that matters in making the choice, and how much |
| `note` | `tlz://twilite.zone/library/classes/nodes/decision/note.node-class.node` | `title`, `body`, `check` | A fact or worry that bears on the choice but is not one of the things that matter in it |

Edge `type`s, each with the ends it allows: `has-option` (the choice to an option), `weighs` (the choice to a criterion), `has-note` (the choice to a note), `favors` (a criterion to an option it counts in favor of) and `counts-against` (a criterion to an option it counts against), each with a `label` that says why in a few words, and `chose` (the choice to the option that was picked, with the reason as its `label`).

- **One `choice` card**, with `status: "open"`. Write the context the user gave you in `body`.
- **Two to five options.** Include "do nothing" or "keep things as they are" when that is a real option. Join each to the choice with `has-option`.
- **Three to five criteria**, each with a `weight` that follows what the user said matters. If they did not say, use `medium`, and tell them you did. Join each to the choice with `weighs`.
- **Draw `favors` or `counts-against` only where there is a reason**, and put the reason in its `label`. A criterion need not touch every option. Do not add the edges up into a score, and do not say which option wins: the graph shows what counts for and against, and the user decides.
- **Never draw `chose` yourself.** The choice is the user's. If they tell you what they chose, draw `chose` from the choice to that option, with their reason in its `label`, and set the choice's `status` to `decided`. If they ask what you would pick, say so in the conversation and not in the graph.
- **Use notes** for deadlines, constraints and worries that are not criteria. A graph may have none.
- **Never invent a fact.** Do not make up a price, a date, a number or what an option involves. Where you are not sure, set `check: true` on that card so the user can see it needs checking.
- **Size the cards** 520 wide and 260 high for the choice, 420 by 240 for the rest, and leave out `position`: Twilite arranges them, with the choice on top, the criteria and notes beside it and the options in a row beneath.
- The import brings the template's own Method: when your reply is applied, Twilite adds it and the edge that runs it, and the decision's page, card and icon are written from your cards. Do not write a Method yourself, and do not write the graph's own Detail or Summary.

This decision between two languages is still open, and one note is marked to check because it was said in passing:

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
          "label": "Decision Template",
          "width": 320,
          "height": 140,
          "data": {
            "bridge": {
              "ref": "tlz://twilite.zone/library/templates/decision/root.node",
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
          "type": "choice",
          "label": "Which language for the new tool?",
          "width": 520,
          "height": 260,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Which language for the new tool?",
            "classRef": "tlz://twilite.zone/library/classes/nodes/decision/choice.node-class.node",
            "body": "The prototype works and the team is about to build the real thing. The language has to be chosen before the first sprint.",
            "status": "open",
            "check": false
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-000000002519",
          "type": "option",
          "label": "Stay with Python",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Stay with Python",
            "classRef": "tlz://twilite.zone/library/classes/nodes/decision/option.node-class.node",
            "body": "Keep the language the prototype is written in.",
            "check": false
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-0000000026cc",
          "type": "option",
          "label": "Rewrite in Go",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Rewrite in Go",
            "classRef": "tlz://twilite.zone/library/classes/nodes/decision/option.node-class.node",
            "body": "Start the real version in Go.",
            "check": false
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-00000000287f",
          "type": "criterion",
          "label": "The team already knows it",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "The team already knows it",
            "classRef": "tlz://twilite.zone/library/classes/nodes/decision/criterion.node-class.node",
            "body": "Nobody should be learning a language while the deadline runs.",
            "weight": "high",
            "check": false
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-000000002a32",
          "type": "criterion",
          "label": "Runs fast enough",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Runs fast enough",
            "classRef": "tlz://twilite.zone/library/classes/nodes/decision/criterion.node-class.node",
            "body": "The tool will process large files.",
            "weight": "medium",
            "check": false
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-000000002be5",
          "type": "criterion",
          "label": "Easy to hire for",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Easy to hire for",
            "classRef": "tlz://twilite.zone/library/classes/nodes/decision/criterion.node-class.node",
            "body": "Two more people may join next year.",
            "weight": "low",
            "check": false
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-000000002d98",
          "type": "note",
          "label": "The prototype is in Python",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "The prototype is in Python",
            "classRef": "tlz://twilite.zone/library/classes/nodes/decision/note.node-class.node",
            "body": "About two weeks of work already exists.",
            "check": false
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-000000002f4b",
          "type": "note",
          "label": "Some of the team have used Go",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Some of the team have used Go",
            "classRef": "tlz://twilite.zone/library/classes/nodes/decision/note.node-class.node",
            "body": "Said in passing, and not confirmed: how many, and how much.",
            "check": true
          }
        }
      ]
    },
    {
      "action": "createEdges",
      "edges": [
        {
          "id": "b0b00000-0000-4000-8000-0000000030fe",
          "type": "has-option",
          "source": "a0a00000-0000-4000-8000-000000002366",
          "target": "a0a00000-0000-4000-8000-000000002519",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-0000000032b1",
          "type": "has-option",
          "source": "a0a00000-0000-4000-8000-000000002366",
          "target": "a0a00000-0000-4000-8000-0000000026cc",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-000000003464",
          "type": "weighs",
          "source": "a0a00000-0000-4000-8000-000000002366",
          "target": "a0a00000-0000-4000-8000-00000000287f",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-000000003617",
          "type": "weighs",
          "source": "a0a00000-0000-4000-8000-000000002366",
          "target": "a0a00000-0000-4000-8000-000000002a32",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-0000000037ca",
          "type": "weighs",
          "source": "a0a00000-0000-4000-8000-000000002366",
          "target": "a0a00000-0000-4000-8000-000000002be5",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-00000000397d",
          "type": "has-note",
          "source": "a0a00000-0000-4000-8000-000000002366",
          "target": "a0a00000-0000-4000-8000-000000002d98",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-000000003b30",
          "type": "has-note",
          "source": "a0a00000-0000-4000-8000-000000002366",
          "target": "a0a00000-0000-4000-8000-000000002f4b",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-000000003ce3",
          "type": "favors",
          "source": "a0a00000-0000-4000-8000-00000000287f",
          "target": "a0a00000-0000-4000-8000-000000002519",
          "label": "everyone already uses it",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-000000003e96",
          "type": "counts-against",
          "source": "a0a00000-0000-4000-8000-00000000287f",
          "target": "a0a00000-0000-4000-8000-0000000026cc",
          "label": "a few would be learning it",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-000000004049",
          "type": "counts-against",
          "source": "a0a00000-0000-4000-8000-000000002a32",
          "target": "a0a00000-0000-4000-8000-000000002519",
          "label": "slower on large files",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-0000000041fc",
          "type": "favors",
          "source": "a0a00000-0000-4000-8000-000000002a32",
          "target": "a0a00000-0000-4000-8000-0000000026cc",
          "label": "fast on large files",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-0000000043af",
          "type": "favors",
          "source": "a0a00000-0000-4000-8000-000000002be5",
          "target": "a0a00000-0000-4000-8000-000000002519",
          "label": "a large pool of people",
          "data": {}
        }
      ]
    }
  ]
}
```
