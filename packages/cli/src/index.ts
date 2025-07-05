#!/usr/bin/env node

import { exec } from 'node:child_process';
import os from 'node:os';
import 'dotenv/config';

export class HomelabCli {
  private platform: PlatformType;
  private customCommands: Record<string, CommandDef> = {};

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
    this.customCommands[name] = { handler, description };
  }

  public run(argv: string[] = process.argv.slice(2)) {
    const command = argv[0];
    if (typeof command === 'string' && this.customCommands[command]) {
      this.customCommands[command].handler();
      return;
    }
    const shellCmd = argv.join(' ');

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
      case undefined:
        this.showHelp();
        break;
      default:
        // eslint-disable-next-line security/detect-child-process
        exec(shellCmd, (error, stdout, stderr) => {
          if (error) {
            console.error(stderr || error.message);
          } else {
            process.stdout.write(stdout);
          }
        });
        break;
    }
  }

  private showHelp() {
    console.log(
      'homelab-cli - CLI für verschiedene Distributionen (darwin, windows, synology, etc.)',
    );
    console.log('Verfügbare Kommandos:');
    console.log('  info         Zeigt Plattform-Informationen an');
    if (this.platform === 'darwin') {
      console.log('  mac-cmd      Nur für macOS');
    }
    if (this.platform === 'windows') {
      console.log('  win-cmd      Nur für Windows');
    }
    if (this.platform === 'synology') {
      console.log('  syno-cmd     Nur für Synology NAS');
    }
    console.log('  help         Zeigt diese Hilfe an');
    for (const [name, def] of Object.entries(this.customCommands)) {
      console.log(`  ${name}    ${def.description}`);
    }
  }

  private showInfo() {
    console.log(`Plattform: ${this.platform}`);
    console.log(`Node.js Version: ${process.version}`);
  }

  private macCmd() {
    if (this.platform === 'darwin') {
      console.log('Dies ist ein macOS-spezifischer Befehl.');
    } else {
      console.log('Dieses Kommando ist nur auf macOS verfügbar.');
    }
  }

  private winCmd() {
    if (this.platform === 'windows') {
      console.log('Dies ist ein Windows-spezifischer Befehl.');
    } else {
      console.log('Dieses Kommando ist nur auf Windows verfügbar.');
    }
  }

  private synoCmd() {
    if (this.platform === 'synology') {
      console.log('Dies ist ein Synology-spezifischer Befehl.');
    } else {
      console.log('Dieses Kommando ist nur auf Synology NAS verfügbar.');
    }
  }
}

new HomelabCli().run();
