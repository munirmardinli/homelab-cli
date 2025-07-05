import { Cli } from '@homelab-cli/ssh';

import 'dotenv/config';

const cli = new Cli();

function main() {
  cli.run();
}

main();
