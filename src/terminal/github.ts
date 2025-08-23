import type { Command } from './types';

interface Repo { name: string; stargazers_count: number; description: string; html_url: string; }

const CACHE_KEY = 'gh_repos_cache_v1';
const TTL = 1000 * 60 * 60 * 6; // 6h

function loadCache() {
  try { const raw = localStorage.getItem(CACHE_KEY); if (!raw) return null; const parsed = JSON.parse(raw); if (Date.now() - parsed.time > TTL) return null; return parsed.data as Repo[]; } catch { return null; }
}
function saveCache(data: Repo[]) { localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), data })); }

async function fetchRepos(): Promise<Repo[]> {
  const cached = loadCache();
  if (cached) return cached;
  const resp = await fetch('https://api.github.com/users/maker2413/repos?per_page=100');
  if (!resp.ok) throw new Error('GitHub fetch failed');
  const data: Repo[] = await resp.json();
  const filtered = data
    .filter(r => !r.name.startsWith('.'))
    .sort((a,b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10);
  saveCache(filtered);
  return filtered;
}

export const githubCommand: Command = {
  name: 'github',
  description: 'List top repositories (cached)',
  run: async (args) => {
    if (args[0] === '--refresh') localStorage.removeItem(CACHE_KEY);
    try {
      const repos = await fetchRepos();
      const lines = repos.map(r => ({ text: `${r.name.padEnd(22)} ★${r.stargazers_count.toString().padEnd(3)} ${r.description? r.description.substring(0, 60): ''}` }));
      return { lines: [{ text: 'Top Repos:'}, ...lines, { text: "Use 'open <repo>' (future) or visit GitHub." }] };
    } catch (e:any) {
      return { lines: [{ text: e.message || 'Error loading repos', className:'error' }] };
    }
  }
};
