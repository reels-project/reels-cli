#!/usr/bin/env node
'use strict'

const program = require('commander')
const rl = require("readline-sync")
const fs = require('fs-extra')

program
  .version('1.0.0')
  .command('new <name>')
  .alias('n')
  .description('Create new Reels project.')
  .action((name)=>{
    if(fs.existsSync(`./${name}`)){
      console.log(`プロジェクト${name}は既に存在します`)
      return
    }
    console.log(`${name}を作成しています`)
    fs.copySync(`${__dirname}/template/project`, `./${name}`)
    console.log(`${name}を作成しました Use: cd ${name}`)

    //TODO 変更できる設定は対話式で入力させ、プロジェクト設定ファイルとして保存したい。
    //let name = rl.question('What your name? ')
    //console.log(name)
    //let age = rl.question('What your age? ')
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