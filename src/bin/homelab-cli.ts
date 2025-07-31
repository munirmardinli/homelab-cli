#!/usr/bin/env node

/**
 * Homelab CLI Application Class
 *
 * This class serves as the main entry point for the homelab-cli application.
 * It handles the initialization and execution of the CLI application.
 */

class HomelabCLI {
  private static instance: HomelabCLI;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  /**
   * Get the singleton instance of HomelabCLI
   */
  public static getInstance(): HomelabCLI {
    if (!HomelabCLI.instance) {
      HomelabCLI.instance = new HomelabCLI();
    }
    return HomelabCLI.instance;
  }

  /**
   * Initialize the CLI application
   */
  public async initialize(): Promise<void> {
    try {
      console.log('🚀 Initializing Homelab CLI...');
      await import('../index.js');
    } catch (error) {
      this.handleError('Failed to initialize homelab-cli', error);
    }
  }

  /**
   * Handle errors in a consistent way
   */
  private handleError(message: string, error: unknown): never {
    console.error(`❌ ${message}:`, error);
    process.exit(1);
  }

  /**
   * Start the CLI application
   */
  public async start(): Promise<void> {
    try {
      await this.initialize();
    } catch (error) {
      this.handleError('Unhandled error in homelab-cli', error);
    }
  }
}

const cli = HomelabCLI.getInstance();
cli.start().catch((error) => {
  console.error('💥 Fatal error in homelab-cli:', error);
  process.exit(1);
});
