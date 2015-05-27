var config = require('./modules/config');

var connect = require('connect');
var bodyParser = require('body-parser');
var fs = require('fs');
var express = require('express');
var app = express();
var multer  = require('multer');
var exec = require('child_process').exec;
var mkdirp = require('mkdirp');
var mime = require('mime');

var sanitizer = require("./modules/sanitizer.js");
var currentState = require('./modules/currentState.js');
var compile = require('./modules/compile.js');

/**
 * Upload handling of files
 */
var uploadIsDone = false;
app.use(multer({ dest: config.outputDir+'/',
    /**
     * Rename the file
     * @param {String} fieldname
     * @param {String} filename
     * @returns {String}
     */
    rename: function (fieldname, filename) {
        return sanitizer.latexFile(filename, true);
    },
    /**
     * Dynamic change of destination depending on given request url
     * @param {String} dest
     * @param {Object} req
     * @param {Object} res
     * @returns {string}
     */
    changeDest: function(dest, req, res) {
        dest = dest + "/" + sanitizer.security(req.url.replace("/upload/", ""));
        mkdirp.sync(dest);
        return dest;
    },
    onFileUploadComplete: function (file) {
        uploadIsDone=true;
    }
}));

/**
 * Response handling for uploads
 */
app.post('/upload*',function(req,res){
    if(uploadIsDone==true){

        var response = [];
        for(var property in req.files) {
            var file = req.files[property];
            response.push(
                {
                    name: sanitizer.latexFile(file.name),
                    webPathName: config.webappOutputPath + "/" + sanitizer.security(req.url.replace("/upload/", "")) + "/" + sanitizer.latexFile(file.name),
                    mimetype: file.mimetype
                }
            );
        }

        res.set('Content-Type', 'application/json');
        res.end(JSON.stringify(response));
    }
});

/**
 * Serve static files
 */
app.use(express.static('webapp'));

/**
 * Parse the body as json if json given
 */
app.use(bodyParser.json());

/**
 * Handle compile requests
 */
app.post('/compile', function (req, res) {
    compile.handle(req, res, config);
});

app.post('/state', function (req, res) {
    currentState.handle(req, res, config);
});

// run the server
var server = app.listen(config.serverPort);
console.log("Server is listing on port " + config.serverPort);
