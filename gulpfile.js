/*
 * @Description: glup
 * @Author: yb001
 * @Date: 2019-05-23 17:20:08
 * @LastEditTime: 2019-06-13 18:53:22
 * @LastEditors: yb001
 */
const gulp = require("gulp")
const less = require("gulp-less")
const changed = require("gulp-changed")
const rename = require("gulp-rename")
const babel = require("gulp-babel")
const minify = require("gulp-minify")
const sourcemaps = require("gulp-sourcemaps")
const { exec } = require("child_process")
const build = require("./lib/build")
const utils = require("./utils/utils")
const moment = require("moment")
const log = utils.log

const entryPath = build.getInputPaths()

const outputPath = "dist/"

gulp.task("clear", function() {
  console.log("\x1b[31m%s\x1b[0m", " 🚚 🚚 🚚 🚚 🚚  <==== Remove dist")
  exec("rm -rf " + outputPath, (err, stdout, stderr) => {
    if (err) {
      console.log(err)
      return
    }
  })
})

gulp.task("move", function() {
  console.log("\x1b[32m%s\x1b[0m", " 🚚 🚚 🚚 🚚 🚚 <==== Move file to dist")
  return gulp
    .src(build.movePath(entryPath))
    .pipe(changed(outputPath))
    .pipe(gulp.dest(outputPath))
})

gulp.task("less", function() {
  console.log("\x1b[31m%s\x1b[0m", " 🚧 🚧 🚧 🚧 🚧  <==== Less compiling")
  return gulp
    .src(build.getPath(entryPath, ".less"))
    .pipe(changed(outputPath))
    .pipe(less())
    .pipe(
      rename({
        extname: ".wxss"
      })
    )
    .pipe(gulp.dest(outputPath))
})

gulp.task("js", function() {
  console.log(
    "\x1b[31m%s\x1b[0m",
    " 🚧 🚧 🚧 🚧 🚧  <==== Javascript compiling "
  )
  return gulp
    .src(build.getPath(entryPath, ".js"))
    .pipe(sourcemaps.init())
    .pipe(changed(outputPath))
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(
      minify({
        noSource: true,
        ext: {
          min: ".js"
        }
      })
    )
    .pipe(sourcemaps.write("./sourceMaps"))
    .pipe(gulp.dest(outputPath))
})

gulp.task('npm', function() {
  console.log('\x1b[32m%s\x1b[0m', ' 🚚 🚚 🚚 🚚 🚚 <==== Compiling node_modules')
  gulp.src(['./src/node_modules/**/*.js',])
    .pipe(gulp.dest('./dist/miniprogram_npm/'))
})

gulp.task("watchLess", function() {
  gulp.watch(build.getPath(entryPath, ".less"), ["less"])
})

gulp.task("watchJs", function() {
  gulp.watch(build.getPath(entryPath, ".js"), ["js"])
})

gulp.task("watchMove", function() {
  gulp.watch(build.movePath(entryPath), ["move"])
})

gulp.task("watch", ["watchLess", "watchJs", "watchMove"], () => {
  log.tag("正在监听中...")
})

gulp.task("dev", ["move", "less", "js", "npm", "watch"], () => {
  log.tag("正在监听中...")
})
gulp.task("build", ["move", "less", "js", "npm"], () => {
  log.tag("编译完成")
})

module.exports = gulp