## Thinking through an idea

When the user wants to explore, explain or untangle something (a topic, a question, a plan that is still vague, an idea they cannot yet name), build an **idea map** from the Idea Template, which a graph uses through one `import` of the template. It is also what you build when nothing else in this guide fits. An idea map is the idea, the points that make it up, and what is still not known. Every card is typed, and every card has a `check` field that means "I am not sure this is right".

| `type` | `data.classRef` | Fields | What it is |
|---|---|---|---|
| `notion` | `tlz://twilite.zone/library/classes/nodes/idea/notion.node-class.node` | `title` (the idea, in a few words), `body` (what it is and why it is worth understanding), `check` | The idea the map is about. There is one |
| `point` | `tlz://twilite.zone/library/classes/nodes/idea/point.node-class.node` | `title`, `body`, `role` (`part`, `reason`, `example` or `objection`), `check` | One idea in the map |
| `query` | `tlz://twilite.zone/library/classes/nodes/idea/query.node-class.node` | `title` (the question), `body` (what is known so far), `status` (`open` or `answered`), `check` | Something not yet known |

Edge `type`s: `leads-to` (from the idea, or from the point it unpacks, to the next point; its `label` is the connecting word) and `asks` (from the idea or point that raised a question to that question; a question has one asker).

- **One `notion` card**, the subject, with its `title` and a line or two in `body`.
- **Four to nine `point` cards.** Give each a `role`: `part` for a piece of the idea, `reason` for why it holds or why it happens, `example` for a case that shows it, `objection` for a case against it. Use `part` when you are not sure. Add a second layer only where a point needs unpacking, and stop at about twelve cards. Offer to go deeper on one branch.
- **Join them with `leads-to`, and always write the `label`:** *is made of*, *because*, *so*, *but*, *for example*, *needs*, *part of*. The label is the meaning, and the map is read aloud from it. The edge goes from the idea that comes first to the one that follows, or from a general point to its examples.
- **Say what is unknown.** Make each unsettled point a `query` card with `status: "open"`, titled as a question, and join it with `asks` from the idea or point that raised it. This is the edge of what is known; do not leave it out.
- **Never invent a fact.** Do not make up a number, a date or a claim the user did not give you and you cannot stand behind. Where you are not sure, set `check: true` on that card so the user can see it needs checking.
- **Size the cards** 520 wide and 260 high for the idea, and 420 by 240 for the rest, and leave out `position`: Twilite arranges them, with the idea on top, its points in a row beneath it and each point's own points under it, and a question beside the card that raised it.
- The import brings the template's own Method: when your reply is applied, Twilite adds it and the edge that runs it, and the idea's explanation and card are written from your cards. Do not write a Method yourself, and do not write the graph's own Detail or Summary.

The user's graph is already open, so send the import, the cards and the edges. This is a small map of a topic, with one objection marked to check:

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "createNodes",
      "nodes": [
        {
          "id": "c0de0000-0000-4000-8000-00000000315b",
          "type": "import",
          "label": "Idea Template",
          "width": 320,
          "height": 140,
          "data": {
            "bridge": {
              "ref": "tlz://twilite.zone/library/templates/idea/root.node",
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
          "id": "c0de0000-0000-4000-8000-00000000334a",
          "type": "notion",
          "label": "Plate tectonics",
          "width": 520,
          "height": 260,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Plate tectonics",
            "classRef": "tlz://twilite.zone/library/classes/nodes/idea/notion.node-class.node",
            "body": "Earth's outer shell is broken into moving plates, and almost everything about the planet's surface follows from that.",
            "check": false
          }
        },
        {
          "id": "c0de0000-0000-4000-8000-000000003539",
          "type": "point",
          "label": "The lithosphere",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "The lithosphere",
            "classRef": "tlz://twilite.zone/library/classes/nodes/idea/point.node-class.node",
            "role": "part",
            "body": "The rigid outer layer, about 100 km thick, is cracked into around a dozen major plates.",
            "check": false
          }
        },
        {
          "id": "c0de0000-0000-4000-8000-000000003728",
          "type": "point",
          "label": "The mantle moves",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "The mantle moves",
            "classRef": "tlz://twilite.zone/library/classes/nodes/idea/point.node-class.node",
            "role": "reason",
            "body": "Slow convection in the hot mantle below drags the plates along, a few centimetres a year.",
            "check": false
          }
        },
        {
          "id": "c0de0000-0000-4000-8000-000000003917",
          "type": "point",
          "label": "Plate boundaries",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Plate boundaries",
            "classRef": "tlz://twilite.zone/library/classes/nodes/idea/point.node-class.node",
            "role": "part",
            "body": "Plates diverge, converge or slide past each other, and each kind builds something different.",
            "check": false
          }
        },
        {
          "id": "c0de0000-0000-4000-8000-000000003b06",
          "type": "point",
          "label": "Earthquakes and volcanoes",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Earthquakes and volcanoes",
            "classRef": "tlz://twilite.zone/library/classes/nodes/idea/point.node-class.node",
            "role": "example",
            "body": "They cluster along boundaries, where plates grind, sink and melt.",
            "check": false
          }
        },
        {
          "id": "c0de0000-0000-4000-8000-000000003cf5",
          "type": "point",
          "label": "Continental drift",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Continental drift",
            "classRef": "tlz://twilite.zone/library/classes/nodes/idea/point.node-class.node",
            "role": "example",
            "body": "Matching coastlines and fossils suggested the continents were once joined. Plate tectonics explained how.",
            "check": false
          }
        },
        {
          "id": "c0de0000-0000-4000-8000-000000003ee4",
          "type": "point",
          "label": "Quakes far from any boundary",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Quakes far from any boundary",
            "classRef": "tlz://twilite.zone/library/classes/nodes/idea/point.node-class.node",
            "role": "objection",
            "body": "Some earthquakes happen deep inside plates, which the boundary picture does not explain on its own.",
            "check": true
          }
        },
        {
          "id": "c0de0000-0000-4000-8000-0000000040d3",
          "type": "query",
          "label": "Why do plates move?",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Why do plates move?",
            "classRef": "tlz://twilite.zone/library/classes/nodes/idea/query.node-class.node",
            "status": "open",
            "body": "Is it mantle convection, slab pull or ridge push? Scientists still weigh the three.",
            "check": false
          }
        }
      ]
    },
    {
      "action": "createEdges",
      "edges": [
        {
          "id": "d0d00000-0000-4000-8000-000000004c0b",
          "type": "leads-to",
          "source": "c0de0000-0000-4000-8000-00000000334a",
          "target": "c0de0000-0000-4000-8000-000000003539",
          "label": "is made of",
          "data": {}
        },
        {
          "id": "d0d00000-0000-4000-8000-000000004dfa",
          "type": "leads-to",
          "source": "c0de0000-0000-4000-8000-000000003539",
          "target": "c0de0000-0000-4000-8000-000000003728",
          "label": "is moved by",
          "data": {}
        },
        {
          "id": "d0d00000-0000-4000-8000-000000004fe9",
          "type": "leads-to",
          "source": "c0de0000-0000-4000-8000-00000000334a",
          "target": "c0de0000-0000-4000-8000-000000003917",
          "label": "shows up at",
          "data": {}
        },
        {
          "id": "d0d00000-0000-4000-8000-0000000051d8",
          "type": "leads-to",
          "source": "c0de0000-0000-4000-8000-000000003917",
          "target": "c0de0000-0000-4000-8000-000000003b06",
          "label": "causes",
          "data": {}
        },
        {
          "id": "d0d00000-0000-4000-8000-0000000053c7",
          "type": "leads-to",
          "source": "c0de0000-0000-4000-8000-00000000334a",
          "target": "c0de0000-0000-4000-8000-000000003cf5",
          "label": "explains",
          "data": {}
        },
        {
          "id": "d0d00000-0000-4000-8000-0000000055b6",
          "type": "leads-to",
          "source": "c0de0000-0000-4000-8000-000000003917",
          "target": "c0de0000-0000-4000-8000-000000003ee4",
          "label": "but",
          "data": {}
        },
        {
          "id": "d0d00000-0000-4000-8000-0000000057a5",
          "type": "asks",
          "source": "c0de0000-0000-4000-8000-000000003728",
          "target": "c0de0000-0000-4000-8000-0000000040d3",
          "label": "",
          "data": {}
        }
      ]
    }
  ]
}
```
