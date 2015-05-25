var fs = require('fs');
var mkdirp = require('mkdirp');
var exec = require('child_process').exec;


module.exports = {
    handle: function (req, res, config) {
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
    }
};