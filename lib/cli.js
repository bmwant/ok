#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const yaml = require('js-yaml');
const inquirer = require('inquirer');
const format = require('string-template');
const { spawn } = require('child_process');


function runOk(env) {
  const router = new Router(env, insight);
  router.insight.track('yoyo', 'init');
  router.registerRoute('help', require('./routes/help'));
  router.registerRoute('update', require('./routes/update'));
  router.registerRoute('run', require('./routes/run'));
  router.registerRoute('install', require('./routes/install'));
  router.registerRoute('exit', require('./routes/exit'));
  router.registerRoute('clearConfig', require('./routes/clear-config'));
  router.registerRoute('home', require('./routes/home'));

  process.once('exit', router.navigate.bind(router, 'exit'));

  router.updateAvailableGenerators();
  router.navigate('home');
}

function _compileCase() {
  var cmdTemplate = 'rsync -v -e ssh {user}@{host}:{remote_path} {local_path}';
  var vars = {
    user: 'misha',
    host: '49.12.70.136',
    remote_path: '/home/misha/file.txt',
    local_path: '.'
  };
  const cmd = format(cmdTemplate, vars);
  runCommand(cmd);
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
        type: param.type,
        message: param.desc
      })
  });
  return await inquirer.prompt(prompt).then(data => {
    return data;
  });
}

function navigateCases() {
  try {
    const rec = yaml.safeLoad(fs.readFileSync('./receipts/rsync.yml', 'utf8'));
    // console.log(rec);
    rec.cases.forEach(async function(theCase) {
      const vars = await compileCase(theCase);
      const cmd = format(theCase.command, vars);
      runCommand(cmd);
    });
  } catch (e) {
    console.log(e);
  }

  // const resultsPrompt = [{
  //   name: 'toInstall',
  //   type: 'list',
  //   message: 'This is into message',
  //   choices: [{
  //     name: 'Search again',
  //     value: 'install'
  //   }, {
  //     name: 'Return home',
  //     value: 'home'
  //   }]
  // }];

  // inquirer.prompt(resultsPrompt).then(answer => {
  //   console.log(answer);
  // });
}

navigateCases();
