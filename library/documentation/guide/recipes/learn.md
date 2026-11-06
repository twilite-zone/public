## Learning a topic

When the user wants to learn something over time (a subject, a skill, a course, an exam), build a **study guide** from the Learn a Topic Template, which a graph uses through one `import` of the template. This is different from an idea map: an idea map explains or explores something, a study guide tracks how well it is known and what to learn next. Every card is typed, and every card has a `check` flag.

| `type` | `data.classRef` | Fields | What it is |
|---|---|---|---|
| `topic` | `tlz://twilite.zone/library/classes/nodes/learn-a-topic/topic.node-class.node` | `title` (what is being learned), `body` (why, and what done looks like), `check` | The subject. There is one |
| `concept` | `tlz://twilite.zone/library/classes/nodes/learn-a-topic/concept.node-class.node` | `title`, `body` (in the learner's own words), `confidence` (`unknown`, `shaky` or `solid`), `check` | One thing to know, and how well it is known |
| `resource` | `tlz://twilite.zone/library/classes/nodes/learn-a-topic/resource.node-class.node` | `title`, `kind` (`book`, `video`, `article`, `course`, `person` or `other`), `where`, `body`, `check` | Where to learn a concept |
| `gap` | `tlz://twilite.zone/library/classes/nodes/learn-a-topic/gap.node-class.node` | `title` (the question), `body` (where it gets stuck), `check` | Something about a concept that is not yet understood |

Edge `type`s, each with the ends it allows: `covers` (the topic to each of its concepts), `prepares` (a prerequisite concept to the concept that needs it), `explained-by` (a concept to a resource) and `has-gap` (a concept to a gap).

- **One `topic` card.** Write why they are learning it, and what being done looks like, in their words.
- **Four to ten concepts**, each joined to the topic with `covers`. Name each in a few words and write what it means in the learner's own words, as far as they have said.
- **Join prerequisites with `prepares`, from the one that comes first to the one that needs it.** Only real prerequisites: a concept that merely relates to another does not get one. The chain of them is the order to learn in.
- **Say how well each concept is known, and only as well as the user told you.** Use `unknown` when they have not said, `shaky` for "I sort of get it", and `solid` only when they say they know it. Never mark a concept `solid` for them.
- **Resources: say what kind of thing to look for, and do not invent one.** Do not make up a book title, an author, a link or a course. Describe the kind of resource and where to ask for it, and set `check: true` if you name anything specific you are not certain exists.
- **A gap is the question they are stuck on.** Add one only when they say they do not understand something, and join it to the concept it belongs to with `has-gap`.
- **Size the cards** 520 wide and 260 high for the topic, 420 by 240 for the rest, and leave out `position`: Twilite arranges them, with the topic on top and the concepts in the order they are learned beneath.
- **As they learn, update the concepts.** When they say they now understand something, change its `confidence` with `updateNode` and the `id` you gave it, as in the last example below. The study guide's progress and its "start here" follow the cards.
- The import brings the template's own Method: when your reply is applied, Twilite adds it and the edge that runs it, and the study guide's page, card and icon are written from your cards. Do not write a Method yourself, and do not write the graph's own Detail or Summary.

This study guide has one solid concept, one shaky one, and a book to ask about that is marked to check because no title was given:

```json
{
  "action": "transaction",
  "commands": [
    {
      "action": "createNodes",
      "nodes": [
        {
          "id": "a0a00000-0000-4000-8000-0000000031b3",
          "type": "import",
          "label": "Learn a Topic Template",
          "width": 320,
          "height": 140,
          "data": {
            "bridge": {
              "ref": "tlz://twilite.zone/library/templates/learn-a-topic/root.node",
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
          "id": "a0a00000-0000-4000-8000-000000003366",
          "type": "topic",
          "label": "Learning to read a balance sheet",
          "width": 520,
          "height": 260,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Learning to read a balance sheet",
            "classRef": "tlz://twilite.zone/library/classes/nodes/learn-a-topic/topic.node-class.node",
            "body": "I run a small shop and want to follow my accountant without nodding along. Done means reading a balance sheet and saying what changed since last year.",
            "check": false
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-000000003519",
          "type": "concept",
          "label": "Assets and liabilities",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Assets and liabilities",
            "classRef": "tlz://twilite.zone/library/classes/nodes/learn-a-topic/concept.node-class.node",
            "body": "What the business owns and what it owes.",
            "confidence": "solid",
            "check": false
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-0000000036cc",
          "type": "concept",
          "label": "Equity",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Equity",
            "classRef": "tlz://twilite.zone/library/classes/nodes/learn-a-topic/concept.node-class.node",
            "body": "What is left for the owner once the liabilities are taken out of the assets.",
            "confidence": "shaky",
            "check": false
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-00000000387f",
          "type": "concept",
          "label": "How the sheet balances",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "How the sheet balances",
            "classRef": "tlz://twilite.zone/library/classes/nodes/learn-a-topic/concept.node-class.node",
            "body": "Why assets always equal liabilities plus equity, and what a change in one does to the others.",
            "confidence": "unknown",
            "check": false
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-000000003a32",
          "type": "resource",
          "label": "A beginner accounting book",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "A beginner accounting book",
            "classRef": "tlz://twilite.zone/library/classes/nodes/learn-a-topic/resource.node-class.node",
            "kind": "book",
            "where": "ask the accountant which one they recommend",
            "body": "Look for a chapter on the balance sheet, not on bookkeeping.",
            "check": true
          }
        },
        {
          "id": "a0a00000-0000-4000-8000-000000003be5",
          "type": "gap",
          "label": "Is equity the same as profit?",
          "width": 420,
          "height": 240,
          "visible": true,
          "showLabel": true,
          "data": {
            "title": "Is equity the same as profit?",
            "classRef": "tlz://twilite.zone/library/classes/nodes/learn-a-topic/gap.node-class.node",
            "body": "My accountant uses both words and I am not sure they differ.",
            "check": false
          }
        }
      ]
    },
    {
      "action": "createEdges",
      "edges": [
        {
          "id": "b0b00000-0000-4000-8000-000000003d98",
          "type": "covers",
          "source": "a0a00000-0000-4000-8000-000000003366",
          "target": "a0a00000-0000-4000-8000-000000003519",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-000000003f4b",
          "type": "covers",
          "source": "a0a00000-0000-4000-8000-000000003366",
          "target": "a0a00000-0000-4000-8000-0000000036cc",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-0000000040fe",
          "type": "covers",
          "source": "a0a00000-0000-4000-8000-000000003366",
          "target": "a0a00000-0000-4000-8000-00000000387f",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-0000000042b1",
          "type": "prepares",
          "source": "a0a00000-0000-4000-8000-000000003519",
          "target": "a0a00000-0000-4000-8000-0000000036cc",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-000000004464",
          "type": "prepares",
          "source": "a0a00000-0000-4000-8000-0000000036cc",
          "target": "a0a00000-0000-4000-8000-00000000387f",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-000000004617",
          "type": "explained-by",
          "source": "a0a00000-0000-4000-8000-0000000036cc",
          "target": "a0a00000-0000-4000-8000-000000003a32",
          "label": "",
          "data": {}
        },
        {
          "id": "b0b00000-0000-4000-8000-0000000047ca",
          "type": "has-gap",
          "source": "a0a00000-0000-4000-8000-0000000036cc",
          "target": "a0a00000-0000-4000-8000-000000003be5",
          "label": "",
          "data": {}
        }
      ]
    }
  ]
}
```

Later, when the learner says they now understand equity, change only that card:

```json
{
  "action": "updateNode",
  "id": "a0a00000-0000-4000-8000-0000000036cc",
  "updates": {
    "data": {
      "confidence": "solid"
    }
  }
}
```
