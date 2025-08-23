import type { Command } from './types';
import { themeCommand } from './theme';

const about: Command = {
  name: 'about',
  description: 'Short professional summary',
  run: () => ({ lines: [ { text: 'DevOps & Software Engineer focusing on automation, reliability, and clean tooling.' } ] })
};

const help: Command = {
  name: 'help',
  description: 'List available commands',
  run: (_a, _t) => ({ lines: [ { text: 'Commands:' }, ...commands.map(c => ({ text: `  ${c.name.padEnd(10)} ${c.description}` })) ] })
};

const clear: Command = {
  name: 'clear',
  description: 'Clear the screen',
  run: (_args, term:any) => { term.output.innerHTML=''; return { lines: [] }; }
};

const contact: Command = {
  name: 'contact',
  description: 'Show contact info',
  run: () => ({ lines: [ { text: 'Email: ethancpost@gmail.com' } ] })
};

const links: Command = {
  name: 'links',
  description: 'List external links',
  run: () => ({ lines: [
    { text: 'GitHub: https://www.github.com/maker2413' },
    { text: 'Notes : https://notes.ethancpost.com' },
    { text: 'Blog  : https://blog.ethancpost.com' },
    { text: 'Resume: Content/Resume.pdf' },
    { text: 'Emacs : https://emacs.ethancpost.com' }
  ]})
};

const resume: Command = {
  name: 'resume',
  description: 'Open resume PDF',
  run: () => { window.open('Content/Resume.pdf','_blank'); return { lines: [ { text: 'Opening resume...' } ]}; }
};

const whoami: Command = {
  name: 'whoami',
  description: 'Display user',
  run: () => ({ lines: [ { text: 'ethan' } ] })
};

const dateCmd: Command = {
  name: 'date',
  description: 'Show current date/time',
  run: () => ({ lines: [ { text: new Date().toString() } ] })
};

const uname: Command = {
  name: 'uname',
  description: 'System info',
  run: () => ({ lines: [ { text: 'PortfolioOS 1.0 (js-browser)' } ] })
};

const echo: Command = {
  name: 'echo',
  description: 'Echo arguments',
  run: (args) => ({ lines: [ { text: args.join(' ') } ] })
};

const story: Command = {
  name: 'story',
  description: 'Legacy long-form text placeholder',
  run: () => ({ lines: [ { text: 'Original narrative preserved; will integrate via pager later.' } ] })
};

import { githubCommand as github } from './github';

const sudo: Command = {
  name: 'sudo',
  description: 'Try elevated magic',
  run: (args) => ({ lines: [ { text: `Nice try${args.length? ' ('+args.join(' ')+')' : ''}. You already have sufficient privileges.` } ] })
};

const neofetch: Command = {
  name: 'neofetch',
  description: 'Show system summary',
  run: () => ({ lines: [
    { text: 'ethan@portfolio' },
    { text: '--------------' },
    { text: 'Role: DevOps / Software Engineer' },
    { text: 'Shell: fish (emulated)' },
    { text: 'Editor: emacs' },
    { text: 'Theme: Adwaita (auto)' },
    { text: 'Favorite: Open source tinkering' }
  ] })
};

const make: Command = {
  name: 'make',
  description: 'Easter egg build',
  run: (args) => ({ lines: [ { text: `make: *** No rule to make target '${args[0]||''}'. Stop.` } ] })
};

const theme = themeCommand;

export const commands: Command[] = [help, clear, about, story, links, resume, contact, github, whoami, dateCmd, uname, echo, theme, neofetch, sudo, make];
