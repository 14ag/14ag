#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { loadAdminEnv } from './env.mjs';
import { createProjectsApi } from './project-api.mjs';

loadAdminEnv();

const api = createProjectsApi();
const [, , command, ...args] = process.argv;

function usage() {
  console.log(`Usage:
  npm run admin -- list
  npm run admin -- add --json '{"icon":"folder","title":"Name","description":"Desc","techs":["Svelte"],"_url":"https://github.com/user/repo","category":"web"}'
  npm run admin -- add --file project.json
  npm run admin -- delete 1 2 3`);
}

function readJsonArg(values) {
  const jsonIndex = values.indexOf('--json');
  const fileIndex = values.indexOf('--file');

  if (jsonIndex >= 0 && values[jsonIndex + 1]) {
    return JSON.parse(values[jsonIndex + 1]);
  }

  if (fileIndex >= 0 && values[fileIndex + 1]) {
    return JSON.parse(readFileSync(values[fileIndex + 1], 'utf8'));
  }

  throw new Error('Use --json or --file for add.');
}

async function main() {
  if (!command || command === '--help' || command === '-h') {
    usage();
    return;
  }

  if (command === 'list') {
    const payload = await api.listProjects();
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  if (command === 'add') {
    const project = readJsonArg(args);
    const payload = await api.createProject(project);
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  if (command === 'delete') {
    const ids = args.map(Number).filter((id) => Number.isInteger(id) && id >= 0);

    if (ids.length === 0 || ids.length !== args.length) {
      throw new Error('delete needs one or more numeric IDs.');
    }

    const payload = await api.deleteProjects(ids);
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  usage();
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'Unexpected admin CLI error.');
  process.exit(1);
});
