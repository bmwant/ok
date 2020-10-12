#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const yaml = require('js-yaml');
const inquirer = require('inquirer');
const format = require('string-template');
const { spawn } = require('child_process');
const { Command } = require('commander');
const { resolveHome } = require('./utils');

var glob = require("glob")


async function main() {
  // program.version('0.0.1';)

  // program
  //   .command('run <recipe>', { isDefault: true })
  //   .description('Launch recipe for program specified')
  //   .action(executeRecipe);

  // program
  //   .command('list')
  //   .description('List available recipes')
  //   .action(listRecipes);

  // await program.parseAsync(process.argv);
  glob("**/*.md", function (er, files) {
    files.forEach(f => {
      console.log(f);
    });
  })

}

(async () => {
  await main();
})();
