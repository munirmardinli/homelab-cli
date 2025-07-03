import 'dotenv/config';

import { Cli } from './utils/cli.js';

const cli = new Cli();

async function main() {
  await cli.run();
}

main();
