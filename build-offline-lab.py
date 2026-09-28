"""Rebuild the self-contained demo using only the files already in this folder."""
from pathlib import Path
import base64
import json

root = Path(__file__).resolve().parent
samples = {}
for sample in json.loads((root / 'samples/index.original.json').read_text())['samples']:
    samples[sample['id']] = {'title': sample['title'], 'json': json.loads((root / 'samples' / (sample['id'] + '.json')).read_text())}
images = {}
for url, info in json.loads((root / 'research/sample-images.json').read_text()).items():
    if 'file' in info:
        images[url] = 'data:' + info['mime'] + ';base64,' + base64.b64encode((root / info['file']).read_bytes()).decode()

def js(value):
    return json.dumps(value, ensure_ascii=True).replace('<', '\\u003c')

replacements = {
    '__SAMPLES__': js(samples),
    '__IMAGES__': js(images),
    '__PREVIEW_CSS__': js((root / 'third-party/flex2html/css/flex2html.css').read_text()),
    '__RENDERER__': (root / 'third-party/flex2html/js/flex2html.js').read_text().replace('</script', '<\\/script'),
}
html = (root / 'offline-lab.template.html').read_text()
for key, value in replacements.items():
    html = html.replace(key, value)
license_text = (root / 'third-party/flex2html/LICENSE').read_text().replace('--', '—')
html += '\n<!-- flex2html license: preserved with embedded renderer\n' + license_text + '\n-->\n'
(root / 'offline-lab.html').write_text(html)
print('Built offline-lab.html:', len(html.encode()), 'bytes; embedded images:', len(images))
