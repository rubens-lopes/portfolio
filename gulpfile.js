const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const browserSync = require('browser-sync').create();
const fileInclude = require('gulp-file-include');

const stylesPathDist = './dist/styles/';
const stylesPath = './src/styles/**/*.sass';

async function cleanStyles() {
  return await del([stylesPathDist]);
}

function styles(cb) {
  src(stylesPath)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(dest(stylesPathDist))
    .pipe(browserSync.stream());
  cb();
}

function images(cb) {
  src('./src/images/**/*.{svg,png,gif,jpg}')
    .pipe(dest('./dist/images/'));

  cb();
}

const distPath = './dist';
const htmlsPath = './src/**/*.html';

async function cleanHtmls() {
  return await del(['./dist/**/*.html']);
}

function htmls(cb) {
  src(htmlsPath)
    .pipe(fileInclude({
      basepath: './'
    }))
    .pipe(dest(distPath))
    .pipe(browserSync.stream());

  cb();
}

function statics(cb) {
  src(['./src/*.*', '!./src/*.html'])
    .pipe(dest(distPath));

  cb();
}

function watches(cb) {
  watch(stylesPath, series(cleanStyles, styles));
  watch(htmlsPath, series(cleanHtmls, htmls));


  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });

  cb();
}

async function clean() {
  return await del([distPath]);
}

exports.default = series(
  clean,
  parallel(
    statics,
    images,
    styles,
    htmls
  ),
  watches
);