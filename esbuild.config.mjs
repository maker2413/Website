import { build, context } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, cpSync, watch } from 'fs';
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
  // Copy styles (static CSS)
  cpSync('src/styles', join(outdir, 'styles'), { recursive: true });
  // Root favicon / logo reference
  mkdirSync(join(outdir, 'images'), { recursive: true });
  cpSync('Content/images/me.svg', join(outdir, 'images/me.svg'));
  cpSync('src/terminal/ascii.txt', join(outdir, 'images/ascii.txt'));
}

async function buildHTML() {
  const html = readFileSync('src/index.html', 'utf8');
  mkdirSync(outdir, { recursive: true });
  writeFileSync(join(outdir, 'index.html'), html);
}

function watchStatic() {
  const rerun = async () => {
    try {
      await copyStatic();
      await buildHTML();
      console.log('[static] updated');
    } catch (e) {
      console.error('[static] error', e);
    }
  };

  // Watch root content, styles, and index.html
  watch('Content', () => { void rerun(); });
  watch('src/styles', () => { void rerun(); });
  watch('src/index.html', () => { void rerun(); });
}
 
async function run() {
  await copyStatic();
  await buildHTML();

  if (isWatch) {
    watchStatic();
    const c = await context({
      entryPoints: ['src/terminal/main.ts'],
      bundle: true,
      format: 'esm',
      target: ['es2020'],
      outdir: 'dist/assets',
      sourcemap: true,
      minify: false,
      logLevel: 'info'
    });
    await c.watch();
    if (isServe) {
      await c.serve({ servedir: 'dist', port: 5173 });
      console.log('Serving on http://localhost:5173');
    }
  } else {
    await build({
      entryPoints: ['src/terminal/main.ts'],
      bundle: true,
      format: 'esm',
      target: ['es2020'],
      outdir: 'dist/assets',
      sourcemap: true,
      minify: true,
      logLevel: 'info'
    });
  }
}
run();
