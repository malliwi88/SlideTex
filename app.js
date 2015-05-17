var config = {
    caching: false,
    pdflatexBinary: '/Library/TeX/Distributions/Programs/texbin/pdflatex',
    latexDir: 'latex',
    outputDir: 'webapp/output',
    webappOutputPath: 'output',
    serverPort: 8080
};

var connect = require('connect');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var fs = require('fs');

var express = require('express');
var app = express();

var multer  = require('multer');

var exec = require('child_process').exec;

var uploadIsDone = false;
app.use(multer({ dest: config.outputDir+'/',
    rename: function (fieldname, filename) {
        return filename;
    },
    onFileUploadComplete: function (file) {
        uploadIsDone=true;
    }
}));

app.post('/upload',function(req,res){
    if(uploadIsDone==true){

        var response = [];
        for(var property in req.files) {
            var file = req.files[property];
            response.push({name: file.name, mimetype: file.mimetype});
        }

        res.set('Content-Type', 'application/json');
        res.end(JSON.stringify(response));
    }
});

app.use(express.static('webapp'));

app.use(bodyParser.json());

app.post('/api', function (req, res) {

    if(req.body.latex && req.body.name) {

        var filenameLatex = req.body.name + ".tex";
        var filenameOutput = config.webappOutputPath + "/" + req.body.name + ".pdf";

        fs.writeFile(config.outputDir + "/" + filenameLatex, req.body.latex, function(err) {
            if(err) {
                return console.log(err);
            }

            var command = config.pdflatexBinary + " -interaction=nonstopmode " + filenameLatex + "";

            exec(command, {
                cwd: config.outputDir
            },function(error, stdout, stderr) {
                res.setHeader('Content-Type', 'application/json');

                res.send(JSON.stringify(
                    {
                        name: filenameOutput,
                        error: Boolean(error),
                        console: stdout
                    }
                ));
            });
        });
    }
});

var server = app.listen(config.serverPort);
