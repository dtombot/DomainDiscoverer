import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const root = process.cwd();
const pages = join(root, 'src/pages');
const blogDir = join(pages, 'blog');
const md = readdirSync(blogDir).filter(name => name.endsWith('.md'));
const files = [
  ...md.map(name => join(blogDir, name)),
  join(pages, 'index.astro'), join(pages, 'blog/index.astro'),
  join(pages, 'domain-availability-checker.astro'), join(pages, 'tools.astro')
];
let errors = [];
for (const file of files) {
  const body = readFileSync(file, 'utf8');
  const links = [...body.matchAll(/\]\((\/(?:blog\/)?[^)\s#?]*)/g)].map(m => m[1]);
  for (const href of links) {
    const route = href.replace(/^\//,'');
    if (!route) continue;
    const candidates = [join(pages, route + '.astro'), join(pages, route + '.md'), join(pages, route, 'index.astro')];
    if (!candidates.some(existsSync)) errors.push(file + ' → missing route ' + href);
  }
  if (file.endsWith('.md')) {
    if (!/description:\s*["']/.test(body)) errors.push(file + ' → missing meta description');
    if (!/layout:\s*\.\.\/\.\.\/layouts\/BlogPost\.astro/.test(body)) errors.push(file + ' → missing article layout');
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('Validated ' + md.length + ' articles and linked Markdown routes.');
