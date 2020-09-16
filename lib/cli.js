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

const program = new Command();

function runCommand(cmd) {
  console.log('Running\n' + chalk.blue(cmd));
  const parts = cmd.split(' ');
  const command = parts[0];
  const args = parts.slice(1);
  const res = spawn(command, args);

  res.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  res.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  res.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

async function compileCase(theCase) {
  var prompt = [];
  theCase.params.forEach(function(param) {
      prompt.push({
        name: param.name,
        validate: (input, answers) => {
          if(input === "") {
            return `Parameter ${chalk.cyan(param.name)} is required`
          }
          return true
        },
        message: param.desc,
        // suffix: 'this is suffix',
        default: param.default
      })
  });
  return await inquirer.prompt(prompt).then(data => {
    return data;
  });
}

async function executeRecipe(recipeName) {
  const recipePath = `./recipes/${recipeName}.yml`;
  if (fs.existsSync(recipePath)) {
    const recipe = yaml.safeLoad(fs.readFileSync(recipePath, 'utf8'));
    return await navigateCases(recipe);
  } else {
    console.error(chalk.red(`No such recipe ${recipeName}.`));
    console.error('Check your spelling of list available recipes using');
    console.error(chalk.blue('\tok list'));
    console.error('For usage examples type');
    console.error(chalk.blue('\tok --help'));
    process.exit(1);
  }
}

async function navigateCases(recipe) {
  let theCase;
  if(recipe.cases.length === 1) {
    theCase = recipe.cases[0];
  } else {
    let caseSelected = await inquirer
      .prompt([
        {
          type: 'list',
          name: 'caseName',
          message: 'What do you want to do?',
          choices: recipe.cases.map(c => c.name),
        }]);
    theCase = recipe.cases.filter(c => c.name === caseSelected.caseName)[0];
  }
  const vars = await compileCase(theCase);
  const cmd = format(theCase.command, vars);
  runCommand(cmd);
}

function listRecipes() {
  const recipesDir = './recipes/';
  fs.readdir(recipesDir, (err, files) => {
    files.forEach(file => {
      // todo: only yml/yaml files
      const recipePath = path.join(recipesDir, file);
      const recipe = yaml.safeLoad(fs.readFileSync(recipePath, 'utf8'));
      console.log(chalk.black.bgCyan(recipe.name.padEnd(10, ' ')) + ` :: ${recipe.desc}`)
    });
  });
}

async function main() {
  program.version('1.0.0')

  program
    .command('run <recipe>', { isDefault: true })
    .description('Launch recipe for program specified')
    .action(executeRecipe);

  program
    .command('list')
    .description('List available recipes')
    .action(listRecipes);

  await program.parseAsync(process.argv);
}

(async () => {
  await main();
})();
