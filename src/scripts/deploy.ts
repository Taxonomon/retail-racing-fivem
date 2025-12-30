import * as fs from "node:fs";
import path from "node:path";

type DeployEntry = {
  type: 'file' | 'directory';
  source: string;
  target: string;
};

const RESOURCES_DIR = 'D:\\FXServer\\resources\\txn'; //NOSONAR

const deployEntries: DeployEntry[] = [
  // txn_log
  {
    type: 'directory',
    source: '../../build',
    target: path.join(RESOURCES_DIR, 'src'),
  },
  {
    type: 'file',
    source: '../files/fxmanifest.lua',
    target: path.join(RESOURCES_DIR, 'fxmanifest.lua')
  },
  {
    type: 'directory',
    source: '../files/gui',
    target: path.join(RESOURCES_DIR, 'files/gui')
  }
]


function main() {
  if (!fs.existsSync(RESOURCES_DIR)) {
    logInfo(`Resource directory "${RESOURCES_DIR}" does not exist - creating`);
    fs.mkdirSync(RESOURCES_DIR, { recursive: true });
  }

  for (let i = 0; i < deployEntries.length; i++) {
    const entry = deployEntries[i];
    try {
      deploy(entry);
    } catch (error: any) {
      logError(`Failed to deploy entry ${i + 1}/${deployEntries.length}: ${error.message}`);
      fs.rmSync(entry.target, { recursive: true, force: true });
    }
  }
}

function deploy(entry: DeployEntry) {
  if (!fs.existsSync(entry.source)) {
    throw new Error(`source "${entry.source}" does not exist`);
  }

  if (fs.existsSync(entry.target)) {
    fs.rmSync(entry.target, { recursive: true, force: true });
  }

  if ('directory' === entry.type) {
    fs.mkdirSync(entry.target, { recursive: true });
  } else if ('file' === entry.type) {
    const parentDir = entry.target.substring(0, entry.target.lastIndexOf('\\'));
    fs.mkdirSync(parentDir, { recursive: true });
  } else {
    throw new Error(`invalid DeployEntry type: ${entry.type}`);
  }

  fs.cpSync(entry.source, entry.target, { recursive: true, force: true });
  logInfo(`Deployed entry:\n\t- source: ${entry.source}\n\t- target: ${entry.target}`);
}

function logInfo(msg: string) {
  console.log(`[deploy] ${msg}`);
}

function logError(msg: string) {
  console.log(`[deploy] ❌ ${msg}`);
}

main();
