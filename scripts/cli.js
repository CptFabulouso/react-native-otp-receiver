#!/usr/bin/env node

const args = process.argv.slice(2); // Skip "node" and the script name
const command = args[0]; // Get the subcommand (e.g., "get-app-hash")

switch (command) {
  case 'get-app-hash':
    // Example: Call another script or run the logic inline
    require('./get-app-hash.js');
    break;

  default:
    console.error(`Unknown command: ${command}`);
    console.log('Available commands: get-app-hash');
    process.exit(1);
}
