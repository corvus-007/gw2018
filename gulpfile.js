var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var babel = require('gulp-babel');
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();
var minify = require('gulp-csso');
var include = require('gulp-include');
var sourcemaps = require('gulp-sourcemaps');
var fileinclude = require('gulp-file-include');
var rename = require('gulp-rename');
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var run = require('run-sequence');
var del = require('del');
var ghPages = require('gulp-gh-pages');

gulp.task('style', function () {
  return gulp
    .src('app/scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(
      plumber({
        errorHandler: function (err) {
          console.log(err);
        }
      })
    )
    .pipe(
      sass
        .sync({
          outputStyle: 'expanded'
        })
        .on('error', sass.logError)
    )
    .pipe(
      postcss([
        autoprefixer({
          browsers: ['last 2 version']
        })
      ])
    )
    .pipe(minify())
    .pipe(sourcemaps.write(''))
    .pipe(gulp.dest('public/'))
    .pipe(browserSync.stream());
});

gulp.task('additional-style', () => {
  return gulp
    .src('app/css/additional-style.css')
    .pipe(
      postcss([
        autoprefixer({
          browsers: ['last 2 version']
        })
      ])
    )
    .pipe(gulp.dest('public/'))
    .pipe(browserSync.stream());
});

gulp.task('plugins-js', function () {
  gulp
    .src('app/js/plugins.js')
    .pipe(include())
    .pipe(uglify())
    .pipe(gulp.dest('public/js'))
    .pipe(browserSync.stream());
});

gulp.task('modules-js', function () {
  gulp
    .src(['app/js/modules.js'])
    .pipe(include())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest('public/js'))
    .pipe(browserSync.stream());
});

gulp.task('copy-script', function () {
  gulp
    .src([
      'app/js/*.{js,json}',
      '!app/js/plugins/**',
      '!app/js/modules/**',
      '!app/js/modules.js',
      '!app/js/plugins.js'
    ])
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest('public/js'))
    .pipe(browserSync.stream());
});

gulp.task('fileinclude', function () {
  gulp
    .src('app/*.html')
    .pipe(
      fileinclude({
        indent: true
      })
    )
    .pipe(gulp.dest('public'));
});

gulp.task('copy-images', function () {
  return gulp.src('app/images/**/*').pipe(gulp.dest('public/images'));
});

gulp.task('copy-video', function () {
  return gulp.src('app/video/**/*').pipe(gulp.dest('public/video'));
});

gulp.task('make-symbols', function () {
  return gulp
    .src('public/images/svg-symbols/*.svg')
    // .pipe(svgmin())
    .pipe(
      svgstore({
        inlineSvg: true
      })
    )
    .pipe(rename('symbols.svg'))
    .pipe(gulp.dest('public/images'));
});

gulp.task('copy-fonts', function () {
  return gulp.src('app/fonts/**/*.{woff,woff2}').pipe(gulp.dest('public/fonts'));
});

gulp.task('copy-root-htmls', function () {
  return gulp.src('app/*.html').pipe(gulp.dest('public'));
});

gulp.task('clean', function () {
  return del('public');
});

gulp.task('build', function (fn) {
  run(
    'clean',
    'copy-root-htmls',
    'copy-fonts',
    'copy-images',
    'copy-video',
    'copy-script',
    'style',
    'additional-style',
    'plugins-js',
    'modules-js',
    'fileinclude',
    'make-symbols',
    fn
  );
});

gulp.task('serve', function () {
  browserSync.init({
    server: './public',
    port: 3005
  });

  gulp.watch('app/scss/**/*.scss', function () {
    setTimeout(function () {
      gulp.start('style');
    }, 500);
  });
  gulp.watch('app/css/additional-style.css', function () {
    setTimeout(function () {
      gulp.start('additional-style');
    }, 500);
  });
  gulp.watch('app/fonts/**/*', ['copy-fonts']);
  gulp.watch('app/images/**/*', ['copy-images']);
  gulp.watch('app/video/**/*', ['copy-video']);
  gulp.watch('app/js/*.{js,json}', ['copy-script']);
  gulp.watch('public/images/svg-symbols/*.svg', ['make-symbols']);
  gulp.watch(['app/js/plugins.js', 'app/js/plugins/*.js'], ['plugins-js']);
  gulp.watch(['app/js/modules.js', 'app/js/modules/*.js'], ['modules-js']);
  gulp
    .watch(['app/*.html', 'app/blocks/**/*.html'], ['fileinclude'])
    .on('change', browserSync.reload);
});

gulp.task('deploy', function () {
  return gulp.src('./public/**/*').pipe(ghPages());
});
