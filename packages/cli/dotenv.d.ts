declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SYNOLOGY?: string;
    }
  }
  type PlatformType = 'darwin' | 'windows' | 'linux' | 'synology' | 'unknown';
  interface CommandDef {
    handler: CommandHandler;
    description: string;
  }
  type CommandHandler = () => void;
}

export {};
