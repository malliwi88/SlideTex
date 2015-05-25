var sanitizer = require("./sanitizer.js");
var fs = require('fs');
var mime = require('mime');

module.exports = {
    handle: function (req, res, config) {
        if(req.body.name) {

            var dirName = sanitizer.security(req.body.name);

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
                                    var imageFileName = sanitizer.latexFile(files[i]);
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
    }
};