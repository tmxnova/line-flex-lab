/** Community linter, NOT LINE's private validator. Uses the published flex-guard build (plain JS, no TS runtime needed). */
import { readFileSync } from 'node:fs';
import { validate } from '../third-party/flex-guard/dist/src/index.js';
export { validate as lintFlexOffline };

if (process.argv[1] && import.meta.url === new URL(process.argv[1], 'file:').href) {
  if (!process.argv[2]) {
    console.error('Usage: node reusable/lint-offline.mjs samples/restaurant.json');
    process.exitCode = 2;
  } else {
    try {
      const result = validate(JSON.parse(readFileSync(process.argv[2], 'utf8')));
      console.log(JSON.stringify({ engine: 'community flex-guard; NOT LINE 1:1', ...result }, null, 2));
      if (!result.ok) process.exitCode = 1;
    } catch (error) {
      console.error(error.message);
      process.exitCode = 2;
    }
  }
}
