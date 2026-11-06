## Writing a person profile

When the user asks about a person (someone from history, a character in a story, a relative, themselves), build a **person profile** from the Person Profile Template, which a graph uses through one `import` of the template. Every card is typed, and every card has a `check` flag.

| `type` | `data.classRef` | Fields | What it is |
|---|---|---|---|
| `person` | `tlz://twilite.zone/library/classes/nodes/person-profile/person.node-class.node` | `title` (the name), `body`, `born`, `died`, `subject`, `check` | The person the profile is about, or someone connected to them |
| `event` | `tlz://twilite.zone/library/classes/nodes/person-profile/event.node-class.node` | `title`, `when`, `body`, `check` | Something that happened in their life |
| `work` | `tlz://twilite.zone/library/classes/nodes/person-profile/work.node-class.node` | `title`, `year`, `body`, `check` | Something they made that lasts |

Edge `type`s, each with the ends it allows: `took-part-in` (the person to an event), `precedes` (an event to the event that came after it, so a life reads in order), `knew` (the person to someone they knew, with a `label` that says how: *mother*, *mentor*, *rival*), `made` (the person to a work).

- **One person has `subject: true`**, the one the profile is about. Every other person is someone connected to them.
- **Five to ten events, in time order.** Each has a `when`, as text: a year or a date. Join them with `precedes`.
- **Never invent a fact.** Do not make up a date, a quotation or a relationship. Write what you are sure of. Where you are not sure, set `check: true` on that card so the user can see it needs checking, and if you do not know a `when`, leave it empty and set `check: true`. A profile that shows what it is unsure of is better than a smooth one that is wrong.
- **Size the cards** 520 wide and 260 high for the subject, 420 by 240 for the rest, and leave out `position`: Twilite arranges them, with the person on top and the events in a row beneath.
- The import brings the template's own Method: when your reply is applied, Twilite adds it and the edge that runs it, and the profile's page, card and face are written from your cards. Do not write a Method yourself, and do not write the graph's own Detail or Summary.

This profile of one life has two cards marked to check: a person whose dates are not given, and a claim that is still debated ("the first computer program"):

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "createNodes",
      "nodes": [
        {
          "id": "a0a00000-0000-4000-8000-000000001092",
          "type": "import",
          "label": "Person Profile Template",
          "width": 320,
          "height": 140,
          "data": {
            "bridge": {
              "ref": "tlz://twilite.zone/library/templates/person-profile/root.node",
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
          "id": "a0a00000-0000-4000-8000-00000001a9ab",
          "type": "person",
          "label": "Ada Lovelace",
          "width": 520,
          "height": 260,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Ada Lovelace",
            "classRef": "tlz://twilite.zone/library/classes/nodes/person-profile/person.node-class.node",
            "body": "English mathematician who wrote the first published algorithm for a machine, and saw that such machines could do more than arithmetic.",
            "born": "1815",
            "died": "1852",
            "subject": true,
            "check": false
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-0000000342c4",
          "type": "event",
          "label": "Born in London",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Born in London",
            "classRef": "tlz://twilite.zone/library/classes/nodes/person-profile/event.node-class.node",
            "when": "1815",
            "body": "The only legitimate child of the poet Lord Byron and Anne Isabella Milbanke.",
            "check": false
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-00000004dbdd",
          "type": "event",
          "label": "Meets Charles Babbage",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Meets Charles Babbage",
            "classRef": "tlz://twilite.zone/library/classes/nodes/person-profile/event.node-class.node",
            "when": "1833",
            "body": "Introduced to the inventor, she becomes fascinated by his plans for a calculating machine.",
            "check": false
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-0000000674f6",
          "type": "event",
          "label": "Publishes her Notes",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Publishes her Notes",
            "classRef": "tlz://twilite.zone/library/classes/nodes/person-profile/event.node-class.node",
            "when": "1843",
            "body": "Her translation of a paper on the Analytical Engine appears with notes three times its length.",
            "check": false
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-000000080e0f",
          "type": "event",
          "label": "Dies at 36",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Dies at 36",
            "classRef": "tlz://twilite.zone/library/classes/nodes/person-profile/event.node-class.node",
            "when": "1852",
            "body": "She dies in London at the age of 36.",
            "check": false
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-00000009a728",
          "type": "person",
          "label": "Charles Babbage",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Charles Babbage",
            "classRef": "tlz://twilite.zone/library/classes/nodes/person-profile/person.node-class.node",
            "body": "The mathematician and inventor who designed the Analytical Engine.",
            "born": "1791",
            "died": "1871",
            "subject": false,
            "check": false
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-0000000b4041",
          "type": "person",
          "label": "Anne Isabella Milbanke",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Anne Isabella Milbanke",
            "classRef": "tlz://twilite.zone/library/classes/nodes/person-profile/person.node-class.node",
            "body": "Her mother, who encouraged her study of mathematics.",
            "born": "",
            "died": "",
            "subject": false,
            "check": true
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-0000000cd95a",
          "type": "work",
          "label": "Notes on the Analytical Engine",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Notes on the Analytical Engine",
            "classRef": "tlz://twilite.zone/library/classes/nodes/person-profile/work.node-class.node",
            "year": "1843",
            "body": "Note G sets out a method for the machine to compute Bernoulli numbers, often called the first computer program.",
            "check": true
          }
        }
      ]
    },
    {
      "action": "createEdges",
      "edges": [
        {
          "id": "b0b00000-0000-4000-8000-00000001a9ab",
          "type": "took-part-in",
          "source": "a0a00000-0000-4000-8000-00000001a9ab",
          "target": "a0a00000-0000-4000-8000-0000000342c4",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-0000000342c4",
          "type": "took-part-in",
          "source": "a0a00000-0000-4000-8000-00000001a9ab",
          "target": "a0a00000-0000-4000-8000-00000004dbdd",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-00000004dbdd",
          "type": "took-part-in",
          "source": "a0a00000-0000-4000-8000-00000001a9ab",
          "target": "a0a00000-0000-4000-8000-0000000674f6",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-0000000674f6",
          "type": "took-part-in",
          "source": "a0a00000-0000-4000-8000-00000001a9ab",
          "target": "a0a00000-0000-4000-8000-000000080e0f",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-000000080e0f",
          "type": "precedes",
          "source": "a0a00000-0000-4000-8000-0000000342c4",
          "target": "a0a00000-0000-4000-8000-00000004dbdd",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-00000009a728",
          "type": "precedes",
          "source": "a0a00000-0000-4000-8000-00000004dbdd",
          "target": "a0a00000-0000-4000-8000-0000000674f6",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-0000000b4041",
          "type": "precedes",
          "source": "a0a00000-0000-4000-8000-0000000674f6",
          "target": "a0a00000-0000-4000-8000-000000080e0f",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-0000000cd95a",
          "type": "knew",
          "source": "a0a00000-0000-4000-8000-00000001a9ab",
          "target": "a0a00000-0000-4000-8000-00000009a728",
          "label": "colleague",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-0000000e7273",
          "type": "knew",
          "source": "a0a00000-0000-4000-8000-00000001a9ab",
          "target": "a0a00000-0000-4000-8000-0000000b4041",
          "label": "mother",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-000000100b8c",
          "type": "made",
          "source": "a0a00000-0000-4000-8000-00000001a9ab",
          "target": "a0a00000-0000-4000-8000-0000000cd95a",
          "label": "",
          "data": {}
        }
      ]
    }
  ]
}
```
