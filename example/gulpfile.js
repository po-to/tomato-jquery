let gulp = require("gulp");
let runSequence = require('run-sequence');
var changed = require("gulp-changed");
var clean = require('gulp-clean');
let ts = require("gulp-typescript");
var path = require('path');
var rename = require("gulp-rename");
var webpack = require('webpack-stream');
var named = require('vinyl-named');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var childProcess = require('child_process');
var replace = require('gulp-replace');
var package = require('./package.json');
var buildBundleMap = require("./tasks/buildBundleMap");
var buildControllers = require("./tasks/buildControllers");
var replaceMeta = require("./tasks/replaceMeta");
var filter = require('gulp-filter');

var libs = (function(mods){
    var libs = {};
    for(var key in mods){
        libs[key] = "libs/"+key;
    }
    return JSON.stringify(libs);
})(package.viewDependencies)

var argv = require('yargs').argv;
var port = argv.port || "3333";

var metaData = {
    "STATICURL" : "http://192.168.1.62:"+port+"/static",
    "STATICDIST": path.join(process.cwd(),"/dist/node_modules/static").replace(/\\/g,'/'),
    "LIBS" : libs,
    "PORT" : port,
    "ID" : "",
    "MODURL" : ""
}


var config = {
    "SRC" : "./src",
    "DIST" : "./dist",
    "STATIC": "./src/node_modules/static",
    "NODE": "./src/node_modules/node",
    "_STATIC": "./dist/node_modules/static",
    "_NODE": "./dist/node_modules/node"
};
var staticTsProject = ts.createProject(config.STATIC+"/tsconfig.json", {});
var nodeTsProject = ts.createProject(config.NODE+"/tsconfig.json", {});
//var webpackProject = require("./webpack.config.js");

var updateArgs = {
    "static-tsc":'',
    "static-sass" : '',
    "static-files":'',
    "node-tsc":'',
    "node-files":''
};

gulp.task("static-tsc", function () {
    return gulp.src(updateArgs["static-tsc"] || config.STATIC + "/**/*.ts")
        .pipe(changed(config._STATIC, { extension: '.js' }))
        .pipe(replaceMeta(metaData))
        .pipe(staticTsProject())
        .js.pipe(replace(/('(<\$\$)|(\$\$>)'|\/\*(<\$\$)|(\$\$>)\*\/)/g, '$2$3$4$5'))
        .pipe(gulp.dest(config._STATIC));
});
gulp.task("node-tsc", function () {
    return gulp.src(updateArgs["node-tsc"] || config.NODE + "/**/*.ts")
        .pipe(changed(config._NODE, { extension: '.js' }))
        .pipe(replaceMeta(metaData))
        .pipe(nodeTsProject())
        .js.pipe(replace(/('(<\$\$)|(\$\$>)'|\/\*(<\$\$)|(\$\$>)\*\/)/g, '$2$3$4$5'))
        .pipe(gulp.dest(config._NODE));
});
gulp.task('static-sass', function () {
  return gulp.src(updateArgs["static-sass"] || config.STATIC + "/**/*.scss")
    .pipe(changed(config._STATIC, { extension: '.css' }))
    .pipe(replaceMeta(metaData))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(config._STATIC))
});
gulp.task("static-files", function () {
    var fileFilter = filter("**/!(*.+(ts|scss))");
    var codeFilter = filter("**/*.+(js|html|css|json)",{restore: true});
    var otherFilter = filter("**/!(*.+(js|html|css|json))");
    return gulp.src(updateArgs["static-files"] || [config.STATIC + "/**/!(*.+(ts|scss))","!"+config.STATIC + "/**/*.d.*"])
        .pipe(changed(config._STATIC))
        .pipe(fileFilter)
        .pipe(codeFilter)
        .pipe(replaceMeta(metaData))
        .pipe(replace(/('(<\$\$)|(\$\$>)'|\/\*(<\$\$)|(\$\$>)\*\/)/g, '$2$3$4$5'))
        .pipe(gulp.dest(config._STATIC))
        .pipe(codeFilter.restore)
        .pipe(otherFilter)
        .pipe(gulp.dest(config._STATIC))
});
gulp.task("node-files", function () {
    var fileFilter = filter("**/!(*.+(ts))");
    var codeFilter = filter("**/*.+(js|html|json)",{restore: true});
    var otherFilter = filter("**/!(*.+(js|html|json))");
    return gulp.src(updateArgs["node-files"] || [config.NODE + "/**/!(*.+(ts))","!"+config.STATIC + "/**/*.d.*"])
        .pipe(changed(config._NODE))
        .pipe(fileFilter)
        .pipe(codeFilter)
        .pipe(replaceMeta(metaData))
        .pipe(replace(/('(<\$\$)|(\$\$>)'|\/\*(<\$\$)|(\$\$>)\*\/)/g, '$2$3$4$5'))
        .pipe(gulp.dest(config._NODE))
        .pipe(codeFilter.restore)
        .pipe(otherFilter)
        .pipe(gulp.dest(config._NODE))
});
gulp.task("static-libs", function () {
    var files = [];
    var filesMap = {};
    (function(){
        for(var key in package.viewDependencies){
            files.push("./node_modules/"+package.viewDependencies[key]);
            filesMap[package.viewDependencies[key]] = key;
        }
    })()
    return gulp.src(files, { base: './node_modules/'})
        .pipe(changed(config._STATIC,{transformPath:function(newPath){
            var str = filesMap[path.relative(config._STATIC,newPath).replace(/\\/g,'/')];
            return path.join(config._STATIC+"/global/libs/",str+'.js');
        }}))
        .pipe(rename(function (path) {
            var arr = (path.dirname+'/'+path.basename+path.extname).split(/[\\/]/);
            arr = filesMap[arr.join("/")].split("/");
            path.basename = arr.pop();
            path.dirname = arr.join("\\");
        }))
        .pipe(gulp.dest(config._STATIC+"/libs"))
});

gulp.task('clean', function () {
    return gulp.src(config.DIST).pipe(clean());
});
gulp.task("static-bundleMap", function () {//提供给webpack
    return gulp.src([config.STATIC + "/**/*.+(js|ts)", config.STATIC + "/**/*.html.js/index.html", "!"+config.STATIC + "/**/*.*/!(index.*)"])
            .pipe(buildBundleMap({views:package.viewDependencies}))
            .pipe(gulp.dest(config._STATIC))
});
gulp.task("node-controllerMap", function () {
    return gulp.src(config.NODE + "/**/*.con.+(js|ts)")
            .pipe(buildControllers())
            .pipe(gulp.dest(config._NODE))
});


// gulp.task("static-webpack", function (callback) {
//     return gulp.src(config._STATIC + "/**/*.bdl/index.js")
//     .pipe(changed(config._STATIC, {transformPath:function(newPath){
//         return path.dirname(newPath)+".js";
//     }}))
//     .pipe(named(function(file){
//         return path.dirname(path.relative(file.base, file.path));
//     }))
//     .pipe(webpack( (
//         function(){
//             var bundles = require(config._STATIC+'/bundles.json');
//             webpackProject.externals = bundles.statics;
//             return webpackProject;
//         }
//     )() ))
//     .pipe(gulp.dest(config._STATIC))
// });

gulp.task('watch', function (callback) {
    watch([config.STATIC + "/**/*","!"+config.STATIC + "/**/*.d.*"], function(vinyl){
        if(vinyl.event!="change"){
            gulp.start("static-bundleMap");
        }else{
            var str = path.relative(vinyl.base, vinyl.path);
            let task;
            if(vinyl.path.endsWith(".ts")){
                task = 'static-tsc';
            }else if(vinyl.path.endsWith(".scss")){
                task = 'static-sass';
            }else{
                task = 'static-files';
            }
            updateArgs[task] = config.STATIC + "/**/"+str.replace(/\\/g,'/');
            gulp.start(task);
        }
    });
    watch([config.NODE + "/**/*","!"+config.NODE + "/**/*.d.*"], function(vinyl){
        if(vinyl.event!="change"){
            gulp.start("node-controllerMap");
        }else{
            var str = path.relative(vinyl.base, vinyl.path);
            let task;
            if(vinyl.path.endsWith(".ts")){
                task = 'node-tsc';
           }else{
                task = 'node-files';
            }
            updateArgs[task] = config.NODE + "/**/"+str.replace(/\\/g,'/');
            gulp.start(task);
        }
    });
    callback();
})

gulp.task('server', function(callback){
    console.log('server:',"http://192.168.1.62:"+port);
    var server = childProcess.spawn("node-dev",[config._NODE],{shell:true});
    server.stdout.on("data", (data) => {
        console.log(data.toString());
    });
    server.stderr.on('data', function (data) { 
        console.log('服务器错误：\n' + data); 
    }); 
    server.on('exit', function (code, signal) { 
        console.log('服务器已关闭'); 
    }); 
    server.on('error', (err) => {  
        console.log(err);  
    });  
    callback();
});


gulp.task('build', function (callback) { runSequence(["static-bundleMap","node-controllerMap",'static-tsc','node-tsc','static-sass','static-files','node-files','static-libs'],'watch', "server" ,callback) });



gulp.task('default',function() {});