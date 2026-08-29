const fs = require('fs');
const path = require('path');

const graphId = 'twilite-subscription';
const rootPort = (direction = 'bidirectional', dataType = 'any') => ({
  id: 'root', label: 'root', direction, dataType, angle: 180, portId: 'root'
});
const relationshipHandle = (id, label, angle) => ({ id, label, direction: 'output', dataType: 'view', angle, portId: id });
const node = (id, type, label, x, y, width, height, data = {}, handles = [rootPort()]) => ({
  id, type, label, position: { x, y }, width, height,
  handles,
  ports: handles.map(({ id: portId, label: portLabel, direction, dataType, angle }) => ({ id: portId, label: portLabel, direction, dataType, angle })),
  visible: true, showLabel: true,
  data: { ...data, identity: { ...(data.identity || {}), graphId } }
});
const edge = (id, source, sourceHandle, target, targetHandle, label, semanticRole) => ({
  id, type: 'reference', source, target, sourceHandle, targetHandle, label,
  data: { role: semanticRole, semanticRole }
});
const bind = (key, ref, bridgeId) => ({
  definitionKey: key,
  _classBinding: { key, ref, sourceRef: ref },
  _bridge: { sourceBridgeNodeId: bridgeId, targetKind: 'node-class', classKey: key, classRef: ref }
});
const bridge = (id, label, key, ref, x, y) => node(id, 'bridge', label, x, y, 260, 110, {
  visibilityRole: 'editor',
  target: { mode: 'bridge', ref, kind: 'node-class', resourceKind: 'node-class', scope: 'focused-graph', grants: ['create'], label, key },
  bridge: { ref, resourceKind: 'node-class', scope: 'focused-graph', grants: ['create'] },
  authority: 'bridge', resourceKind: 'node-class', scope: 'focused-graph', grants: ['create']
});

const refs = {
  hero: 'github://twilite-zone/public/products/twilite/twilite-product-hero.node-class.node',
  section: 'github://twilite-zone/public/products/twilite/twilite-product-section.node-class.node',
  proof: 'github://twilite-zone/public/products/twilite/twilite-product-proof.node-class.node',
  cta: 'github://twilite-zone/public/products/twilite/twilite-product-cta.node-class.node'
};

const nodes = [
  node('twilite-subscription-declaration', 'declaration', 'What You Get With Twilite', -900, -780, 430, 330, {
    identity: { name: 'What You Get With Twilite', version: '0.1.0', description: 'A customer-facing account of the capabilities, continuing service, limits, and next step included with a Twilite subscription.' },
    intent: { kind: 'product', scope: 'public', artifactKind: 'graph' },
    declaration: { kind: 'product', targetMode: 'artifact', artifactKind: 'graph', defaultSurfaceId: 'root', surfaces: [{ id: 'root', kind: 'implicit-root', label: 'What You Get With Twilite', viewNodeId: 'twilite-subscription-detail-view' }] },
    defaultPort: 'root',
    authority: { mutation: { allowCreate: true, allowUpdate: true, allowDelete: true }, actors: { humans: true, agents: true, tools: true } }
  }, [
    relationshipHandle('default-view', 'default view', 165),
    relationshipHandle('summary-view', 'summary view', 180),
    relationshipHandle('icon-view', 'icon view', 195),
    relationshipHandle('glyph', 'glyph', 270),
    relationshipHandle('landing-surface', 'landing surface', 0)
  ]),
  node('twilite-subscription-landing', 'content', 'What You Get With Twilite', -250, -760, 720, 420, {
    content: { kind: 'markdown', value: '# What You Get With Twilite\n\n## Browse freely. Subscribe to produce.\n\nPublic graphs remain open to explore and share. The **$15/month** subscription pays for the integrated production environment: repository-backed authoring, dependable persistence, validation, publishing, reusable capabilities, automation, and agent-assisted graph work.\n\nThis graph tells you what that means in practical terms—and where the current limits are.' },
    renderShape: { kind: 'markdown' }
  }),
  node('twilite-subscription-detail-view', 'view', 'Subscription Detail', -900, -250, 420, 300, {
    view: { intent: 'node', payload: 'node.web.detail', semanticLevel: 'detail' }, semanticLevel: 'detail', sourceScope: 'graph', sourceNodeId: 'twilite-subscription-landing', sourcePayload: 'content'
  }),
  node('twilite-subscription-summary-view', 'view', 'Subscription Summary', -900, 100, 380, 240, {
    view: { intent: 'node', payload: 'node.web.summary', semanticLevel: 'summary' }, semanticLevel: 'summary',
    html: '<article style="font-family:system-ui;padding:18px;border-radius:18px;background:linear-gradient(135deg,#172554,#0f766e);color:white"><small style="letter-spacing:.14em">TWILITE PRODUCTION</small><h2 style="margin:.45rem 0">Browse freely. Subscribe to produce.</h2><p style="margin:0;opacity:.86">Repository-backed authoring, persistence, publishing, automation, and agent-assisted graph work.</p></article>'
  }),
  node('twilite-subscription-icon-view', 'view', 'Subscription Icon', -900, 390, 320, 220, {
    view: { intent: 'node', payload: 'node.web.icon', semanticLevel: 'icon' }, semanticLevel: 'icon',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 160"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#312e81"/><stop offset="1" stop-color="#0f766e"/></linearGradient></defs><rect width="240" height="160" rx="28" fill="url(#g)"/><circle cx="88" cy="80" r="34" fill="none" stroke="#ccfbf1" stroke-width="8"/><path d="M88 50v60M58 80h60" stroke="#ccfbf1" stroke-width="8" stroke-linecap="round"/><path d="M145 58h48M145 80h36M145 102h48" stroke="#fff" stroke-width="7" stroke-linecap="round"/></svg>'
  }),
  node('twilite-subscription-glyph', 'glyph', 'Subscription Glyph', -900, -1040, 180, 160, { glyph: { kind: 'character', value: '✦' }, character: '✦', visibilityRole: 'editor' }),

  bridge('twilite-subscription-bridge-hero', 'Hero Card', 'twilite-product-hero', refs.hero, -1380, -450),
  bridge('twilite-subscription-bridge-section', 'Section Card', 'twilite-product-section', refs.section, -1380, -270),
  bridge('twilite-subscription-bridge-proof', 'Proof Card', 'twilite-product-proof', refs.proof, -1380, -90),
  bridge('twilite-subscription-bridge-cta', 'CTA Card', 'twilite-product-cta', refs.cta, -1380, 90),

  node('twilite-subscription-hero', 'twilite-product-hero', 'Production That Keeps Its Shape', 600, -720, 620, 360, {
    eyebrow: 'TWILITE SUBSCRIPTION', title: 'Production That Keeps Its Shape',
    subtitle: 'The subscription is not payment for reading a file. It is payment for the integrated environment that helps people and agents safely build, preserve, publish, and continue graph-native work.',
    badge: '$15 / MONTH', status: 'PUBLIC GRAPHS STAY OPEN', ...bind('twilite-product-hero', refs.hero, 'twilite-subscription-bridge-hero')
  }),
  node('twilite-subscription-authoring', 'twilite-product-section', 'Repository-Backed Authoring', 600, -250, 430, 300, {
    tag: 'AUTHOR', title: 'Work Directly With Durable Repositories', body: 'Connect GitHub, open repository graphs, create and edit nodes, use authored ports and views, validate changes, and save work back to its durable source.',
    ...bind('twilite-product-section', refs.section, 'twilite-subscription-bridge-section')
  }),
  node('twilite-subscription-persistence', 'twilite-product-section', 'Persistence And Publishing', 1080, -250, 430, 300, {
    tag: 'PRESERVE', title: 'Keep Work Addressable And Publishable', body: 'Persist graph changes, commit them with history, resolve durable github:// addresses, publish hosted graph artifacts, and keep navigation and provenance intact across sessions.',
    ...bind('twilite-product-section', refs.section, 'twilite-subscription-bridge-section')
  }),
  node('twilite-subscription-capabilities', 'twilite-product-section', 'Reusable Capabilities', 600, 100, 430, 300, {
    tag: 'EXTEND', title: 'Use Templates, Classes, Scripts, And Bridges', body: 'Install and reuse graph-native capabilities instead of rebuilding every workflow. Compose views, node classes, templates, scripts, bridges, and graph-to-graph references around the work itself.',
    ...bind('twilite-product-section', refs.section, 'twilite-subscription-bridge-section')
  }),
  node('twilite-subscription-agents', 'twilite-product-section', 'Human And Agent Collaboration', 1080, 100, 430, 300, {
    tag: 'COLLABORATE', title: 'Give AI Explicit Structure To Work With', body: 'Let agents inspect the same graph a person sees, operate through bounded graph authority, maintain task and idea structures, and leave durable results instead of another disconnected conversation.',
    ...bind('twilite-product-section', refs.section, 'twilite-subscription-bridge-section')
  }),
  node('twilite-subscription-continuing', 'twilite-product-proof', 'Continuing Value', 600, 450, 430, 300, {
    kicker: 'CONTINUING SERVICE', title: 'The Environment Keeps Improving', body: 'The subscription supports the hosted editor, authenticated repository integration, publication path, maintained runtime, reusable graph capabilities, and ongoing compatibility work.', proof: 'Your graph files remain portable; the managed production workflow is the continuing service.',
    ...bind('twilite-product-proof', refs.proof, 'twilite-subscription-bridge-proof')
  }),
  node('twilite-subscription-limits', 'twilite-product-proof', 'Honest Limits', 1080, 450, 430, 300, {
    kicker: 'CURRENT BOUNDARY', title: 'Beta Software, Not A Done-For-You Service', body: 'Twilite is an actively developed production environment. A subscription does not include custom implementation, guaranteed uptime, unlimited consulting, or a promise that every experimental capability is complete.', proof: 'Public browsing remains free. Paid authority begins where managed repository production begins.',
    ...bind('twilite-product-proof', refs.proof, 'twilite-subscription-bridge-proof')
  }),
  node('twilite-subscription-support', 'twilite-product-section', 'Support Expectations', 600, 800, 430, 300, {
    tag: 'SUPPORT', title: 'Direct Beta Support And Honest Follow-Through', body: 'Subscribers can report defects and workflow friction directly. Beta support focuses on reproducible product problems and clear guidance; bespoke graph design and consulting remain separate conversations.',
    ...bind('twilite-product-section', refs.section, 'twilite-subscription-bridge-section')
  }),
  node('twilite-subscription-trial', 'twilite-product-cta', 'Trial Status', 1080, 800, 430, 300, {
    eyebrow: 'TRIAL STATUS', title: 'One-Month Trial Pending Final Proof', body: 'The trial will be offered only after checkout disclosure, entitlement timing, cancellation, expiration, failed first payment, and post-trial account behavior pass end-to-end verification.', ctaLabel: 'Inspect Trial Readiness', status: 'NOT YET ADVERTISED',
    ...bind('twilite-product-cta', refs.cta, 'twilite-subscription-bridge-cta')
  }),
  node('twilite-subscription-fit', 'twilite-product-cta', 'Is Twilite A Fit?', 840, 1150, 520, 320, {
    eyebrow: 'DECIDE', title: 'Is Twilite Worth Producing With?', body: 'Twilite is a strong fit when your work gains value from durable relationships, repeated human-and-AI collaboration, reusable structure, and public or repository-backed publication. Browse the product story freely before buying.', ctaLabel: 'Open The Product Story', status: 'BROWSE FIRST',
    ...bind('twilite-product-cta', refs.cta, 'twilite-subscription-bridge-cta')
  }),
  node('twilite-subscription-product-portal', 'portal', 'Twilite Product Story', 1480, 1150, 360, 240, {
    authority: 'navigate', intent: 'external', security: 'prompt', sourceRef: 'github://twilite-zone/public/products/twilite/root.node', sourceNodeId: 'twilite-product-view', sourcePayload: 'node.web.summary', surfaceId: 'root',
    target: { ref: 'github://twilite-zone/public/products/twilite/root.node', endpoint: 'github://twilite-zone/public/products/twilite/root.node:root', mode: 'navigate', portId: 'root', surfaceId: 'root', handleId: 'root', label: 'Open Twilite Product Story' }
  }),
  node('twilite-subscription-trial-portal', 'portal', 'Trial Readiness', 1480, 800, 360, 240, {
    authority: 'navigate', intent: 'external', security: 'prompt', sourceRef: 'github://twilite-zone/public/tasks/beta-readiness/payments-readiness/root.node', sourceNodeId: 'payments-readiness-summary', sourcePayload: 'node.web', surfaceId: 'payments-readiness-summary-surface',
    target: { ref: 'github://twilite-zone/public/tasks/beta-readiness/payments-readiness/root.node', endpoint: 'github://twilite-zone/public/tasks/beta-readiness/payments-readiness/root.node:payments-readiness-summary-surface', mode: 'navigate', portId: 'payments-readiness-summary-surface', surfaceId: 'payments-readiness-summary-surface', handleId: 'payments-readiness-summary-surface', label: 'Open Trial Readiness' }
  })
];

const edges = [
  edge('twilite-subscription-edge-default', 'twilite-subscription-declaration', 'default-view', 'twilite-subscription-detail-view', 'root', 'default view', 'default-view'),
  edge('twilite-subscription-edge-summary', 'twilite-subscription-declaration', 'summary-view', 'twilite-subscription-summary-view', 'root', 'summary view', 'shared-summary'),
  edge('twilite-subscription-edge-icon', 'twilite-subscription-declaration', 'icon-view', 'twilite-subscription-icon-view', 'root', 'icon view', 'shared-icon'),
  edge('twilite-subscription-edge-glyph', 'twilite-subscription-declaration', 'glyph', 'twilite-subscription-glyph', 'root', 'glyph', 'shared-glyph'),
  edge('twilite-subscription-edge-landing', 'twilite-subscription-declaration', 'landing-surface', 'twilite-subscription-landing', 'root', 'landing surface', 'landing-surface'),
  edge('twilite-subscription-edge-detail-content', 'twilite-subscription-detail-view', 'root', 'twilite-subscription-landing', 'root', 'content', 'view.content'),
  edge('twilite-subscription-edge-hero-authoring', 'twilite-subscription-hero', 'root', 'twilite-subscription-authoring', 'root', 'includes', 'includes'),
  edge('twilite-subscription-edge-hero-persistence', 'twilite-subscription-hero', 'root', 'twilite-subscription-persistence', 'root', 'includes', 'includes'),
  edge('twilite-subscription-edge-authoring-capabilities', 'twilite-subscription-authoring', 'root', 'twilite-subscription-capabilities', 'root', 'enables', 'enables'),
  edge('twilite-subscription-edge-persistence-agents', 'twilite-subscription-persistence', 'root', 'twilite-subscription-agents', 'root', 'supports', 'supports'),
  edge('twilite-subscription-edge-capabilities-continuing', 'twilite-subscription-capabilities', 'root', 'twilite-subscription-continuing', 'root', 'becomes', 'becomes'),
  edge('twilite-subscription-edge-agents-continuing', 'twilite-subscription-agents', 'root', 'twilite-subscription-continuing', 'root', 'depends on', 'depends-on'),
  edge('twilite-subscription-edge-continuing-limits', 'twilite-subscription-continuing', 'root', 'twilite-subscription-limits', 'root', 'bounded by', 'bounded-by'),
  edge('twilite-subscription-edge-limits-support', 'twilite-subscription-limits', 'root', 'twilite-subscription-support', 'root', 'sets expectations for', 'sets-expectations'),
  edge('twilite-subscription-edge-limits-trial', 'twilite-subscription-limits', 'root', 'twilite-subscription-trial', 'root', 'keeps honest', 'keeps-honest'),
  edge('twilite-subscription-edge-support-fit', 'twilite-subscription-support', 'root', 'twilite-subscription-fit', 'root', 'helps decide', 'helps-decide'),
  edge('twilite-subscription-edge-trial-readiness', 'twilite-subscription-trial', 'root', 'twilite-subscription-trial-portal', 'root', 'verify status', 'navigate'),
  edge('twilite-subscription-edge-fit-product', 'twilite-subscription-fit', 'root', 'twilite-subscription-product-portal', 'root', 'browse product', 'navigate')
];

const graph = {
  fileVersion: '1.0',
  metadata: { title: 'What You Get With Twilite', description: 'Concrete subscriber capabilities, continuing services, honest limits, support expectations, and next steps.', graphId, version: '0.1.0', kind: 'product', tags: ['twilite', 'subscription', 'product', 'customer'] },
  nodes, edges,
  settings: { gridSize: 20, snapToGrid: false, showGrid: false, edgeRouting: 'auto' },
  nodeCount: nodes.length, edgeCount: edges.length,
  timestamp: new Date().toISOString()
};

fs.mkdirSync(__dirname, { recursive: true });
fs.writeFileSync(path.join(__dirname, 'root.node'), `${JSON.stringify(graph, null, 2)}\n`);
console.log(`Wrote ${nodes.length} nodes and ${edges.length} edges.`);
