'use strict';
var autoprefixer     = require('gulp-autoprefixer');
var babel            = require('gulp-babel');
var browserSync      = require('browser-sync').create();
var concat           = require('gulp-concat');
var cssmin           = require('gulp-cssmin');
var fs               = require('fs');
var gulp             = require('gulp');
var gulpif           = require("gulp-if");
var jsmin            = require('gulp-jsmin');
var notify           = require("gulp-notify");
var path             = require('path');
var plumber          = require('gulp-plumber');
var prompt           = require('prompt');
var rename           = require('gulp-rename');
var sass             = require('gulp-sass');
var sassGlob         = require('gulp-sass-glob');
var sassLint         = require('gulp-sass-lint');
var sourcemaps       = require("gulp-sourcemaps");
var spritesmith      = require('gulp.spritesmith');
var stripCssComments = require('gulp-strip-css-comments');
var watch            = require('gulp-watch');
var sassLintConf     = require('./sass-lint');
var config           = require('./config');

var $sprites = [
  './images/icons/*.png'
];

var $css = [
  './dist/main.css'
];

var $js = [
  './js/custom.js',
  './js/food.js',
  './js/matrix.js',
  './js/snake.js',
  './js/start.js',
];

/* Local setup */
gulp.task('config', function (cb) {
  prompt.get('target', function (err, result) {
    if (err) console.log(err);
    else {
      fs.writeFileSync(path.join(__dirname, 'config.json'), JSON.stringify(result));
    }
    cb();
  });
});

/* Sprites */
gulp.task('sprite', function () {
  return  gulp.src($sprites)
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: '_sprite.scss',
      padding: 1
    }))
    .pipe(gulpif('*.png', gulp.dest('./dist/')))
    .pipe(gulpif('*.scss', gulp.dest('./sass/mixins/')));
});

/* Min CSS */
gulp.task('css_min', ['sass'], function () {
  gulp.src($css)
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./dist'))
    .pipe(cssmin({path: './dist/main.css'}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist'));
});

/* Min JS */
gulp.task('js_min', function () {
  gulp.src($js)
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(jsmin({path: './dist/main.js'}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist'))
});

/* CSS concat*/
gulp.task('css_concat', ['sass', 'sass_lint'], function () {
  gulp.src($css)
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./dist'));
});

/* JS concat */
gulp.task('js_concat', function () {
  gulp.src($js)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .on("error", function(error) {
      var args = Array.prototype.slice.call(arguments);
      notify.onError("Babel error: <%= error.message %>").apply(this, args);
      this.emit("end");
    })
    .pipe(sourcemaps.write())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./dist'));
});

/* Linter */
gulp.task('sass_lint', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sassLint({
      options: sassLintConf.options,
      files: sassLintConf.files,
      rules: sassLintConf.rules,
      configFile: 'sass-lint.yml'
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

/* Main SASS task */
gulp.task('sass', function () {
  return gulp.src(['./sass/**/*.s*ss'])
    .pipe(plumber(({
      errorHandler: notify.onError('SASS error: <%= error.message %>')
    })))
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(stripCssComments())
    .pipe(sass({
      style: 'expanded',
      sourceComments: 'map',
      sourceMap: 'sass',
      outputStyle: 'nested',
    }))
    .pipe(sass.sync())
    .pipe(concat({ path: './main.css'}))
    .pipe(autoprefixer({
      browsers: ['last 5 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

/* Watch */
gulp.task('watch', ['css_concat', 'js_concat', 'sprite'], function() {
  browserSync.init({
    server: {
      baseDir: "./",
      index: "index.html"
    }
  });

  watch(['./images/icons/'], function(event, cb) {
    gulp.start('sprite');
  });

  watch(['./sass/**/*.s*ss'], function(event, cb) {
    gulp.start('css_concat');
  }).on('change', browserSync.reload);

  watch(['./js/*.js'], function(event, cb) {
    gulp.start('js_concat');
  }).on('change', browserSync.reload);
});

/* Default task */
gulp.task('default', ['watch']);

/* Default task */
gulp.task('compile', ['css_concat', 'js_concat', 'sprite']);

/* Live task */
gulp.task('live', ['compile', 'css_min', 'js_min']);
