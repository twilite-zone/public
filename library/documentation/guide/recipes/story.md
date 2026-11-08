## Writing a story

When the user wants to plan or outline a story (fiction, a fable, a screenplay, any narrative with characters and scenes), build a **story** from the Story Template, which a graph uses through one `import` of the template. A story is its premise, its characters and places, the scenes in order, and the threads that run through them. Every card is typed, and every card has a `check` field that means "I am not sure this is right".

| `type` | `data.classRef` | Fields | What it is |
|---|---|---|---|
| `story` | `tlz://twilite.zone/library/classes/nodes/story/story.node-class.node` | `title`, `body` (the premise: who wants what, and what stands in the way), `status` (`idea`, `drafting`, `revising` or `done`), `check` | The story itself. There is one |
| `character` | `tlz://twilite.zone/library/classes/nodes/story/character.node-class.node` | `title` (the name), `body` (who they are), `want` (what they want in this story), `check` | Someone in the story |
| `place` | `tlz://twilite.zone/library/classes/nodes/story/place.node-class.node` | `title`, `body`, `check` | Somewhere the story happens |
| `scene` | `tlz://twilite.zone/library/classes/nodes/story/scene.node-class.node` | `title`, `body` (what happens), `stage` (`idea`, `drafted` or `revised`), `check` | One scene |
| `thread` | `tlz://twilite.zone/library/classes/nodes/story/thread.node-class.node` | `title`, `body` (what it asks of the reader), `resolved` (`true` or `false`), `check` | Something the reader is waiting to see settled |

Edge `type`s, each with the ends it allows: `precedes` (a scene to the scene after it), `appears-in` (a character to a scene they are in), `set-in` (a scene to the place it happens in, one place for each scene) and `weaves` (a thread to a scene it runs through, with what the scene does for the thread in its `label`).

- **One `story` card**, with `status: "idea"` unless the user says they are already writing it. Put the premise the user gave you in `body`.
- **Characters** only the ones the user named or plainly implied. Fill `want` from what the user said, and set `check: true` on anything you added yourself.
- **Scenes in order**, joined with `precedes`. Use the scenes the user described; do not invent plot. If they gave you only a premise, offer a few scenes as suggestions with `check: true`, or ask. Use `stage: "idea"` unless the user said it is written.
- **Join characters to scenes** with `appears-in`, and each scene to its place with `set-in` where the place is known.
- **Threads** are the questions that keep a reader reading. Join each to the scenes it runs through with `weaves`, and say in the `label` what the scene does for it: raises it, turns it, settles it. Use `resolved: false` unless the story answers it.
- **Never invent a fact about the user's story.** Do not make up a name, a twist, an ending or a character the user has not given you. Where you are not sure, set `check: true` on that card so the user can see it needs checking. Do not judge the story or say whether it works: the graph shows what is there.
- **Size the cards** 520 wide and 260 high for the story, 420 by 260 for scenes, and 420 by 240 for the rest, and leave out `position`: Twilite arranges them, with the story on top, the characters and threads in a row beneath it, the scenes under them in order and the places under the scenes.
- The import brings the template's own Method: when your reply is applied, Twilite adds it and the edge that runs it, and the story's outline and card are written from your cards. Do not write a Method yourself, and do not write the graph's own Detail or Summary.

This outline for a short story has one character the user did not describe, so he is marked to check:

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
          "label": "Story Template",
          "width": 320,
          "height": 140,
          "data": {
            "bridge": {
              "ref": "tlz://twilite.zone/library/templates/story/root.node",
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
          "type": "story",
          "label": "The Message in the Bottle",
          "width": 520,
          "height": 260,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "The Message in the Bottle",
            "classRef": "tlz://twilite.zone/library/classes/nodes/story/story.node-class.node",
            "body": "A lighthouse keeper who wants to be left alone finds a message in a bottle, and cannot leave it unanswered.",
            "status": "idea",
            "check": false
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-000000002519",
          "type": "character",
          "label": "Ines",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Ines",
            "classRef": "tlz://twilite.zone/library/classes/nodes/story/character.node-class.node",
            "body": "The keeper of a remote lighthouse. Practical, private, a little stubborn.",
            "want": "To be left alone",
            "check": false
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-0000000026cc",
          "type": "character",
          "label": "Tomas",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Tomas",
            "classRef": "tlz://twilite.zone/library/classes/nodes/story/character.node-class.node",
            "body": "Whoever wrote the message. The user has not said who he is.",
            "want": "To be found",
            "check": true
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-00000000287f",
          "type": "place",
          "label": "The beach below the lighthouse",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "The beach below the lighthouse",
            "classRef": "tlz://twilite.zone/library/classes/nodes/story/place.node-class.node",
            "body": "Where the tide leaves things.",
            "check": false
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-000000002a32",
          "type": "place",
          "label": "The lighthouse",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "The lighthouse",
            "classRef": "tlz://twilite.zone/library/classes/nodes/story/place.node-class.node",
            "body": "Ines's home and workplace, at the top of a spiral stair.",
            "check": false
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-000000002be5",
          "type": "scene",
          "label": "The bottle washes up",
          "width": 420,
          "height": 260,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "The bottle washes up",
            "classRef": "tlz://twilite.zone/library/classes/nodes/story/scene.node-class.node",
            "body": "After a storm, Ines finds a bottle with a folded page inside.",
            "stage": "idea",
            "check": false
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-000000002d98",
          "type": "scene",
          "label": "Ines reads the message",
          "width": 420,
          "height": 260,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Ines reads the message",
            "classRef": "tlz://twilite.zone/library/classes/nodes/story/scene.node-class.node",
            "body": "She reads it three times, and does not tell anyone.",
            "stage": "idea",
            "check": false
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-000000002f4b",
          "type": "scene",
          "label": "She writes back",
          "width": 420,
          "height": 260,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "She writes back",
            "classRef": "tlz://twilite.zone/library/classes/nodes/story/scene.node-class.node",
            "body": "She cannot stop herself, and sends a reply out with the tide.",
            "stage": "idea",
            "check": false
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-0000000030fe",
          "type": "thread",
          "label": "Who wrote it?",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Who wrote it?",
            "classRef": "tlz://twilite.zone/library/classes/nodes/story/thread.node-class.node",
            "body": "The reader wants to know who sent the message, and whether Ines will ever find out.",
            "resolved": false,
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
          "type": "precedes",
          "source": "a0a00000-0000-4000-8000-000000002be5",
          "target": "a0a00000-0000-4000-8000-000000002d98",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-000000003617",
          "type": "precedes",
          "source": "a0a00000-0000-4000-8000-000000002d98",
          "target": "a0a00000-0000-4000-8000-000000002f4b",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-0000000037ca",
          "type": "appears-in",
          "source": "a0a00000-0000-4000-8000-000000002519",
          "target": "a0a00000-0000-4000-8000-000000002be5",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-00000000397d",
          "type": "appears-in",
          "source": "a0a00000-0000-4000-8000-000000002519",
          "target": "a0a00000-0000-4000-8000-000000002d98",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-000000003b30",
          "type": "appears-in",
          "source": "a0a00000-0000-4000-8000-000000002519",
          "target": "a0a00000-0000-4000-8000-000000002f4b",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-000000003ce3",
          "type": "appears-in",
          "source": "a0a00000-0000-4000-8000-0000000026cc",
          "target": "a0a00000-0000-4000-8000-000000002d98",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-000000003e96",
          "type": "set-in",
          "source": "a0a00000-0000-4000-8000-000000002be5",
          "target": "a0a00000-0000-4000-8000-00000000287f",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-000000004049",
          "type": "set-in",
          "source": "a0a00000-0000-4000-8000-000000002d98",
          "target": "a0a00000-0000-4000-8000-000000002a32",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-0000000041fc",
          "type": "set-in",
          "source": "a0a00000-0000-4000-8000-000000002f4b",
          "target": "a0a00000-0000-4000-8000-000000002a32",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-0000000043af",
          "type": "weaves",
          "source": "a0a00000-0000-4000-8000-0000000030fe",
          "target": "a0a00000-0000-4000-8000-000000002be5",
          "label": "it is raised",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-000000004562",
          "type": "weaves",
          "source": "a0a00000-0000-4000-8000-0000000030fe",
          "target": "a0a00000-0000-4000-8000-000000002d98",
          "label": "it deepens",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-000000004715",
          "type": "weaves",
          "source": "a0a00000-0000-4000-8000-0000000030fe",
          "target": "a0a00000-0000-4000-8000-000000002f4b",
          "label": "it stays open",
          "data": {}
        }
      ]
    }
  ]
}
```
