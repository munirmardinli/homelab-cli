#!/usr/bin/env node

import { execFile } from 'node:child_process';
import os from 'node:os';
import 'dotenv/config';

export class HomelabCli {
  private platform: PlatformType;
  private customCommands: Record<string, CommandDef> = {};
  private readonly allowedCommands = new Set([
    'ls',
    'echo',
    'date',
    'git',
    'docker',
  ]);

  constructor() {
    this.platform = this.detectPlatform();
  }

  private detectPlatform(): PlatformType {
    const nodePlatform = os.platform();
    if (nodePlatform === 'darwin') {
      return 'darwin';
    }
    if (nodePlatform === 'win32') {
      return 'windows';
    }
    if (nodePlatform === 'linux') {
      if (process.env.SYNOLOGY === 'true') {
        return 'synology';
      }
      return 'linux';
    }
    return 'unknown';
  }

  public registerCommand(
    name: string,
    handler: CommandHandler,
    description: string,
  ) {
    if (this.allowedCommands.has(name)) {
      throw new Error(`Command name "${name}" conflicts with built-in command`);
    }
    this.customCommands[name] = { handler, description };
  }

  public run(argv: string[] = process.argv.slice(2)) {
    const [command, ...args] = argv;

    if (!command) {
      this.showHelp();
      return;
    }

    if (this.customCommands[command]) {
      this.customCommands[command].handler();
      return;
    }

    switch (command) {
      case 'info':
        this.showInfo();
        break;
      case 'mac-cmd':
        this.macCmd();
        break;
      case 'win-cmd':
        this.winCmd();
        break;
      case 'syno-cmd':
        this.synoCmd();
        break;
      case 'help':
        this.showHelp();
        break;
      default:
        this.executeSafeCommand(command, args);
        break;
    }
  }

  private executeSafeCommand(command: string, args: string[]) {
    if (!this.isCommandAllowed(command)) {
      console.error(`Error: Command "${command}" is not allowed.`);
      return;
    }

    try {
      const sanitizedArgs = args.map((arg) => this.sanitizeArgument(arg));
      const child = execFile(command, sanitizedArgs, { shell: false });

      child.stdout?.on('data', (data) => {
        process.stdout.write(data);
      });
      child.stderr?.on('data', (data) => {
        process.stderr.write(data);
      });

      child.on('error', (error) => {
        console.error(`Command failed: ${error.message}`);
      });
    } catch (error) {
      console.error(
        `Error executing command: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  private isCommandAllowed(command: string): boolean {
    return this.allowedCommands.has(command);
  }

  private sanitizeArgument(arg: string): string {
    return arg.replace(/[;&|$`]/g, '');
  }

  private showHelp() {
    console.log('homelab-cli - Secure CLI for various platforms\n');
    console.log('Available commands:');
    console.log('  info         Show platform information');
    if (this.platform === 'darwin') {
      console.log('  mac-cmd      macOS specific command');
    }
    if (this.platform === 'windows') {
      console.log('  win-cmd      Windows specific command');
    }
    if (this.platform === 'synology') {
      console.log('  syno-cmd     Synology NAS specific command');
    }
    console.log('  help         Show this help message\n');

    if (Object.keys(this.customCommands).length > 0) {
      console.log('Custom commands:');
      for (const [name, def] of Object.entries(this.customCommands)) {
        console.log(`  ${name.padEnd(12)} ${def.description}`);
      }
    }
  }

  private showInfo() {
    console.log(`Platform: ${this.platform}`);
    console.log(`Node.js: ${process.version}`);
    console.log(`Allowed commands: ${[...this.allowedCommands].join(', ')}`);
  }

  private macCmd() {
    console.log(
      this.platform === 'darwin'
        ? 'macOS specific command executed'
        : 'This command is only available on macOS',
    );
  }

  private winCmd() {
    console.log(
      this.platform === 'windows'
        ? 'Windows specific command executed'
        : 'This command is only available on Windows',
    );
  }

  private synoCmd() {
    console.log(
      this.platform === 'synology'
        ? 'Synology specific command executed'
        : 'This command is only available on Synology NAS',
    );
  }
}

new HomelabCli().run();
