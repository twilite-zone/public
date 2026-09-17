const fs = require('fs');
const path = require('path');

const root = __dirname;
const template = JSON.parse(fs.readFileSync(path.resolve(root, '../../../../mikemartinez1974/public/templates/smoke-test-template/root.node'), 'utf8'));
const address = 'github://twilite-zone/public/tasks/edge-definition-smoke-suite/root.node';
const graph = structuredClone(template);
const prefix = 'smoke-test-template-';
for (const node of graph.nodes) node.id = node.id.replace(prefix, 'edge-definition-smoke-');
for (const edge of graph.edges) {
  edge.id = edge.id.replace(prefix, 'edge-definition-smoke-');
  edge.source = edge.source.replace(prefix, 'edge-definition-smoke-');
  edge.target = edge.target.replace(prefix, 'edge-definition-smoke-');
}
graph.metadata = { ...graph.metadata, title: 'Edge Definition Smoke Suite', graphId: 'edge-definition-smoke', kind: 'validation',
  description: 'Class defaults, ordered stroke stacks, instance overrides, route modes, labels, and node avoidance.',
  tags: ['smoke-test', 'edge-definition', 'multi-stroke'] };
graph.settings.github = { ...graph.settings.github, repo: 'twilite-zone/public', path: 'tasks/edge-definition-smoke-suite/root.node', branch: 'main', repoVisibility: 'public' };
graph.settings.layout.edgeLaneGapPx = 18;
for (const node of graph.nodes) {
  if (node.data?.identity) node.data.identity = { ...node.data.identity, graphId: 'edge-definition-smoke', nodeId: node.id };
}
const byId = id => graph.nodes.find(node => node.id === `edge-definition-smoke-${id}`);
byId('declaration').label = 'Edge Definition Smoke Suite';
byId('declaration').data.identity = { ...byId('declaration').data.identity, name: 'Edge Definition Smoke Suite' };
byId('declaration').data.document.url = address;
byId('landing-surface').data.content.value = '# Edge Definition Smoke Suite\n\nInspect class and instance stroke stacks, route modes, and node clearance. The bench is derived from [authored edge definitions](github://twilite-zone/public/tasks/edge-definition-smoke-suite/edge-definitions.node). Use **Enter test bench**.';
byId('test-subject').label = 'Edge definition matrix';
byId('test-subject').data.markdown = '# Edge definition matrix\n\nClass stack · instance override · straight dash · curved avoidance. Follow each labeled edge to its target. [Inspect the source definitions](github://twilite-zone/public/tasks/edge-definition-smoke-suite/edge-definitions.node).';
byId('setup').data.markdown = '## Setup\n\nOpen the test bench at Detail zoom. Inspect the four colored relationships below, then move the gray obstacle into and out of the fourth route. Select an edge to inspect its definition.';
byId('expected').data.markdown = '## Expected Result\n\n**Class stack:** dark outer stroke and cyan center. **Override:** violet outer stroke and white dashed center instead of class colors. **Straight:** two parallel-looking stacked paints on one straight route. **Avoidance:** two-stroke curved route detours around the gray node with air between them. Labels and arrows stay on their own edges.';
byId('observations').data.markdown = '## Observations\n\nRecord the build, zoom, stroke order, label position, route clearance, and whether class or instance styles won. Visual verification is pending.';

const port = (id, direction, angle) => ({ id, key: id, label: id, direction, angle, dataType: 'any', allowedEdgeTypes: ['reference'] });
const fixture = (id, label, x, y, ports) => ({ id, type: 'default', label, position: { x, y }, width: 210, height: 112,
  visible: true, showLabel: true, ports, handles: ports.map(item => ({ ...item, portId: item.id })), data: { title: label } });
const output = port('out', 'output', 0), input = port('in', 'input', 180);
[
  ['class-source', 'Class defaults', -410, 670, [output]], ['class-target', 'Class target', 420, 670, [input]],
  ['override-source', 'Instance override', -410, 920, [output]], ['override-target', 'Override target', 420, 920, [input]],
  ['straight-source', 'Straight + dash', -410, 1170, [output]], ['straight-target', 'Straight target', 420, 1170, [input]],
  ['avoid-source', 'Curved avoidance', -410, 1450, [output]], ['avoid-target', 'Avoidance target', 420, 1450, [input]],
  ['obstacle', 'Move me: obstacle', 0, 1410, []]
].forEach(args => graph.nodes.push(fixture(...args)));
// The source graphs own all paint and routing values. This generator only
// materializes their four cases into the template's visual test bench.
async function deriveFixtureEdges() {
  const { pathToFileURL } = require('url');
  const runtimeRoot = path.resolve(root, '../../../../twilite/components/GraphEditor/utils');
  const { deriveEdgeClassFromGraphPayload } = await import(pathToFileURL(path.join(runtimeRoot, 'edgeClass.js')).href);
  const { normalizeEdgeStyleContract } = await import(pathToFileURL(path.join(runtimeRoot, 'edgeStyleContract.js')).href);
  const { validateGraphInvariants } = await import(pathToFileURL(path.join(runtimeRoot, '../validators/validateGraphInvariants.js')).href);
  const definitionGraph = JSON.parse(fs.readFileSync(path.join(root, 'edge-definitions.node'), 'utf8'));
  const validate = (payload, name) => {
    const report = validateGraphInvariants({ nodes: payload.nodes, edges: payload.edges, mode: 'load' });
    if (report.errors.length || report.warnings.length) throw new Error(`${name}: ${JSON.stringify(report)}`);
  };
  validate(definitionGraph, 'edge-definitions.node');
  const prefix = 'github://twilite-zone/public/tasks/edge-definition-smoke-suite/';
  const cases = definitionGraph.nodes.filter(node => node.type === 'field');
  for (const node of cases) {
    const definition = node.data?.value;
    if (!definition || typeof definition !== 'object' || !definition.edgeClassRef?.startsWith(prefix)) {
      throw new Error(`Invalid edge definition: ${node.id}`);
    }
    const classFile = path.basename(definition.edgeClassRef.slice(prefix.length));
    if (graph.edges.some(edge => edge.id === definition.edgeId)) throw new Error(`Duplicate edge ID: ${definition.edgeId}`);
    if (!graph.nodes.some(item => item.id === definition.source) || !graph.nodes.some(item => item.id === definition.target)) {
      throw new Error(`Missing fixture endpoint: ${definition.edgeId}`);
    }
    const classGraph = JSON.parse(fs.readFileSync(path.join(root, classFile), 'utf8'));
    validate(classGraph, classFile);
    const edgeClass = deriveEdgeClassFromGraphPayload(classGraph);
    if (!edgeClass?.key) throw new Error(`Missing edge class: ${classFile}`);
    const classStyle = normalizeEdgeStyleContract(edgeClass.renderDefaults || {}, { context: 'class', preserveUnknown: false });
    const override = normalizeEdgeStyleContract(definition.styleOverride || {}, { preserveUnknown: false });
    graph.edges.push({
      id: definition.edgeId, type: edgeClass.defaultEdgeType || 'reference',
      source: definition.source, sourceHandle: 'out', target: definition.target, targetHandle: 'in',
      label: definition.label, style: { ...classStyle, ...override },
      data: { edgeClassKey: edgeClass.key, edgeClassRef: definition.edgeClassRef,
        definitionRef: 'github://twilite-zone/public/tasks/edge-definition-smoke-suite/edge-definitions.node', definitionNodeId: node.id }
    });
  }
  validate(graph, 'root.node');
  const generated = JSON.stringify(graph, null, 2) + '\n';
  const outputPath = path.join(root, 'root.node');
  if (process.argv.includes('--check')) {
    if (fs.readFileSync(outputPath, 'utf8') !== generated) throw new Error('root.node is stale; run node build-suite.cjs');
    console.log('Edge smoke fixture matches its authored definitions.');
  } else {
    fs.writeFileSync(outputPath, generated);
  }
}
deriveFixtureEdges().catch(error => { console.error(error); process.exitCode = 1; });
