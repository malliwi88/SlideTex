var sanitize = require("sanitize-filename");

module.exports = {
    security: function (name) {
        return sanitize(name).split(" ").join("-").replace(/\./g,"");
    },
    latexFile: function (name, withoutExtension) {

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
};