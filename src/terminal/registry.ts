import type { Command } from './types';
import { themeCommand, getEffectiveTheme } from './theme';

const about: Command = {
  name: 'about',
  description: 'Short professional summary',
  run: () => {
    const aboutEl = document.querySelector('#about');
    if (!aboutEl) {
      return { lines: [{ text: 'About section not found.' }] };
    }
    const paras = Array.from(aboutEl.querySelectorAll('p'));
    if (!paras.length) {
      return { lines: [{ text: 'No About text available.' }] };
    }
    return {
      lines: paras.map(p => ({ text: (p.textContent || '').trim() }))
    };
  }
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
  run: (_args, term:any) => {
    term.printlnHTML('Resume  : <a href="Content/Resume.pdf" target="_blank" rel="noopener">Resume.pdf</a>');
    term.printlnHTML('GitHub  : <a href="https://www.github.com/maker2413" target="_blank" rel="noopener">github.com/maker2413</a>');
    term.printlnHTML('LinkedIn: <a href="https://www.linkedin.com/in/maker2413/" target="_blank" rel="noopener">linkedin.com/in/maker2413</a>');
    term.printlnHTML('Notes   : <a href="https://notes.ethancpost.com" target="_blank" rel="noopener">notes.ethancpost.com</a>');
    term.printlnHTML('Blog    : <a href="https://blog.ethancpost.com" target="_blank" rel="noopener">blog.ethancpost.com</a>');
    return { lines: [] };
  }
};

const projects: Command = {
  name: 'projects',
  description: 'Highlight a few favorite projects',
  run: () => ({ lines: [
    { text: 'notes     Public notes system published from a Git repo so others can learn from my study process.' },
    { text: 'yacm      Yet another configuration manager to codify machines with YAML, manage packages, services, and custom steps.' },
    { text: 'dotfiles  Linux-first environment, Emacs-centric workflow, and automation around system bootstrap.' },
    { text: 'More      See github: https://www.github.com/maker2413 for additional tinkering projects.' }
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
  description: 'Long-form personal story',
  run: () => ({ lines: [
    { text: 'I love tinkering with computers and various technologies.' },
    { text: 'Over the years I\'ve worked as both a software engineer and a DevOps engineer, and I keep coming back to automation and thoughtful tooling.' },
    { text: 'My favorite personal project so far is my public notes setup, where all of my notes live in a Git repository and are automatically published in a web format so others can learn from them.' },
    { text: 'Another project I\'m proud of is yacm (yet another configuration manager), which lets me codify my machines with simple YAML, manage packages, services, and custom scripts, and keep my systems reproducible.' },
    { text: 'I\'m a huge Emacs fan and write most of my documentation and notes in org-mode. In a perfect world Emacs would be my full operating system, but for now it\'s just most of my computing environment.' },
    { text: 'I\'m also intentional about avoiding intrusive technologies. I daily drive Linux, rarely boot into Windows, and have removed almost all social media from my life in favor of tools and platforms I can trust.' },
    { text: 'Long term, I want to make a living helping advance open source and building technologies that actually improve people\'s lives, even if that means working outside the typical big-tech ecosystem.' }
  ] })
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
  run: async (_args, term: any) => {
    try {
      const response = await fetch('/images/ascii.txt');
      const asciiArt = await response.text();
      const asciiLines = asciiArt.split('\n').filter(line => line.trim());

      const { preference, effective } = getEffectiveTheme();
      const themeLine = preference === 'auto'
        ? `Theme: Adwaita (auto → ${effective})`
        : `Theme: Adwaita (${preference})`;

      const infoLines = [
        'ethan@portfolio',
        '--------------',
        'Role: DevOps / Software Engineer',
        'Shell: fish (emulated)',
        'Editor: emacs',
        themeLine,
        'Favorite: Open source tinkering'
      ];

      const maxLines = Math.max(asciiLines.length, infoLines.length);
      const asciiWidth = Math.max(...asciiLines.map(line => line.length));

      for (let i = 0; i < maxLines; i++) {
        const asciiLine = asciiLines[i] || '';
        const infoLine = infoLines[i] || '';
        const paddedAscii = asciiLine.padEnd(asciiWidth + 2);
        const combinedLine = paddedAscii + infoLine;
        term.println(combinedLine);
      }

      return { lines: [] };
    } catch (error) {
      return { lines: [
        { text: 'ethan@portfolio' },
        { text: '--------------' },
        { text: 'Role: DevOps / Software Engineer' },
        { text: 'Shell: fish (emulated)' },
        { text: 'Editor: emacs' },
        { text: 'Theme: Adwaita' },
        { text: 'Favorite: Open source tinkering' },
        { text: '(ASCII art failed to load)' }
      ] };
    }
  }
};

const make: Command = {
  name: 'make',
  description: 'Easter egg build',
  run: (args) => ({ lines: [ { text: `make: *** No rule to make target '${args[0]||''}'. Stop.` } ] })
};

const theme = themeCommand;

const fastfetch: Command = {
  name: 'fastfetch',
  description: 'Show system summary (alias for neofetch)',
  run: neofetch.run
};

export const commands: Command[] = [help, clear, about, story, links, projects, resume, contact, github, whoami, dateCmd, uname, echo, theme, neofetch, fastfetch, sudo, make];
