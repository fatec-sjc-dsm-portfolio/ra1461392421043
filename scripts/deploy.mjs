// Builds the site into docs/ (GitHub Pages: "Deploy from a branch" → main / docs). Commit and push afterwards.
import { execFileSync } from 'node:child_process';
import { copyFileSync, writeFileSync } from 'node:fs';

const remote = execFileSync('git', ['remote', 'get-url', 'origin'], { encoding: 'utf8' }).trim();
const base = `/${remote.replace(/\.git$/, '').split(/[/:]/).pop()}/`;

console.log(`Building for ${base}`);
execFileSync('npm', ['run', 'build', '-w', '@portfolio/web', '--', '--outDir', '../../docs', '--emptyOutDir'], {
  stdio: 'inherit',
  env: { ...process.env, BASE_PATH: base },
});
// GitHub Pages has no SPA rewrites: serve the app for unknown paths too (e.g. /cursoPython)
copyFileSync('docs/index.html', 'docs/404.html');
// plain static files, no Jekyll processing
writeFileSync('docs/.nojekyll', '');
console.log('Site built in docs/. Commit and push to publish.');
