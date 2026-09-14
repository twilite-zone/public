const fs = require('fs');
const path = require('path');

const root = __dirname;
const basePath = path.resolve(root, '../workspace-boundary-smoke-suite/typed-workspace-edge-source/root.node');
const base = JSON.parse(fs.readFileSync(basePath, 'utf8'));
const address = name => `github://twilite-zone/public/tasks/edge-lane-smoke-suite/${name}/root.node`;
const clone = value => JSON.parse(JSON.stringify(value));
const handle = (id, direction, angle, dataType = 'signal') => ({ id, key: id, label: id, direction, dataType, angle, allowedEdgeTypes: ['smoke-signal'] });
const ordinary = (id, label, x, y, handles) => ({ id, type: 'default', label, position: { x, y }, width: 220, height: 150,
  visible: true, showLabel: true, ports: handles, handles: handles.map(item => ({ ...item, portId: item.id })),
  data: { title: label, description: 'Edge-lane smoke fixture node.' } });
const typedEdge = (id, source, sourceHandle, target, targetHandle, label) => ({ id, type: 'reference', source, sourceHandle,
  target, targetHandle, label, style: { route: 'orthogonal', color: '#38bdf8', width: 4, showArrow: true, arrowPosition: 'end' } });

function scaffold(name, title, description) {
  const graph = clone(base);
  graph.metadata = { title, kind: 'validation', version: '0.1.0', preferredViewer: 'https://twilite.zone',
    modified: '2026-09-13T00:00:00.000Z', tags: ['smoke-test', 'edge-lanes', 'routing'] };
  const declaration = graph.nodes.find(node => node.id === 'declaration');
  declaration.label = title;
  declaration.data.identity = { graphId: name, nodeId: name, name: title, version: '0.1.0', description,
    updatedAt: '2026-09-13T00:00:00.000Z' };
  declaration.data.document.url = address(name);
  graph.nodes = graph.nodes.filter(node => node.id !== 'typed-export');
  for (const node of graph.nodes) {
    if (node.data?.identity) node.data.identity = { ...node.data.identity, graphId: name,
      nodeId: node.id === 'declaration' ? name : node.id };
    if (node.id === 'instructions') node.data.markdown = `# ${title}\n\n${description}`;
    if (node.id === 'declaration--detail-view') node.data.content.value = `# ${title}\n\n${description}`;
    if (node.id === 'declaration--summary-view') node.data.content.value = `**${title}**\n\n${description}`;
    if (node.id === 'declaration--icon-view') node.data.content.value = title;
  }
  return graph;
}

function write(name, graph) {
  const dir = path.join(root, name);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'root.node'), JSON.stringify(graph, null, 2) + '\n');
}

const graphLevel = scaffold('graph-level', '1 · Graph-Level Lanes', 'Inspect ordinary handles, source shoulders, parallel lanes, and non-semantic crossing hops in one graph. Move nodes and confirm the route order remains stable.');
graphLevel.nodes.push(
  ordinary('source-a', 'Source A', 80, 300, [handle('east-1', 'output', 0), handle('east-2', 'output', 15), handle('south', 'output', 90)]),
  ordinary('source-b', 'Source B', 80, 720, [handle('east', 'output', 0)]),
  ordinary('target-a', 'Target A', 820, 220, [handle('west', 'input', 180)]),
  ordinary('target-b', 'Target B', 820, 500, [handle('west', 'input', 180)]),
  ordinary('target-c', 'Target C', 500, 820, [handle('north', 'input', 270)]),
  ordinary('target-d', 'Target D', 1080, 720, [handle('west', 'input', 180)])
);
graphLevel.edges.push(
  typedEdge('lane-a', 'source-a', 'east-1', 'target-a', 'west', 'parallel one'),
  typedEdge('lane-b', 'source-a', 'east-2', 'target-b', 'west', 'parallel two'),
  typedEdge('lane-c', 'source-a', 'south', 'target-c', 'north', 'vertical lane'),
  typedEdge('lane-d', 'source-b', 'east', 'target-d', 'west', 'crossing lane')
);
write('graph-level', graphLevel);

const workspaceSource = scaffold('workspace-source', '2 · Workspace Lane Source', 'Open Workspace Lane Target alongside. The three export Bridges resolve into three ordinary typed workspace edges. Expect source shoulders, stable parallel strands, and the same edge styling used inside a graph.');
const targetRef = address('workspace-target');
['north', 'middle', 'south'].forEach((slot, index) => {
  workspaceSource.nodes.push({ id: `export-${slot}`, type: 'bridge', label: `Signal ${slot} export`, position: { x: -240, y: -120 + index * 190 },
    width: 260, height: 150, visible: true, showLabel: true,
    ports: [handle('root', 'output', 0)], handles: [{ ...handle('root', 'output', 0), portId: 'root' }],
    data: { identity: { graphId: 'workspace-source', nodeId: `signal-${slot}` }, bridge: { ref: targetRef, role: 'export',
      resourceKind: 'signal', surfaceId: `signal-${slot}`, scope: 'workspace', grants: ['connect'], relationship: { edgeClassKey: 'smoke-signal',
        renderDefaults: { color: '#f43fbb', width: 5, dash: [12, 5], showArrow: true, arrowPosition: 'end' } } },
      target: { kind: 'graph', mode: 'bridge', ref: targetRef, role: 'export' } } });
});
write('workspace-source', workspaceSource);

const workspaceTarget = scaffold('workspace-target', '3 · Workspace Lane Target', 'Open Workspace Lane Source alongside. Three matching import Bridges consume its capabilities. The projected edges must use the same lane grammar and typed renderer as graph-level edges.');
const sourceRef = address('workspace-source');
['north', 'middle', 'south'].forEach((slot, index) => {
  workspaceTarget.nodes.push({ id: `import-${slot}`, type: 'bridge', label: `Signal ${slot} import`, position: { x: -240, y: -120 + index * 190 },
    width: 260, height: 150, visible: true, showLabel: true,
    ports: [handle('root', 'input', 180)], handles: [{ ...handle('root', 'input', 180), portId: 'root' }],
    data: { identity: { graphId: 'workspace-target', nodeId: `signal-${slot}` }, bridge: { ref: sourceRef, role: 'import',
      resourceKind: 'signal', surfaceId: `signal-${slot}`, consumesBridgeNodeId: `export-${slot}`, scope: 'workspace', grants: ['consume'],
      relationship: { acceptedEdgeClasses: ['smoke-signal'] } }, acceptedEdgeClasses: ['smoke-signal'],
      target: { kind: 'graph', mode: 'bridge', ref: sourceRef, role: 'import' } } });
});
write('workspace-target', workspaceTarget);

const suite = scaffold('index', 'Edge Lane Smoke Suite', 'Open each fixture from this index. The suite compares the same routing grammar inside a graph and between graph-shaped workspace nodes.');
suite.metadata.description = 'Manual smoke suite for source shoulders, deterministic parallel lanes, crossings, and shared graph/workspace routing.';
suite.nodes = suite.nodes.filter(node => node.id !== 'instructions');
suite.nodes.push({ id: 'instructions', type: 'markdown', label: 'Run the suite', position: { x: 420, y: 0 }, width: 620, height: 420,
  visible: true, showLabel: true, data: { markdown: '# Edge Lane Smoke Suite\n\n1. Open **Graph-Level Lanes** and inspect the four typed routes. Crossings use hops and never form junctions.\n2. Move and resize nodes. Source shoulders and lane order remain stable.\n3. Return here; open **Workspace Lane Source**, then **Workspace Lane Target** alongside.\n4. Zoom out. The three typed workspace edges remain parallel and use the same renderer.\n5. Focus either graph and zoom in. Graph-local edges retain the same route grammar.\n\nPASS: endpoints stay attached; edge identity and type survive; unrelated crossings do not imply relationships; route order is deterministic at both scales.' } });
[
  ['open-graph-level', '1 · Graph-Level Lanes', address('graph-level'), 160, 520],
  ['open-workspace-source', '2 · Workspace Lane Source', address('workspace-source'), 520, 520],
  ['open-workspace-target', '3 · Workspace Lane Target', address('workspace-target'), 880, 520]
].forEach(([id, label, ref, x, y]) => suite.nodes.push({ id, type: 'portal', label, position: { x, y }, width: 280, height: 160,
  visible: true, showLabel: true, ports: [handle('root', 'output', 0, 'graph')], handles: [{ ...handle('root', 'output', 0, 'graph'), portId: 'root' }],
  data: { target: { kind: 'graph', mode: 'navigate', ref }, intent: 'internal', security: 'trusted' } }));
fs.writeFileSync(path.join(root, 'root.node'), JSON.stringify(suite, null, 2) + '\n');
