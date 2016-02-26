/**
 * Add css postfix 42px
 * @author Lonefy@foxmail.com
 */
'use strict';

var cssPrefix = require('css-prefix');
var through = require('through2');
var gutil = require('gulp-util');
var minimatch = require("minimatch");
var path = require('path');

module.exports = function(options) {
    options = options || {};
    return through.obj(function(file, enc, cb) {

        var self = this,
            p = file.path.replace(/\\/g, "/");

        if (file.isNull() || path.extname(p) !== '.css') {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError('css_postfix', 'Streaming not supported'));
            return cb();
        }

        var reg = new RegExp(file.base.replace(/\\/g, "/"), 'g');

        p = p.replace(reg, "");

        console.log(p);
        console.log(options.filter)
        console.log(isHas(options.filter, p));
        if (isHas(options.filter, p)) {

            var endLine = p.replace(/\.\w+$/g, ""),
                prefix = ["S", "CSS"].concat(endLine.split('/')).join("_");

            endLine = "#" + prefix + '{height:42px;}';


            var contentString = file.contents.toString();

            if (!!options.prefix === true) {
                contentString = cssPrefix({
                    prefix: "",
                    parentClass: prefix
                }, contentString);
            }

            var content = contentString + endLine;
            file.contents = new Buffer(content);
        }
        self.push(file);
        cb();
    });


    function isHas(filter, text) {
        if (!filter) return false;

        var flag = false;
        filter = [].concat(filter);

        for (var i = 0, len = filter.length; i < len; i++) {

            flag |= minimatch(text, filter[i]);

            if (flag) return true;
        }

        return false;
    }

};