## Thinking through an idea

When the user wants to explore, explain or untangle something (a topic, a question, a plan that is still vague, an idea they cannot yet name), build an **idea map**: one card for each idea, joined by edges that say how the ideas relate. It needs no template and no import.

- **An idea is a `content` card** with `content.kind: "markdown"`: a `# Title` heading, then one to three short lines. One idea per card. Size it 440 wide and 240 high, or 520 by 280 for the central idea.
- **A relationship is an edge of type `leads-to`** with a `label` that says how: *because*, *so*, *but*, *for example*, *needs*, *part of*. The label is the meaning, so always write one. The edge goes from the idea that comes first to the one that follows, or from a general idea to its examples.
- **Shape it as a map.** Start with the central idea, put four to nine ideas around it, and connect each to at least one other. Add a second layer only where an idea needs unpacking, and stop at about twelve cards. Offer to go deeper on one branch.
- **Say what is unknown.** Make an unsettled point a card of its own, titled "Open question: ...", so the edge of what is known is visible.
- **Leave out `position`.** Twilite arranges the cards from the edges.

The user's graph is already open, so send only cards and edges. This is a small map of a topic:

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "createNodes",
      "nodes": [
        {
          "id": "c0de0000-0000-4000-8000-000000003039",
          "type": "content",
          "label": "Plate tectonics",
          "width": 520,
          "height": 280,
          "visible": true,
          "showLabel": true,
          "data": {
            "content": {
              "kind": "markdown",
              "value": "# Plate tectonics\n\nEarth's outer shell is broken into moving plates, and almost everything about the planet's surface follows from that."
            }
          }
        },
        {
          "id": "c0de0000-0000-4000-8000-000000004f28",
          "type": "content",
          "label": "The lithosphere",
          "width": 440,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "content": {
              "kind": "markdown",
              "value": "# The lithosphere\n\nThe rigid outer layer, about 100 km thick, is cracked into around a dozen major plates."
            }
          }
        },
        {
          "id": "c0de0000-0000-4000-8000-000000006e17",
          "type": "content",
          "label": "The mantle moves",
          "width": 440,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "content": {
              "kind": "markdown",
              "value": "# The mantle moves\n\nSlow convection in the hot mantle below drags the plates along, a few centimetres a year."
            }
          }
        },
        {
          "id": "c0de0000-0000-4000-8000-000000008d06",
          "type": "content",
          "label": "Plate boundaries",
          "width": 440,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "content": {
              "kind": "markdown",
              "value": "# Plate boundaries\n\nPlates diverge, converge or slide past each other, and each kind builds something different."
            }
          }
        },
        {
          "id": "c0de0000-0000-4000-8000-00000000abf5",
          "type": "content",
          "label": "Earthquakes and volcanoes",
          "width": 440,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "content": {
              "kind": "markdown",
              "value": "# Earthquakes and volcanoes\n\nThey cluster along boundaries, where plates grind, sink and melt."
            }
          }
        },
        {
          "id": "c0de0000-0000-4000-8000-00000000cae4",
          "type": "content",
          "label": "Continental drift",
          "width": 440,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "content": {
              "kind": "markdown",
              "value": "# Continental drift\n\nMatching coastlines and fossils suggested the continents were once joined. Plate tectonics explained how."
            }
          }
        },
        {
          "id": "c0de0000-0000-4000-8000-00000000e9d3",
          "type": "content",
          "label": "Open question: why do plates move?",
          "width": 440,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "content": {
              "kind": "markdown",
              "value": "# Open question: why do plates move?\n\nIs it mantle convection, slab pull or ridge push? Scientists still weigh the three."
            }
          }
        }
      ]
    },
    {
      "action": "createEdges",
      "edges": [
        {
          "id": "beef0000-0000-4000-8000-000000019c22",
          "type": "leads-to",
          "source": "c0de0000-0000-4000-8000-000000003039",
          "target": "c0de0000-0000-4000-8000-000000004f28",
          "label": "is made of",
          "data": {}
        },
        {
          "id": "beef0000-0000-4000-8000-00000003353b",
          "type": "leads-to",
          "source": "c0de0000-0000-4000-8000-000000004f28",
          "target": "c0de0000-0000-4000-8000-000000006e17",
          "label": "is moved by",
          "data": {}
        },
        {
          "id": "beef0000-0000-4000-8000-00000004ce54",
          "type": "leads-to",
          "source": "c0de0000-0000-4000-8000-000000003039",
          "target": "c0de0000-0000-4000-8000-000000008d06",
          "label": "shows up at",
          "data": {}
        },
        {
          "id": "beef0000-0000-4000-8000-00000006676d",
          "type": "leads-to",
          "source": "c0de0000-0000-4000-8000-000000008d06",
          "target": "c0de0000-0000-4000-8000-00000000abf5",
          "label": "causes",
          "data": {}
        },
        {
          "id": "beef0000-0000-4000-8000-000000080086",
          "type": "leads-to",
          "source": "c0de0000-0000-4000-8000-000000003039",
          "target": "c0de0000-0000-4000-8000-00000000cae4",
          "label": "explains",
          "data": {}
        },
        {
          "id": "beef0000-0000-4000-8000-00000009999f",
          "type": "leads-to",
          "source": "c0de0000-0000-4000-8000-000000006e17",
          "target": "c0de0000-0000-4000-8000-00000000e9d3",
          "label": "but why?",
          "data": {}
        }
      ]
    }
  ]
}
```
