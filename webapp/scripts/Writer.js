
$(function() {
    var $editor = $('.ui-editor');
    var $addSlide = $('.ui-add-slide');
    var $undo = $('.ui-undo');
    var $redo = $('.ui-redo');
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

            var withoutEnd = code.substr(0, code.indexOf('\\end{document}'));

            var linesWithoutEnd = withoutEnd.split(/\r*\n/);

            aceEditor.getSession().insert({row:linesWithoutEnd.length - 1, column: 0}, frameSkeleton);


            //code = code.insertAt(code.indexOf('\\end{document}'),frameSkeleton);

            //aceEditor.getSession().setValue(code);

            // update current Page
            localStorage.currentPage = calculateAmountOfFrames();

            // compile
            SlideTex.Viewer.compile();
        });

        $undo.click(function undoEvent() {
            aceEditor.getSession().getUndoManager().undo();
        });

        $redo.click(function redoEvent() {
            aceEditor.getSession().getUndoManager().redo();
        });

        aceEditor.getSession().on('change', function editorChangeEvent() {

            var undoManager = aceEditor.getSession().getUndoManager();

            setTimeout(function() {
                if(undoManager.hasUndo()) {
                    $undo.removeAttr('disabled');
                }else{
                    $undo.attr('disabled', 'disabled');
                }
                if(undoManager.hasRedo()) {
                    $redo.removeAttr('disabled');
                }else{
                    $redo.attr('disabled', 'disabled');
                }
            }, 100);


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

            SlideTex.Writer.gotInitialized = true;

            initeditor();
            attachEventListeners();
            //insertDefaultTemplate();
            SlideTex.Writer.editor = aceEditor;

        },
        editor: null,
        editorDomSelector: '#editor',
        gotInitialized: false
    };
});