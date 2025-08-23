export interface CommandResultLine { text: string; className?: string; }
export interface CommandResult { lines?: CommandResultLine[]; }
export interface Command { name: string; description: string; run(args: string[], term: any): Promise<CommandResult>|CommandResult; }
