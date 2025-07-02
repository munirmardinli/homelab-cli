import { Cli } from '@homelab/cli';
import 'dotenv/config';

const cli = new Cli();

async function main() {
  await cli.run();
}

main();
