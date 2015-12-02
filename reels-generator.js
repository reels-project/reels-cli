#!/usr/bin/env node
'use strict'

const program = require('commander')
const rl = require("readline-sync")
const scaffold = require('./scripts/scaffold')

console.log('よばれた')

program
  .command('model <name> [columns...]')
  .description('generate model')
  .action((generator,columns)=>{
    console.log(generator)
    console.log(columns)
  })

program
  .command('scaffold <name> [columns...]')
  .description('generate scaffold')
  .action((name,columns)=>{
    console.log(name)
    console.log(columns)

    let scaff = scaffold.new()
    scaff.generate(name,columns)
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