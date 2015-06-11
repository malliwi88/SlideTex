
$(function() {
    var $editor = $('.ui-editor');
    var $addSlide = $('.ui-add-slide');
    var $undo = $('.ui-undo');
    var $redo = $('.ui-redo');
    var $itemize = $('.ui-itemize');
    var $enumerate = $('.ui-enumerate');
    var frameSkeleton = '\\frame{\\frametitle{Mein Titel }\nMein Inhalt\n}\n\n';

    var aceEditor;

    function calculateAmountOfFrames() {
        return (aceEditor.getSession().getValue().match(/\\frame{/g) || []).length;
    }


    function attachEventListeners() {

        $addSlide.click(function addSlideEvent() {

            var code = aceEditor.getSession().getValue();

            var withoutEnd = code.substr(0, code.indexOf('\\end{document}'));

            var linesWithoutEnd = withoutEnd.split(/\r*\n/);

            var pos = {row: linesWithoutEnd.length - 1, column: 0};

            aceEditor.getSession().insert(pos, frameSkeleton);

            pos.column = 29
            aceEditor.moveCursorToPosition(pos);
            aceEditor.focus();

            // update current Page
            localStorage.currentPage = calculateAmountOfFrames();

            // compile
            SlideTex.Viewer.compile();
        });

        $itemize.click(function itemize() {
            var currentPos = aceEditor.getCursorPosition();

            var itemize = "\\begin{itemize}\n " +
                          "    \\item \n"+
                          "\\end{itemize}";
            aceEditor.insert(itemize);

            currentPos.row = currentPos.row + 1;
            currentPos.column = 11;
            aceEditor.moveCursorToPosition(currentPos);
            aceEditor.focus();
        });

        $enumerate.click(function enumerate() {
            var currentPos = aceEditor.getCursorPosition();

            var enumerate = "\\begin{enumerate}\n " +
                "    \\item \n"+
                "\\end{enumerate}";
            aceEditor.insert(enumerate);

            currentPos.row = currentPos.row + 1;
            currentPos.column = 11;
            aceEditor.moveCursorToPosition(currentPos);
            aceEditor.focus();
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
            SlideTex.Writer.editor = aceEditor;

        },
        editor: null,
        editorDomSelector: '#editor',
        gotInitialized: false
    };
});