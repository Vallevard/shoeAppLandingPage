const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const browsersync = require('browser-sync').create();


let styleSrc = 'source/sass/**/*.sass';
// let styleDest = 'build/assets/css/';

// let vendorSrc = 'source/js/vendors/';
// let vendorDest = 'build/assets/js/';
let scriptSrc = 'source/js/*.js';
// let scriptDest = 'build/assets/js/';

// let htmlSrc = 'source/';
// let htmlDest = 'build/';

// Sass Task
function scssTask(){
  return src('source/sass/**/*.sass', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass({
      style: 'compressed'
    }))
    .pipe(postcss([cssnano()]))
    .pipe(rename({
        basename: 'main',
        suffix: '.min'
    }))
    .pipe(dest('build/assets/css', { sourcemaps: '.' }));
}

function imgTask() {
  src('source/img/*')
      .pipe(dest('build/assets/img'));

};


// JavaScript Task
function jsTask(){
  return src('source/js/*.js', { sourcemaps: true })
    .pipe(plumber())
    .pipe(terser())
    .pipe(dest('build/assets/js', { sourcemaps: '.' }));
}

// Browsersync Tasks
function browsersyncServe(cb){
  browsersync.init({
    server: {
      baseDir: './build'
    }
  });
  cb();
}

function browsersyncReload(cb){
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask(){
  watch('build/*.html', browsersyncReload);
  watch([styleSrc, scriptSrc], series(scssTask, jsTask, browsersyncReload));
}

// Default Gulp task
exports.default = series(
  scssTask,
  jsTask,
  browsersyncServe,
  watchTask
);

exports.img = series(
  imgTask
);