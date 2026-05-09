# Skill: KnowledgeResearchIntegrity

## Intent
Validate and report contract drift in Knowledge / Research graphs.

This skill enforces the current v1 nodeset contract:
- `concept`
- `claim`
- `evidence`
- `source`
- `question`
- `summary`

It checks provenance and synthesis expectations without silently rewriting meaning-bearing content.

## Reads
- nodes[].type
- nodes[].label
- nodes[].data
- edges[]
- local bindings or bridge-derived registry state when present
- template/task references when present

## Writes
- validationResults.knowledgeResearch
- report markdown or equivalent graph-local output
- optional repair proposals for metadata-only drift

## Never Touches
- claim statements
- evidence excerpts or observations
- source titles or creator fields
- graph meaning inferred from prose

## Determinism
Validation: yes.

Repair proposals: bounded and deterministic when limited to metadata normalization.

## Scope
Single Knowledge / Research graph plus explicitly linked summary/contract artifacts.

## Checks
- only approved v1 node types are treated as authoritative
- deferred types are reported, not promoted silently
- `evidence` carries a source ref or locator signal
- `source` carries durable identifying information
- `claim` names supporting evidence refs
- `summary` names backing refs
- summary surfaces stay wired and inspectable

## Failure Modes
- Unknown node types: report as drift
- Missing provenance fields: blocking error
- Broken summary references: blocking error
- Ambiguous question/planning overlap: warning unless policy says otherwise

## Notes for AI
Fail on provenance gaps.
Never auto-rewrite claim or evidence text.
Limit repair to metadata, labels, references, and summary/report surfaces.
