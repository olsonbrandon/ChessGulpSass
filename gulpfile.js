var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
    del = require('del'),
    webserver = require('gulp-webserver');

// gulp.task('task-name', function(){
//   stuff here
// });

gulp.task('concatScripts', function(){
  return gulp.src([
    'src/js/chess.js',
    'src/js/pieces.js'
  ])
  .pipe(concat('app.js'))
  .pipe(gulp.dest('src/js'));
});

gulp.task('uglifyScripts', ['concatScripts'], function(){
  return gulp.src('src/js/app.js')
  .pipe(uglify())
  .pipe(rename('app.min.js'))
  .pipe(gulp.dest('dist/js'));
});

gulp.task('compileSass', function(){
  return gulp.src('src/scss/application.scss')
  .pipe(maps.init())
  .pipe(sass())
  .pipe(maps.write('./'))
  .pipe(gulp.dest('src/css'));
});

gulp.task('moveHtml', function(){
  return gulp.src('src/views/index.html')
  .pipe(gulp.dest('./dist'));
});

gulp.task('moveCss', function(){
  return gulp.src('src/css/styles.css')
  .pipe(gulp.dest('dist/css'));
});

gulp.task('webserver', function(){
  return gulp.src('dist')
  .pipe(webserver({
    livereload: true,
    open: true,
  }));
});

gulp.task('clearTempJs', function(){
  return del([
    'src/js/app.js',
    'src/js/app.min.js'
  ]);
});

gulp.task('watch', function(){
  gulp.watch(['src/js/**.js', 'src/scss/**.scss'], ['uglifyScripts', 'compileSass']);
});

gulp.task('build', ['uglifyScripts', 'clearTempJs', 'compileSass', 'moveCss','moveHtml', 'watch']);

gulp.task('default', ['build', 'webserver']);
