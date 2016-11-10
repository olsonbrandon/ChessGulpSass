var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
    open = require('gulp-open'),
    livereload = require('gulp-livereload'),
    del = require('del');

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
  .pipe(gulp.dest('src/css'))
  .pipe(livereload());
});

gulp.task('moveHtml', function(){
  return gulp.src('src/views/index.html')
  .pipe(gulp.dest('./dist'));
});

gulp.task('moveCss', function(){
  return gulp.src('src/css/styles.css')
  .pipe(gulp.dest('dist/css'));
});

gulp.task('open', ['moveCss', 'moveHtml', 'compileSass', 'uglifyScripts', 'build'], function(){
  return gulp.src('dist/index.html')
  .pipe(open())
  .pipe(livereload({
    reloadPage: 'index.html',
    host: '127.0.0.1',
    port: '8080'
  }));
});

gulp.task('clearTempJs', function(){
  return del([
    'src/js/app.js',
    'src/js/app.min.js'
  ]);
});

gulp.task('watch', function(){
  livereload.listen();
  gulp.watch(['src/js/**.js', 'src/scss/**.scss'], ['uglifyScripts', 'compileSass']);
});

gulp.task('build', ['uglifyScripts', 'clearTempJs', 'compileSass', 'moveCss', 'watch']);

gulp.task('default', ['build', 'open']);
