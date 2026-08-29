const fs = require('fs');
const path = require('path');

const subscriptionRef = 'github://twilite-zone/public/products/twilite/subscription/root.node';
const productPath = path.resolve(__dirname, '..', 'root.node');
const launchPath = path.resolve(__dirname, '..', '..', '..', 'tasks', 'beta-readiness', 'launch-content', 'root.node');

const product = JSON.parse(fs.readFileSync(productPath, 'utf8'));
const portal = product.nodes.find((node) => node.id === 'twilite-product-subscription-boundary');
if (!portal) throw new Error('Missing product subscription portal');
portal.label = 'What You Get With Twilite';
portal.data = {
  ...portal.data,
  memo: 'Open the customer-facing account of concrete subscriber capabilities, continuing service, limits, and support expectations.',
  authority: 'consume-view',
  sourceRef: subscriptionRef,
  sourceNodeId: 'twilite-subscription-summary-view',
  sourcePayload: 'node.web.summary',
  surfaceId: 'root',
  ref: subscriptionRef,
  src: subscriptionRef,
  endpoint: `${subscriptionRef}:root`,
  target: {
    ...(portal.data?.target || {}),
    endpoint: `${subscriptionRef}:root`, ref: subscriptionRef, mode: 'navigate',
    portId: 'root', surfaceId: 'root', handleId: 'root', label: 'Open What You Get With Twilite'
  }
};
product.timestamp = new Date().toISOString();

const launch = JSON.parse(fs.readFileSync(launchPath, 'utf8'));
const task = launch.nodes.find((node) => node.id === 'launch-content-task-posts');
const summary = launch.nodes.find((node) => node.id === 'launch-content-summary');
if (!task || !summary) throw new Error('Missing launch task or summary');
task.data = {
  ...task.data,
  artifactRef: subscriptionRef,
  artifactNodeId: 'twilite-subscription-declaration',
  nextAction: 'Review the first-pass subscriber-value graph in Twilite, refine the promise and limits, then publish it as the canonical buying-decision surface.',
  progressNote: 'A modern first-pass customer graph now exists and is connected from the Twilite product story. Visual and offer review remain before completion.'
};
summary.data = {
  ...summary.data,
  nextAction: 'Review and refine the first-pass What You Get With Twilite graph, then implement and verify the one-month Stripe trial before outreach.',
  updatedAt: new Date().toISOString()
};
launch.timestamp = new Date().toISOString();

fs.writeFileSync(productPath, `${JSON.stringify(product, null, 2)}\n`);
fs.writeFileSync(launchPath, `${JSON.stringify(launch, null, 2)}\n`);
console.log('Wired the subscriber graph into the product story and launch task.');
