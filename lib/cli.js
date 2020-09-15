#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const yaml = require('js-yaml');
const inquirer = require('inquirer');
const format = require('string-template');
const { spawn } = require('child_process');
const Router = require('./router');


function runOk(env) {
  const router = new Router(env);
  router.registerRoute('help', require('./routes/help'));
  router.registerRoute('run', require('./routes/run'));

  process.once('exit', router.navigate.bind(router, 'exit'));

  router.updateAvailableGenerators();
  router.navigate('home');
}

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
          // console.log('Validate against', input, hash, param.type)
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

async function navigateCases() {
  try {
    const rec = yaml.safeLoad(fs.readFileSync('./receipts/rsync.yml', 'utf8'));

    let caseSelected = await inquirer
      .prompt([
        {
          type: 'list',
          name: 'caseName',
          message: 'What do you want to do?',
          choices: rec.cases.map(c => c.name),
        }]);
    const theCase = rec.cases.filter(c => c.name === caseSelected.caseName)[0];
    const vars = await compileCase(theCase);
    const cmd = format(theCase.command, vars);
    runCommand(cmd);
  } catch (e) {
    console.log(e);
  }
}

// navigateCases();
// runOk();
(async () => {
  await navigateCases();
})();
