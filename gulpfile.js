const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const autoprefixer = require('gulp-autoprefixer')

const ts = require('gulp-typescript')
const tsProject = ts.createProject('./tsconfig.json')

exports.buildStyle = function () {
  return gulp.src('./_assets/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(gulp.dest('_site/style'))
}

exports.buildScript = function () {
  return gulp.src(tsProject.config.include)
    .pipe(tsProject())
    .pipe(gulp.dest(tsProject.config.compilerOptions.outDir))
}