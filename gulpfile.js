// gulp
var gulp = require('gulp');

// plugins
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');

// tasks
gulp.task('lint', function() {
  gulp.src(['./client/app/**/*.js', '!./client/app/lib/**'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});
gulp.task('clean', function() {
    gulp.src('./client/dist/*')
      .pipe(clean({force: true}));
    gulp.src('./client/app/js/bundled.js')
      .pipe(clean({force: true}));
});
gulp.task('minify-css', function() {
  var opts = {comments:true,spare:true};
  gulp.src(['./client/app/**/*.css', '!./client/app/lib/**'])
    .pipe(minifyCSS(opts))
    .pipe(gulp.dest('./client/dist/'));
});
gulp.task('minify-js', function() {
  gulp.src(['./client/app/**/*.js', '!./client/app/lib/**'])
    .pipe(uglify({
      // inSourceMap:
      // outSourceMap: /client/app.js.map"
    }))
    .pipe(gulp.dest('./client/dist/'));
});
gulp.task('copy-bower-components', function () {
  gulp.src('./client/app/lib/**')
    .pipe(gulp.dest('./client/dist/lib'));
});
gulp.task('copy-html-files', function () {
  gulp.src('./client/app/**/*.html')
    .pipe(gulp.dest('./client/dist/'));
});
gulp.task('connect', function () {
  connect.server({
    root: './client/',
    port: 8888
  });
});
gulp.task('connectDist', function () {
  connect.server({
    root: './client/dist/',
    port: 9999
  });
});
gulp.task('browserify', function() {
  gulp.src(['./client/app/js/main.js'])
  .pipe(browserify({
    insertGlobals: true,
    debug: true
  }))
  .pipe(concat('bundled.js'))
  .pipe(gulp.dest('./client/app/js'));
});
gulp.task('browserifyDist', function() {
  gulp.src(['./client/app/js/main.js'])
  .pipe(browserify({
    insertGlobals: true,
    debug: true
  }))
  .pipe(concat('bundled.js'))
  .pipe(gulp.dest('./client/dist/js'));
});


// // *** default task *** //
// gulp.task('default',
//   ['lint', 'browserify', 'connect']
// );
// // *** build task *** //
// gulp.task('build',
//   ['lint', 'minify-css', 'browserifyDist', 'copy-html-files', 'copy-bower-components', 'connectDist']
// );

// *** default task *** //
gulp.task('default', function() {
  runSequence(
    ['clean'],
    ['lint', 'browserify', 'connect']
  );
});
// *** build task *** //
gulp.task('build', function() {
  runSequence(
    ['clean'],
    ['copy-html-files', 'copy-bower-components', 'minify-css', 'browserifyDist']
  );
});
// *** dev task *** //
gulp.task('dev', function() {
  gulp.watch(['./client/app/**/*.css', '!./client/app/lib/**'], ['minify-css']);
  gulp.watch(['./client/app/**/*.js', '!./client/app/lib/**'], ['browserifyDist']);
  gulp.watch('./client/app/**/*.html', ['copy-html-files']);
});
// *** build without lint task *** //
gulp.task('simple-build', function() {
  runSequence(
    ['copy-html-files', 'copy-bower-components', 'minify-css', 'browserifyDist']
  );
});
