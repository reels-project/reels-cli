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
  .option('-f,--file <f>','File Path')
  .description('generate scaffold')
  .action((name,columns,options)=>{
    console.log(name)
    console.log(columns)
    console.log(options.type)
    console.log(options.file)

    if(options.file) columns = columns.concat(readFile(options.file))

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

// support Yaml Only
function readFile(path){
  var fs = require('fs')
  var props = require('props')

  try {
    var fd = fs.readFileSync(path,'utf8')
    var data = props(fd)
  }
  catch (e) {
    console.log(e)
    // continue
    return []
  }

  var attrs = ['type']
  var columns = []
  for(var key in data){
      // 何故か最後にゴミ情報がつくので除外
      if(key == '__content') continue
      columns.push(parseColumn(data, key, attrs))
  }
  return columns
}

function parseColumn(data,key,attrs){
  var col = key
  attrs.forEach((attr)=>{
    var a = data[key][attr]
    if(a) col += ':' + data[key][attr]
  })
  return col
}
