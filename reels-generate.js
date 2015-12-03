#!/usr/bin/env node
'use strict'

const program = require('commander')
const rl = require("readline-sync")
const scaffold = require('./scripts/scaffold')

program
  .command('model <name> [columns...]')
  .description('generate model')
  .action((generator,columns)=>{
    console.log(generator)
    console.log(columns)
  })

program
  .command('scaffold <name> [columns...]')
  .option('-t,--type <t>','Type of Application', /^(jsf|rest)$/i, 'jsf')
  .description('generate scaffold')
  .action((name,columns,options)=>{
    console.log(name)
    console.log(columns)
    console.log(options.type)

    let scaff = scaffold.new()
    if(options.type && options.type === 'rest'){
      scaff.generateRest(name,columns)
    }else{
      scaff.generate(name,columns)
    }
  })


program
  .command('view <name> [columns...]')
  .description('generate scaffold')
  .action((generator,columns)=>{
    console.log(generator)
    console.log(columns)
  })

program.parse(process.argv)


if(!program.args.length){
  program.help()
}

function parseObject(d){
  console.log(`parseObject=${d}`)
}