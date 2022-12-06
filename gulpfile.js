const gulp            = require('gulp');
const browserSync     = require('browser-sync').create();
const pug             = require('gulp-pug');
const sass            = require('gulp-sass')(require('sass'));
const spritesmith     = require('gulp.spritesmith');
const rimraf          = require('rimraf');
const rename          = require('gulp-rename');
const uglify          = require('gulp-uglify');
const concat          = require('gulp-concat')
const sourcemaps      = require('gulp-sourcemaps');
const plumber         = require('gulp-plumber');
const notify          = require("gulp-notify");
const cssnano         = require('gulp-cssnano');

/* -------- Server  -------- */
gulp.task('server', function() {
  browserSync.init({
    server: {
      port: 9000,
      baseDir: "build"
    }
  });

  gulp.watch('build/**/*').on('change', browserSync.reload);
});

/* ------------ Pug compile ------------- */
gulp.task('templates:compile', function buildHTML() {
  return gulp.src('source/template/index.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('build'))
});

/* ------------ Styles compile ------------- */
gulp.task('styles:compile', function () {
  return gulp.src('source/styles/main.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('build/css'));
});

/* ------------ js ------------- */

/*
gulp.task('js', function () {
  return gulp.src([
    'source/js/main.js'
  ])
    .pipe(sourcemaps.init())
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/js'));

});
*/

/* ------------ libs ------------- */
gulp.task('libs', function() {
  gulp.src([
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
  ])
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/js'));

  return gulp.src([
    './node_modules/bootstrap/dist/css/bootstrap.min.css',
  ])
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(concat('libs.min.css'))
    .pipe(cssnano())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/css'));

});

/* ------------ Sprite ------------- */
gulp.task('sprite', function(cb) {
  const spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: '../images/sprite.png',
    cssName: 'sprite.scss'
  }));

  spriteData.img.pipe(gulp.dest('build/images/'));
  spriteData.css.pipe(gulp.dest('source/styles/global/'));
  cb();
});

/* ------------ Delete ------------- */
gulp.task('clean', function del(cb) {
  return rimraf('build', cb);
});

gulp.task('clean-img', function (cb) {
  return rimraf('build/images', cb);
})

/* ------------ Copy system ------------- */

gulp.task('copy:system', function () {
  return gulp.src([
    './source/system/.htaccess',
])
    .pipe(gulp.dest('build'));
});


/* ------------ Copy fonts ------------- */
gulp.task('copy:fonts', function() {
  return gulp.src('./source/fonts/**/*.*')
    .pipe(gulp.dest('build/fonts'));
});

/* ------------ Copy images ------------- */
gulp.task('copy:images', function() {
  return gulp.src('./source/images/**/*.*')
    .pipe(gulp.dest('build/images'));
});

/* ------------ Copy ------------- */
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images', 'copy:system'));

/* ------------ Watchers ------------- */
gulp.task('watch', function() {
  gulp.watch('source/template/**/*.pug', gulp.series('templates:compile'));
  gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
  //gulp.watch('source/js/**/*.js', gulp.series('js'));
  gulp.watch('source/images/**/*.*', gulp.series('clean-img', 'copy:images'));
});

/*------------- default -------------*/
gulp.task('default', gulp.series(
  'clean',
  gulp.parallel('templates:compile', 'styles:compile','libs', 'sprite', 'copy'),
  gulp.parallel('watch', 'server')
  )
);

/*------------- build -------------*/
gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('templates:compile', 'styles:compile','libs', 'sprite', 'copy')
  )
);
