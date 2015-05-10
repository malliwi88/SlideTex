$(function()
{

    var $uploadInput = $('input[type=file]#graphicUpload');
    var $imagesList = $('.ui-images-list');
    var $imagesContainer = $('.ui-images-container');

    // Add events


    $uploadInput.on('change', function(){

        var imageThumbDom = $('<div class="col-sm-6 col-md-4"> <div class="thumbnail"><img src="output/myImage.png" data-dismiss="modal"><div class="caption">' +
            '<p>myImage.png</p></div></div></div>');

        $imagesContainer.append(imageThumbDom);
        $imagesList.slideDown();

        imageThumbDom.click(function() {

            var imageFigureSkeleton = '\\begin{figure}\n' +
                ' \\includegraphics{myImage.png}\n' +
                ' \\caption{Die Abbildung zeigt ein Beispielbild}\n' +
                '\\end{figure}\n' ;

            SlideTex.Writer.editor.insert(imageFigureSkeleton);
        });
    });
});;$(function() {

    var $contentContainer = $('.content-container');

    function resizeVertical() {
        $contentContainer.height($(window).height() - $contentContainer.offset().top - 4);
    }

    SlideTex.Layout = {
        init: function() {
            $(window).resize(function resizeWindowEventHandler() {
                resizeVertical();
            });
            resizeVertical();
        }
    };
});;
$(function() {
    var $editor = $('.ui-editor');
    var $addSlide = $('.ui-add-slide');
    var frameSkeleton = '\\frame{\\frametitle{Mein Titel }\nMein Inhalt\n}\n\n';

    var aceEditor;


    function insertDefaultTemplate() {
        var example = "\\documentclass{beamer} "
            + "\n\\begin{document} "
            + "\n\\title{Simple Beamer Class}    "
            + "\n\\author{Sascha Frank}  "
            + "\n\\date{\\today}  "
            + "\n "
            + "\n\\frame{\\titlepage}  "
            + "\n "
            + "\n "
            + "\n\\frame{\\frametitle{Title}  "
            + "\nEach frame should have a title. "
            + "\n} "
            + "\n "
            + "\n "
            + "\n\\end{document} ";

        $editor.append(example);
    }


    function attachEventListeners() {

        $addSlide.click(function addSlideEvent() {

            var code = aceEditor.getSession().getValue();

            code = code.insertAt(code.indexOf('\\end{document}'),frameSkeleton);

            aceEditor.getSession().setValue(code);
        });
    }

    function setValue(text) {
        aceEditor.getSession().setValue(text);
    }

    function getValue() {
        return aceEditor.getSession().getValue();
    }

    function initeditor() {
        aceEditor = ace.edit("editor");
        aceEditor.setTheme("ace/theme/textmate");
        aceEditor.getSession().setMode("ace/mode/latex");
    }

    SlideTex.Writer = {
        init: function() {
            initeditor();
            attachEventListeners();
            //insertDefaultTemplate();
            SlideTex.Writer.editor = aceEditor;

        },
        editor: null,
        editorDomSelector: '#editor'
    };
});;var SlideTex = {};

String.prototype.insertAt=function(index, string) {
    return this.substr(0, index) + string + this.substr(index);
};;$(function() {

    $( document ).ready(function() {
        SlideTex.Writer.init();

        SlideTex.Layout.init();

    });
});

