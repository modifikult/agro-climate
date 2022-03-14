const {src, dest, watch, series} = require('gulp')
const gulp = require('gulp')
const del = require('del')
const file_include = require('gulp-file-include')
const sass = require('gulp-sass')(require('sass'))
const autoprefixer = require('gulp-autoprefixer')
const csso = require('gulp-csso')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify-es').default
const browser_sync = require('browser-sync').create()
const concat = require('gulp-concat')

function browsersyncServe(cb) {
    browser_sync.init({
        server: {
            baseDir: 'dist/',
            index: 'services.html'
        },
        port: 3000
    })
    cb()
}

function browsersyncReload(cb) {
    browser_sync.reload();
    cb()
}

function html() {
    return src('src/*.html')
        .pipe(file_include())
        .pipe(dest('dist/'))
}

function css() {
    return src('src/css/*.css')
        .pipe(dest('dist/css/'))
}

function scss() {
    return src('src/scss/*.scss')
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(dest('dist/css/'))
        .pipe(csso())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(dest('dist/css'))
}

function js() {
    return src('src/js/*.js')
        .pipe(dest('dist/js/'))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(dest('dist/js/'))
}

function img() {
    return src('src/img/**/*.{jpg,png,svg}')
        .pipe(dest('dist/img/'))
}


function clean() {
    return del('./dist/')
}

function watchFiles() {
    watch('./src/**/*.html', series(html, browsersyncReload))
    watch('./src/scss/**/*.scss', series(scss, browsersyncReload))
    watch('./src/js/**/*.js', series(js, browsersyncReload))
    watch('./src/css/**/*.*', series(css, browsersyncReload))
    watch('./src/img/**/*.*', series(img, browsersyncReload))
}


exports.default = series(
    clean,
    html,
    css,
    scss,
    js,
    img,
    browsersyncServe,
    watchFiles
)