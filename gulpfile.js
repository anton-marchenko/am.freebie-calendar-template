const fs = require('fs').promises;
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const base64 = require('gulp-base64-inline');
const header = require('gulp-header');
const browserSync = require('browser-sync').create();

function style() {
    return gulp.src('./scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream())
}

function inlineImage() {
    return gulp.src('./css/**/*.css')
        .pipe(base64())
        .pipe(gulp.dest('./css/'))
}

async function addHeader() {
    const headerText = await fs.readFile('./style-header.txt', 'utf8');

    return gulp.src('./css/**/*.css')
        .pipe(header(headerText))
        .pipe(gulp.dest('./css/'))
}

function watch() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    gulp.watch('./scss/**/*.scss', gulp.series(style, inlineImage, addHeader));
    gulp.watch('./*.html').on('change', browserSync.reload);
}

exports.inline = inlineImage;
exports.style = style;
exports.watch = watch;
