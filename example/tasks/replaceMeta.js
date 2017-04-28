var path = require('path');
var through = require('through2');

module.exports = function (opts) {

    function embString (template, data) {
        var re = /`\$\$([^`\n]+?)`/g;
        if (re.test(template)) {
            template = template.replace(re, function (substring) {
                var arr = arguments[1].split("@");
                var value = data[arr.shift()];
                return (value !== undefined) ? (arr.length?data[value+"@"].apply(data,arr):value) : substring;
            });
        }
        return template;
    }
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }
        if (file.isStream()) {
            cb(new gutil.PluginError('custom', 'Streaming not supported'));
            return;
        }
        var arr = path.relative(file.base, file.path).split(/[\\/]/);
        arr.pop();
        opts['MODURL'] = opts['STATICURL']+"/"+arr.join("/").replace('.html.js','');
        arr.shift();
        opts['ID'] = arr.join("_").replace('.html.js','');
        //opts['CURURL'] = +"/"+arr.join("/");
       
        var str = String(file.contents);
        str = embString(str, opts);
        file.contents = new Buffer(str);
        cb(null, file);
    });
};
