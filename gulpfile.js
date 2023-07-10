const gulp = require('gulp');
const terser = require('gulp-terser');

const Images = ['src/img/*.jpg'];
const JSFiles = ['src/js/*.js'];

gulp.task('handleImages', cb => {
  Images.forEach(image => gulp.src(image).pipe(gulp.dest('public/img')));
  cb();
});

gulp.task('handleJS', cb => {
  JSFiles.forEach(script =>
    gulp.src(script).pipe(
      terser({
        compress: {},
        mangle: {
          toplevel: true,
        },
        comments: false,
      }).pipe(gulp.dest('public/js'))
    )
  );
  cb();
});

const task = cb => {
  Images.forEach(image => gulp.watch(image, gulp.series('handleImages')));
  JSFiles.forEach(script => gulp.watch(script, gulp.series('handleJS')));
  cb();
};

exports.default = task;
