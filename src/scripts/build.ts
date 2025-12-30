import esbuild from 'esbuild';
import * as fs from "node:fs";
import path from "node:path";

type BuildEntry = {
  source: string;
  target: string;
  esbuildOptions: esbuild.BuildOptions;
};

const MAIN_DIR = '../main';
const BUILD_DIR = '../../build';

const commonEsbuildOptions: esbuild.BuildOptions = {
  bundle: true,
  minify: false,
  sourcemap: false,
  external: [
    '@citizenfx/client/natives_client',
    '@citizenfx/server/natives_server'
  ]
};

const buildEntries: BuildEntry[] = [
  {
    source: path.join(MAIN_DIR, 'client/index.ts'),
    target: path.join(BUILD_DIR, 'client.js'),
    esbuildOptions: {
      ...commonEsbuildOptions,
      target: 'esnext',
      format: 'iife',
      platform: 'node'
    }
  },
  {
    source: path.join(MAIN_DIR, 'server/index.ts'),
    target: path.join(BUILD_DIR, 'server.js'),
    esbuildOptions: {
      ...commonEsbuildOptions,
      target: 'esnext',
      format: 'iife',
      platform: 'node'
    }
  },
  {
    source: path.join(MAIN_DIR, 'gui/index.ts'),
    target: path.join(BUILD_DIR, 'gui.js'),
    esbuildOptions: {
      ...commonEsbuildOptions,
      target: 'esnext',
      format: 'iife',
      platform: 'browser'
    }
  }
];

function main() {
  for (let i = 0; i < buildEntries.length; i++) {
    const buildEntry = buildEntries[i];
    try {
      build(buildEntry);
    } catch (error: any) {
      logError(`Failed to build entry ${i + 1}/${buildEntries.length}: ${error.message}`);
      fs.rmSync(buildEntry.target, { recursive: true, force: true });
    }
  }
}

function build(entry: BuildEntry) {
  if (!fs.existsSync(entry.source)) {
    throw new Error(`source "${entry.source}" does not exist`);
  }

  // remove the previously built target
  if (fs.existsSync(entry.target)) {
    fs.rmSync(entry.target, { recursive: true, force: true });
  }

  esbuild.build({
    ...entry.esbuildOptions,
    entryPoints: [ entry.source ],
    outfile: entry.target
  }).then(() =>
    logInfo(`Successfully built entry: \n\t- source: ${entry.source}\n\t- target: ${entry.target}`)
  ).catch((error: any) => {
    throw new Error(`error whilst trying to build using esbuild: ${error}`)
  });
}

function logInfo(msg: string) {
  console.log(`[build] ${msg}`);
}

function logError(msg: string) {
  console.log(`[build] ❌ ${msg}`);
}

main();
