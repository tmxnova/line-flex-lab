import { readFileSync } from 'node:fs';
import { FlexToTree, TreeToFlex, FlexTreeEditor, createComponent } from './offline-data.mjs';
import { ComponentMetadata } from './component-metadata.mjs';

const sample = JSON.parse(readFileSync(new URL('../samples/restaurant.json', import.meta.url)));
const tree = new FlexToTree().convert(sample, true);
const editor = new FlexTreeEditor(tree);
const body = editor.findByPath('/body').node;
editor.addNode(body.id, { ...createComponent('text'), text: 'แก้ไขในเครื่องโดยไม่ใช้อินเทอร์เน็ต' });
console.log(JSON.stringify({
  allowedBodyChildren: ComponentMetadata.of(body).addableTypes,
  result: new TreeToFlex().convert(editor.getRoot()),
}, null, 2));
