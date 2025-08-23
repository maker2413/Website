import { Terminal } from './terminal';
import { commands } from './registry';
import { initTheme } from './theme';

const termEl = document.getElementById('terminal') as HTMLElement;
const outputEl = document.getElementById('terminal-output') as HTMLElement;
const inputEl = document.getElementById('terminal-input') as HTMLInputElement;
const promptSpan = document.getElementById('prompt') as HTMLSpanElement;

initTheme();

const terminal = new Terminal({
  output: outputEl,
  input: inputEl,
  prompt: promptSpan,
  username: 'ethan',
  host: 'portfolio',
  cwd: '~'
});

terminal.register(commands);
terminal.println("Welcome. Type 'help' to begin.");
terminal.renderPrompt();

// Focus handling
termEl.addEventListener('click', () => inputEl.focus());

// Accessibility: Esc to blur for page scroll
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') inputEl.blur();
});
