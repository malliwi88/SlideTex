
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

    function calculateAmountOfFrames() {
        return (aceEditor.getSession().getValue().match(/\\frame{/g) || []).length;
    }


    function attachEventListeners() {

        $addSlide.click(function addSlideEvent() {

            var code = aceEditor.getSession().getValue();

            code = code.insertAt(code.indexOf('\\end{document}'),frameSkeleton);

            aceEditor.getSession().setValue(code);

            // update current Page
            localStorage.currentPage = calculateAmountOfFrames();

            // compile
            SlideTex.Viewer.compile();

            /*
            $editor.animate({
                scrollTop:$editor[0].scrollHeight - $editor.height()
            },100,function(){
                //done
            });
            */
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
});