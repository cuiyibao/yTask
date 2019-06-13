const fs = require("fs")
const Path = require("path")

let filesList = []

const hasFile = function(path) {
  let dirList = fs.readdirSync(path)
  let boo = false
  dirList.forEach(function(item) {
    let r = fs.statSync(path + '/' + item)
    if (r.isDirectory() || r.isFile()) {
      boo = true
    }
  })
  return boo
}

const walk = function(path) {
  if (hasFile(path)) {
    filesList.push(path)
  }
  let dirList = fs.readdirSync(path)
  dirList.forEach(function(item) {
    let newPath = path + '/' + item
    let r = fs.statSync(newPath)
    if (r.isDirectory()) {
      walk(newPath)
    }
  })
  return filesList
}

const getMaxOfArray = function(numArray) {
  return Math.max.apply(null, numArray)
}

module.exports = {
  getInputPaths: function () {
    walk("src")
    let maxArr = []
    filesList && filesList.forEach(function(t, i) {
      maxArr.push(t.split('/').length)
    })
    let maxLen = getMaxOfArray(maxArr)
    let inputPath = []
    let str = 'src'
    for (let i = maxLen; i >= 0; i--) {
      str += '/*'
      inputPath.push(str)
    }
    return inputPath
  },
  movePath: function(inputPath){
    let arr = [].concat(inputPath)
    let lessPath = this.getPath(inputPath, '.less')
    lessPath.forEach(function(t, i){
      arr.push('!' + t)
    })
    let jsPath = this.getPath(inputPath, '.js')
    jsPath.forEach(function(t, i){
      arr.push('!' + t)
    })
    arr.push('!src/node_modules/', '!src/node_modules/**')
    return arr
  },
  getPath: function(inputPath, format) {
    let newArr = []
    inputPath.forEach(function(t, i) {
      newArr.push(t + format)
    })
    newArr.push('!src/node_modules/', '!src/node_modules/**')
    return newArr
  }
}