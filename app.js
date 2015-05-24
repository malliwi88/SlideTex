var config = {
    caching: false,
    pdflatexBinary: '/Library/TeX/Distributions/Programs/texbin/pdflatex',
    latexDir: 'latex',
    outputDir: 'webapp/output',
    webappOutputPath: 'output',
    serverPort: 8080,
    fileName: 'presentation',
    defaultDocument: 'webapp/output/default',
    webappDefaultDocument: 'output/default'
};

var connect = require('connect');
var bodyParser = require('body-parser');
var fs = require('fs');
var express = require('express');
var app = express();
var multer  = require('multer');
var exec = require('child_process').exec;
var mkdirp = require('mkdirp');
var sanitize = require("sanitize-filename");
var mime = require('mime');

// sanitize fileName for latex
function sanitizeForLatex(name, withoutExtension) {
    var newName = sanitize(name).split(" ").join("-");
    var nameElements = newName.split(".");
    if(withoutExtension) {
        newName = nameElements.join("");
    }else{
        var extension = nameElements.pop();
        newName = nameElements.join("") + '.' + extension;
    }

    return newName
}

// sanitize fileName for latex
function sanitizeForSecurity(name) {
    return sanitize(name).split(" ").join("-").replace(/\./g,"");
}

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
        return sanitizeForLatex(filename, true);
    },
    /**
     * Dynamic change of destination depending on given request url
     * @param {String} dest
     * @param {Object} req
     * @param {Object} res
     * @returns {string}
     */
    changeDest: function(dest, req, res) {
        dest = dest + "/" + sanitizeForSecurity(req.url.replace("/upload/", ""));
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
                    name: sanitizeForLatex(file.name),
                    webPathName: config.webappOutputPath + "/" + sanitizeForSecurity(req.url.replace("/upload/", "")) + "/" + sanitizeForLatex(file.name),
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

    if(req.body.latex && req.body.name) {


        var filename = config.fileName;
        var filenameLatex = filename + ".tex";
        var documentFolder = config.outputDir + "/" + req.body.name + "/";
        var filenameOutputWeb = config.webappOutputPath + "/" + req.body.name + "/" + filename + ".pdf";

        // create document folder if not existing async
        mkdirp(documentFolder, function(err) {

            // write latex file async
            fs.writeFile(documentFolder + filenameLatex, req.body.latex, function(err) {
                if(err) {
                    return console.log(err);
                }

                var command = config.pdflatexBinary + " -interaction=nonstopmode " + filenameLatex + "";

                // exec latex command async
                exec(command, {
                    cwd: documentFolder
                },function(error, stdout, stderr) {

                    // respond
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(
                        {
                            name: filenameOutputWeb,
                            error: Boolean(error),
                            console: stdout
                        }
                    ));
                });
            });

        });

    }
});

app.post('/state', function (req, res) {
    if(req.body.name) {

        var dirName = sanitizeForSecurity(req.body.name);

        fs.exists(config.outputDir + '/' + dirName, function (exists) {

            var documentFileName;
            var webDocumentFileName;
            if(exists){
                var documentFolder = config.outputDir + '/' + dirName;
                documentFileName = documentFolder + "/" + config.fileName;
                webDocumentFileName = config.webappOutputPath + '/' + dirName + "/" + config.fileName;
            }else{
                documentFileName = config.defaultDocument;
                webDocumentFileName = config.webappDefaultDocument;
            }

            // read the latex file
            fs.readFile(documentFileName + '.tex', 'utf8', function (err,data) {

                var outputFilePath = documentFolder + "/" + config.fileName + '.pdf';

                // is something is wrong get default content sync
                if (err) {
                    documentFileName = config.defaultDocument;
                    data = fs.readFileSync(documentFileName + '.tex', 'utf8');
                    webDocumentFileName = config.webappDefaultDocument;
                }

                var images = [];
                if(exists){
                    // get the images
                    fs.readdir(documentFolder, function(err, files) {

                        for(var i=0; i < files.length; i++) {
                            // get mimeType
                            var mimeType = mime.lookup(documentFolder + '/' + files[i]);
                            // check if it's an image
                            if(mimeType && mimeType.split("/").shift() === 'image') {
                                var imageFileName = sanitizeForLatex(files[i]);
                                images.push({
                                    name: imageFileName,
                                    webPathName: config.webappOutputPath + "/" + dirName + "/" + imageFileName,
                                    mimetype: mimeType
                                });
                            }
                        }

                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify(
                            {
                                name: dirName,
                                error: false,
                                latex: data,
                                pdf: webDocumentFileName + '.pdf',
                                images: images
                            }
                        ));
                    });
                }else{
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(
                        {
                            name: dirName,
                            error: false,
                            latex: data,
                            pdf: webDocumentFileName + '.pdf',
                            images: images
                        }
                    ));
                }

            });
        });
    }
});

// run the server
var server = app.listen(config.serverPort);
