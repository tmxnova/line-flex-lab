import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { FlexToTree, TreeToFlex, FlexTreeEditor, createComponent } from '../reusable/offline-data.mjs';
import { ComponentMetadata } from '../reusable/component-metadata.mjs';
import { parseJsonOffline, toEditorMessages, validateAndRender } from '../reusable/validator-client.mjs';

const samples = new URL('../samples/', import.meta.url);
for (const name of readdirSync(samples).filter(x => x.endsWith('.json') && !x.startsWith('index.'))) {
  test(`original data converters round-trip sample ${name}`, () => {
    const json = JSON.parse(readFileSync(new URL(name, samples)));
    assert.deepEqual(new TreeToFlex().convert(new FlexToTree().convert(json, true)), json);
  });
}

test('add, move and remove nodes without changing the previous tree', () => {
  const json = { type: 'bubble', body: { type: 'box', layout: 'vertical', contents: [{ type: 'text', text: 'first' }] } };
  const original = new FlexToTree().convert(json, true);
  const editor = new FlexTreeEditor(original);
  const body = editor.findByPath('/body').node;
  editor.addNode(body.id, { type: 'text', text: 'second' });
  const secondId = body.children[1].id;
  editor.moveNode(secondId, -1);
  assert.equal(body.children[0].text, 'second');
  editor.removeNode(secondId);
  assert.deepEqual(new TreeToFlex().convert(editor.getRoot()), json);
  assert.deepEqual(new TreeToFlex().convert(original), json);
});

test('server /hero/size error maps to hero image property', () => {
  const tree = new FlexToTree().convert({ type: 'bubble', hero: createComponent('image') });
  const target = new FlexTreeEditor(tree).findByPath('/hero/size');
  assert.equal(target.node.type, 'image');
  assert.equal(target.property, 'size');
  assert.deepEqual(toEditorMessages([{ property: '/hero/size', message: 'invalid property' }]), [
    { path: '/hero/size', text: 'invalid property' },
  ]);
});

test('baseline UI restricts addable components', () => {
  assert.deepEqual(ComponentMetadata.of({ type: 'box', layout: 'baseline' }).addableTypes, ['icon', 'text', 'filler']);
});

test('syntax parsing does not pretend to validate Flex properties', () => {
  assert.equal(parseJsonOffline('{').ok, false);
  assert.equal(parseJsonOffline('{"type":"bubble","size":"BAD"}').ok, true);
});

test('API adapter preserves all LINE error details without network use in tests', async () => {
  const body = { message: 'json parsing error', details: [{ property: '/hero/size', message: 'invalid property' }] };
  const result = await validateAndRender({}, { fetchImpl: async (url, options) => {
    assert.equal(url, '/api/v1/fx/render');
    assert.equal(options.credentials, 'include');
    return new Response(JSON.stringify(body), { status: 400 });
  } });
  assert.deepEqual(result.error, body);
  assert.equal(result.ok, false);
});

test('original bubble conversion limitation is visible, not silently fixed', () => {
  const tree = new FlexToTree().convert({ type: 'bubble', action: { type: 'uri', uri: 'https://example.com' } });
  assert.equal(new TreeToFlex().convert(tree).action, undefined);
});
