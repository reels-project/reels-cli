'use strict'

const fs = require('fs-extra')
const ejs = require('ejs')

class Scaffold{

  constructor(){
    //this.context = context
    //this.context = {
    //  packageName : 'com.github.yyyy',
    //  javaSrcDir : 'src/main/java',
    //  javaDir : `${this.context.javaSrcDir}/com/github/yyyy`,
    //  javaViewDir : `${this.context.javaDir}/view`,
    //  javaModelDir : `${this.context.javaDir}/model`,
    //  webApps : 'src/main/webapp',
    //  viewDir : `${this.context.webApps}/views`
    //}
    this.packageName = 'com.github.yyyy'
    this.javaSrcDir = 'src/main/java'
    this.javaDir = `${this.javaSrcDir}/com/github/yyyy`
    this.javaViewDir = `${this.javaDir}/view`
    this.javaModelDir = `${this.javaDir}/model`
    this.javaResourceDir = `${this.javaDir}/resource`
    this.webApps = 'src/main/webapp'
    this.viewDir = `${this.webApps}/views`


    this.templateDir = `${__dirname}/../template`
    this.javaTemplate = `${this.templateDir}/java`
    this.xhtmlTemplate = `${this.templateDir}/views`
    this.files = [
      {java:'ListView.java',xhtml:'list.xhtml'},
      {java:'CreateView.java',xhtml:'create.xhtml'},
      {java:'EditView.java',xhtml:'edit.xhtml'},
      {java:'ShowView.java',xhtml:'show.xhtml'}
    ]
    this.inputTypes = {
      'number': ['Double','Long','Integer'],
      'time': ['LocalTime'],
      'datetime-local': ['LocalDateTime'],
      'date': ['LocalDate','Date']
    }
    this.importTypes = {
      'LocalDate': 'java.time.LocalDate',
      'LocalDateTime': 'java.time.LocalDateTime',
      'LocalTime': 'java.time.LocalTime',
      'Date': 'java.util.Date'
    }
    this.inputConveters = {
      'String': 'convertOptionalString',
      'Boolean': 'convertBoolean',
      'Double': 'convertDouble',
      'Long': 'convertLong',
      'Integer': 'convertInteger',
      'LocalTime': 'convertTime',
      'LocalDateTime': 'convertDateTime',
      'LocalDate': 'convertDate',
      'Date': 'convertDate',
    }
  }

  generateRest(targetName,columns){
    const args = this.toArgs(targetName,columns)
    fs.mkdirsSync(this.javaResourceDir)
    fs.mkdirsSync(this.javaModelDir)

    this.renderTemplate(`${this.javaTemplate}/Resource.java`,`${this.javaResourceDir}/${args.targetName2}Resource.java`,args)
    this.renderTemplate(`${this.javaTemplate}/Model.java`,`${this.javaModelDir}/${args.targetName2}Model.java`,args)
  }

  generate(targetName,columns){
    const args = this.toArgs(targetName,columns)
    fs.mkdirsSync(this.javaViewDir)
    fs.mkdirsSync(this.javaModelDir)
    const viewOutDir = `${this.viewDir}/${targetName}`
    fs.mkdirsSync(viewOutDir)

    this.files.forEach((f)=>{
      let javaFile = `${this.javaTemplate}/${f.java}`
      let viewFile = `${this.xhtmlTemplate}/${f.xhtml}`

      this.renderTemplate(javaFile,`${this.javaViewDir}/${args.targetName2 + f.java}`,args)
      this.renderTemplate(viewFile,`${viewOutDir}/${f.xhtml}`,args)
    })

    this.renderTemplate(`${this.javaTemplate}/Model.java`,`${this.javaModelDir}/${args.targetName2}Model.java`,args)
  }

  toArgs(targetName, columns){
    targetName = this.toVarName(targetName)
    columns = columns || []
    console.log(`columns = ${columns}`)
    const cols = columns.map((c)=>this.toColumnObj(c))
    if(!cols.some((e)=>e.name === 'id')){
      cols.unshift({name:'id',javaName:this.toJavaName('id'),javaType:'Long'})
    }
    console.log(`cols = ${cols}`)
    return {
      packageName:this.packageName,
      targetName:targetName,
      targetName2:this.toJavaName(targetName),
      columns:cols,
      importTypes:this.importTypes,
      inputTypes:this.inputTypes,
      inputConveters:this.inputConveters,
      toInputTag:this.toInputTag,
      toInputTagType:this.toInputTagType,
      toOutputTag:this.toOutputTag,
      toConverterTag:this.toConverterTag
    }
  }

  renderTemplate(from,to,args){
    console.log(`from:${from} to:${to}`)
    const str = fs.readFileSync(from)
    const out = ejs.render(str.toString(),args)

    fs.writeFileSync(to,out)
  }

  toJavaName(n){
    let f = n.substring(0,1).toUpperCase()
    return f + n.substring(1,n.length)
  }

  toVarName(n){
    let f = n.substring(0,1).toLowerCase()
    return f + n.substring(1,n.length)
  }

  toColumnObj(s){
    const ss = s.split(':')
    let name = ss[0]
    let type = null
    if(ss.length === 2){
      type = ss[1]
    }
    return {
      name : name,
      javaName : this.toJavaName(name),
      javaType : type || 'String'
    }
  }

  toInputTag(c) {
    switch (c.javaType) {
     case 'Boolean':
       return 'selectBooleanCheckbox'
     default:
       return 'inputText'
    }
  }

  toOutputTag(c) {
    switch (c.javaType) {
     case 'Boolean':
       return 'selectBooleanCheckbox'; break;
     default:
       return 'outputText'
    }
  }

  toInputTagType(c) {
    var type = ''
    for(var t in this.inputTypes){
       if(this.inputTypes[t].indexOf(c.javaType) > -1) {
         type = t;
         break;
       }
    }
    return type == '' ? '' : ` p:type="${type}"`
  }

  toConverterTag(c) {
    return this.inputConveters[c.javaType] ? this.inputConveters[c.javaType] : ''
  }
}

module.exports = {
  new: ()=>new Scaffold()
}

//
////constants
//const templateDir = `${__dirname}/../template`
//const javaTemplate = `${templateDir}/java`
//const xhtmlTemplate = `${templateDir}/views`
//const files = [
//  {java:'ListView.java',xhtml:'list.xhtml'},
//  {java:'CreateView.java',xhtml:'create.xhtml'},
//  {java:'EditView.java',xhtml:'edit.xhtml'},
//]
//
////TODO from settings
//const packageName = 'com.github.yyyy'
//const javaSrcDir = 'src/main/java'
//const javaDir = `${javaSrcDir}/com/github/yyyy`
//const javaViewDir = `${javaDir}/view`
//const javaModelDir = `${javaDir}/model`
//const webApps = 'src/main/webapp'
//const viewDir = `${webApps}/views`
//
////TODO from arguments
//const targetName = 'scaff'
//const mustacheArgs = {
//  title:'Yeah',
//  targetName:targetName,
//  targetName2:toJavaName(targetName),
//  columns:[
//   {name:'id',javaName:toJavaName('id'),javaType:'Long'},
//   {name:'name',javaName:toJavaName('name'),javaType:'String'},
//   {name:'age',javaName:toJavaName('age'),javaType:'Integer'},
//   {name:'sex',javaName:toJavaName('sex'),javaType:'String'}
//  ]
//}
//
//fs.mkdirsSync(javaViewDir)
//fs.mkdirsSync(javaModelDir)
//const viewOutDir = `${viewDir}/${targetName}`
//fs.mkdirsSync(viewOutDir)
//
//files.forEach((f)=>{
//  let javaFile = `${javaTemplate}/${f.java}`
//  let viewFile = `${xhtmlTemplate}/${f.xhtml}`
//
//  renderTemplate(javaFile,`${javaViewDir}/${mustacheArgs.targetName2 + f.java}`,mustacheArgs)
//  renderTemplate(viewFile,`${viewOutDir}/${f.xhtml}`,mustacheArgs)
//})
//
//renderTemplate(`${javaTemplate}/Model.java`,`${javaModelDir}/${mustacheArgs.targetName2}Model.java`,mustacheArgs)
//
//function renderTemplate(from,to,args){
//  console.log(`from:${from} to:${to}`)
//  const str = fs.readFileSync(from)
//  const out = ejs.render(str.toString(),args)
//
//  fs.writeFileSync(to,out)
//}
//
//function toJavaName(n){
//  let f = n.substring(0,1).toUpperCase()
//  return f + n.substring(1,n.length)
//}
