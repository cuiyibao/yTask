let Path = require('path')

module.exports = {
  log: require('./log'),
  getVer() {
    let pkg = Path.join(__dirname, '../package.json')
    return require(pkg).version
  }
}