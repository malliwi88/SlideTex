var config = {

    // fully qualified path to the pdflatex binary
    pdflatexBinary: '/Library/TeX/Distributions/Programs/texbin/pdflatex',

    // relative path to the output dir from instance
    outputDir: 'webapp/output',

    // relative path to the output dir from the web root
    webappOutputPath: 'output',

    // server port
    serverPort: 8080,

    // filename for the latex and pdf file
    fileName: 'presentation',

    // filepath of the default documents *.tex *.pdf from instance
    defaultDocument: 'webapp/output/default',

    // filepath of the default documents *.tex *.pdf from web root
    webappDefaultDocument: 'output/default'
};

// Settings which can be overwritten by environmental variables
if(process.env.PORT) {
    config.serverPort = process.env.PORT;
}

if(process.env.BINARY) {
    config.pdflatexBinary = process.env.BINARY;
}

module.exports = config;