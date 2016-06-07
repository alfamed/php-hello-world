'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    cleanCSS = require('gulp-clean-css'),
    browserSync = require("browser-sync"),
    connect = require('gulp-connect-php'),
    reload = browserSync.reload,
    bower = require('gulp-bower'),
    mainBowerFiles = require('main-bower-files'),
    rimraf = require('rimraf'),
    jshint = require("gulp-jshint");

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        lib: 'build/lib'
    },
    src: {
        html: 'src/*.html',
        php: 'src/*.php',
        js: 'src/js/main.js',
        jshint: 'src/js/**/*.js',
        style: 'src/style/main.scss'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss'
    },
    clean: './build'
};

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
    gulp.src(path.src.php)
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('php:build', function () {
    gulp.src(path.src.php)
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('jshint:build', function() {
    return gulp.src(path.src.jshint)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefixer())
        .pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('bower:install', function() {
    return bower();
});

gulp.task("main-bower-files:build", function(){
    return gulp.src(mainBowerFiles())
        .pipe(gulp.dest(path.build.lib))
});

gulp.task('build', [
    'html:build',
    'jshint:build',
    'js:build',
    'style:build'
]);

gulp.task('watch', function(){
    watch([path.watch.html], function() {
        gulp.start('html:build');
    });
    watch([path.watch.style], function() {
        gulp.start('style:build');
    });
    watch([path.watch.js], function() {
        gulp.start('jshint:build');
    });
    watch([path.watch.js], function() {
        gulp.start('js:build');
    });
});

gulp.task('php', function() {
    connect.server({ base: 'build', port: 8010, keepalive: true});
});

gulp.task('webserver',['php'], function() {
    browserSync({
        proxy: '127.0.0.1:8010',
        port: 8080,
        open: true,
        notify: false
    });
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);