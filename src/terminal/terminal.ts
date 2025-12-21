import type { Command } from './types';

interface TerminalOpts { output: HTMLElement; input: HTMLInputElement; prompt: HTMLElement; username: string; host: string; cwd: string; }

export class Terminal {
  private output: HTMLElement;
  private input: HTMLInputElement;
  private promptEl: HTMLElement;
  private username: string;
  private host: string;
  private cwd: string;
  private history: string[] = [];
  private historyIndex = 0;
  private commands: Map<string, Command> = new Map();
  private maxLines = 500;

  constructor(opts: TerminalOpts) {
    this.output = opts.output;
    this.input = opts.input;
    this.promptEl = opts.prompt;
    this.username = opts.username;
    this.host = opts.host;
    this.cwd = opts.cwd;
    this.bind();
  }

  private bind() {
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const value = this.input.value.trim();
        this.execute(value);
        this.input.value = '';
      } else if (e.key === 'ArrowUp') {
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.history[this.historyIndex];
          setTimeout(() => this.input.setSelectionRange(this.input.value.length, this.input.value.length), 0);
        }
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex];
        } else {
          this.historyIndex = this.history.length;
          this.input.value = '';
        }
        e.preventDefault();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        this.autocomplete();
      }
    });
  }

  public renderPrompt() {
    this.promptEl.textContent = `${this.username}@${this.host} ${this.cwd} >`;
  }

  public println(text = '', className?: string) {
    const div = document.createElement('div');
    div.className = 'line' + (className ? ` ${className}` : '');
    div.textContent = text;
    this.output.appendChild(div);
    this.trim();
    this.output.scrollTop = this.output.scrollHeight;
  }

  public printlnHTML(html: string, className?: string) {
    const div = document.createElement('div');
    div.className = 'line' + (className ? ` ${className}` : '');
    div.innerHTML = html;
    this.output.appendChild(div);
    this.trim();
    this.output.scrollTop = this.output.scrollHeight;
  }

  private printPromptLine(cmd: string) {
    const div = document.createElement('div');
    div.className = 'line';
    div.innerHTML = `<span class="prompt-frag">${this.username}@${this.host} ${this.cwd} ></span> ${escapeHTML(cmd)}`;
    this.output.appendChild(div);
    this.trim();
  }

  private trim() {
    while (this.output.children.length > this.maxLines) {
      this.output.removeChild(this.output.firstChild!);
    }
  }

  public register(cmds: Command[]) {
    cmds.forEach(c => this.commands.set(c.name, c));
  }

  private autocomplete() {
    const value = this.input.value.trim().toLowerCase();
    const matches = [...this.commands.keys()].filter(c => c.startsWith(value));
    if (matches.length === 1) {
      this.input.value = matches[0] + ' ';
    } else if (matches.length > 1) {
      this.println(matches.join('  '));
    }
  }

  private async execute(raw: string) {
    if (!raw) { this.println(); return; }
    this.printPromptLine(raw);
    this.history.push(raw);
    this.historyIndex = this.history.length;
    const [cmdName, ...args] = raw.split(/\s+/);
    const cmd = this.commands.get(cmdName.toLowerCase());
    if (!cmd) {
      this.println(`Command not found: ${cmdName}`, 'error');
      return;
    }
    try {
      const res = await cmd.run(args, this);
      if (res && res.lines) res.lines.forEach(l => this.println(l.text, l.className));
    } catch (e:any) {
      this.println(e.message || 'Error executing command', 'error');
    }
  }
}

export function escapeHTML(s: string) {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]!));
}
