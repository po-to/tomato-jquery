var gulp = require("gulp");
var runSequence = require('run-sequence');
var webpack = require('webpack-stream');
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json", {});
var merge = require("merge2");
var typedoc = require("gulp-typedoc");
var webpack = require('webpack-stream');

gulp.task("tsc", function () {
    var tsResult = gulp.src("./src/**/*.ts")
        .pipe(tsProject())
    return merge([
        tsResult.dts.pipe(gulp.dest("./")),
        tsResult.js.pipe(gulp.dest("./src"))
    ]);
});
gulp.task("tscdoc", function () {
    return gulp.src("./src/**/*.ts")
        .pipe(typedoc({
            module: "amd",
            target: "es6",
            includeDeclarations: true,
            out: "./docs",
            theme : "minimal",
            name: "tomato-jquery",
            excludePrivate: true, 
            excludeExternals: true,
            ignoreCompilerErrors: false,
            version: true,
        }))
});
gulp.task("webpack", function (callback) {
    return gulp.src('src/entry.js')
    .pipe(webpack( require("./webpack.config.js") ))
    .pipe(gulp.dest("./"))
});

gulp.task('build', function (callback) { runSequence('tsc', "webpack", callback) });

gulp.task('default', ["build"]);