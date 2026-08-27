import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';
import { unpack, buildPngShapes } from '@ultrapowa/sc-tools';

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, '../../commonassets/brawler_effects/effects_brawler_gale.sc');
const projectDir = join(here, 'project_gale');

mkdirSync(projectDir, { recursive: true });

console.log('Unpacking:', src);
await unpack(src, projectDir, { flattenShapes: true });
console.log('Unpacked to:', projectDir);

console.log('Building PNG shapes...');
buildPngShapes(projectDir);
console.log('Done.');
