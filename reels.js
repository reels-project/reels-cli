#!/usr/bin/env node
'use strict'

const program = require('commander')
const rl = require("readline-sync")

program
  .version('1.0.0')
  .command('new <name>')
  .option('-p, --package','Java package name.')
  .alias('n')
  .description('Create new eee projects.')
  .action((cmd,options)=>{
    console.log(`command ${cmd} executed. options=${options}`)
    let name = rl.question('What your name? ')
    console.log(name)
    let age = rl.question('What your age? ')
  })

program
  .command('generate <generator> [columns...]','generate sources')
  //TODO commander's bug.=> alias doesn't work with git-style commands #419
  //.alias('g')
  //.description('generate sources')

program
  .command('server')
  .alias('s')
  .option('-p,--port <n>','number of port',parseInt)
  .action((options)=>{
    console.log(`Sorry..This command is not ready.. port=${options.port}`)
  })

program.parse(process.argv)


if(!program.args.length){
  program.help()
}

function parseObject(d){
  console.log(`parseObject=${d}`)
}