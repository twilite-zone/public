const fs = require('fs');
const path = require('path');

const root = __dirname;
const template = JSON.parse(fs.readFileSync(path.resolve(root, '../../../../mikemartinez1974/public/templates/smoke-test-template/root.node'), 'utf8'));
const address = 'github://twilite-zone/public/tasks/edge-definition-smoke-suite/root.node';
const classAddress = 'github://twilite-zone/public/tasks/edge-definition-smoke-suite/multi-stroke.edge-class.node';
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
byId('landing-surface').data.content.value = '# Edge Definition Smoke Suite\n\nInspect class and instance stroke stacks, route modes, and node clearance. Use **Enter test bench**.';
byId('test-subject').label = 'Edge definition matrix';
byId('test-subject').data.markdown = '# Edge definition matrix\n\nClass stack · instance override · straight dash · curved avoidance. Follow each labeled edge to its target.';
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
const edge = (id, source, target, label, style, data = {}) => ({ id, type: 'reference', source, sourceHandle: 'out', target, targetHandle: 'in', label,
  style, data });
const classData = { edgeClassKey: 'smoke.multi-stroke', edgeClassRef: classAddress };
graph.edges.push(
  edge('class-stack', 'class-source', 'class-target', 'class stack', {}, classData),
  edge('instance-override', 'override-source', 'override-target', 'instance override', {
    route: 'orthogonal', strokes: [{ color: '#8b5cf6', width: 10 }, { color: '#ffffff', width: 3, dash: [7, 5] }], showArrow: true, arrowPosition: 'end'
  }, classData),
  edge('straight-stack', 'straight-source', 'straight-target', 'straight stack', {
    route: 'straight', strokes: [{ color: '#0f766e', width: 9 }, { color: '#facc15', width: 3, dash: [10, 5] }], showArrow: true, arrowPosition: 'end'
  }),
  edge('curved-detour', 'avoid-source', 'avoid-target', 'avoids node', {
    route: 'curved', strokes: [{ color: '#be123c', width: 10 }, { color: '#fda4af', width: 3 }], showArrow: true, arrowPosition: 'end'
  })
);

// This deliberately small class graph exercises the current field-node
// contract rather than hiding the style only in a legacy manifest object.
const classGraph = {
  fileVersion: '1.0', metadata: { title: 'Smoke Multi-Stroke Edge Class', graphId: 'smoke-multi-stroke-edge-class', kind: 'edge-class',
    preferredViewer: 'https://dev.twilite.zone', tags: ['smoke-test', 'edge-class'] },
  nodes: [
    { id: 'declaration', type: 'declaration', label: 'Smoke Multi-Stroke Edge Class', position: { x: -420, y: 0 }, width: 300, height: 180,
      data: { identity: { graphId: 'smoke-multi-stroke-edge-class', nodeId: 'smoke-multi-stroke-edge-class', name: 'Smoke Multi-Stroke Edge Class' },
        document: { url: classAddress } } },
    ...Object.entries({ key: 'smoke.multi-stroke', label: 'Smoke multi-stroke', meaning: 'One semantic edge with an ordered paint stack',
      defaultEdgeType: 'reference', 'renderDefaults.route': 'curved',
      'renderDefaults.strokes': [{ color: '#0f172a', width: 10 }, { color: '#22d3ee', width: 3 }],
      'renderDefaults.showArrow': true, 'renderDefaults.arrowPosition': 'end' }).map(([key, value], index) => ({
        id: `field-${index}`, type: 'field', label: key, position: { x: 0, y: index * 100 }, width: 330, height: 80,
        data: { title: key, fieldType: Array.isArray(value) ? 'json' : 'text', value }
      }))
  ], edges: [], settings: { github: { repo: 'twilite-zone/public', path: 'tasks/edge-definition-smoke-suite/multi-stroke.edge-class.node', branch: 'main' } }
};
fs.writeFileSync(path.join(root, 'root.node'), JSON.stringify(graph, null, 2) + '\n');
fs.writeFileSync(path.join(root, 'multi-stroke.edge-class.node'), JSON.stringify(classGraph, null, 2) + '\n');
