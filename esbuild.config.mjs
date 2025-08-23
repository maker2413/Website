import { build, context } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, cpSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const isWatch = process.argv.includes('--watch');
const isServe = process.argv.includes('--serve');

const outdir = 'dist';

async function copyStatic() {
  mkdirSync(outdir, { recursive: true });
  // Copy resume, images, original content
  cpSync('Content', join(outdir, 'Content'), { recursive: true });
  // Root favicon / logo reference
  mkdirSync(join(outdir, 'images'), { recursive: true });
  cpSync('Content/images/me.svg', join(outdir, 'images/me.svg'));
}

async function buildHTML() {
  const html = readFileSync('src/index.html', 'utf8');
  mkdirSync(outdir, { recursive: true });
  writeFileSync(join(outdir, 'index.html'), html);
}

async function run() {
  await copyStatic();
  await buildHTML();
  const ctx = await build({
    entryPoints: ['src/terminal/main.ts'],
    bundle: true,
    format: 'esm',
    target: ['es2020'],
    outdir: 'dist/assets',
    sourcemap: true,
    minify: !isWatch,
    logLevel: 'info'
  });
  if (isWatch) {
    const c = await context({
      entryPoints: ['src/terminal/main.ts'],
      bundle: true,
      format: 'esm',
      target: ['es2020'],
      outdir: 'dist/assets',
      sourcemap: true,
      minify: false
    });
    await c.watch();
    if (isServe) {
      await c.serve({ servedir: 'dist', port: 5173 });
      console.log('Serving on http://localhost:5173');
    }
  }
}
run();
