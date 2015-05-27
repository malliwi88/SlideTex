

$(function() {

    var $compileSlides = $('.ui-compile-slides');
    var $viewContainer = $('.view-container');
    var $frameContainer = $('.frame-container');
    var $errorContainer = $('.error-container');
    var $errorLog = $('.error-content');
    var $compileSlidesAuto = $('.ui-compile-slides-auto');


    function buildData() {
        return JSON.stringify(
            {
                latex: SlideTex.Writer.editor.getValue(),
                name: SlideTex.id
            }
        );
    }

    function escapeHtml(text) {
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;',
            "\n": '<br>'
        };

        return text.replace(/[&<>"'\n]/g, function(m) { return map[m]; }).split(" ").join("&nbsp;");
    }

    function buildFrame(name) {
        var viewerUrl = 'viewer.html?file=' + name;

        if(localStorage.currentPage) {
            viewerUrl += '#page=' + localStorage.currentPage;
        }
        $frameContainer.find('.frame').remove();

        $frameContainer.prepend('<iframe class="frame" src="'+viewerUrl+'" allowfullscreen webkitallowfullscreen></iframe>');
        return true;
    }

    function processData(data) {

        // if latex compiling failed
        if(data.error) {

            SlideTex.Tracking.event('compile', 'error', SlideTex.id);

            $viewContainer.addClass('error-present');
            // add error log and scroll down to last line
            $errorLog.html(escapeHtml(data.console));
            $errorContainer.animate({ scrollTop: $errorContainer[0].scrollHeight}, 350);
            return false;
        }

        $viewContainer.removeClass('error-present');
        if(data.name) {
            return buildFrame(data.name);
        }
    }

    function compile() {

        $frameContainer.addClass('activity');
        $compileSlides.find('.fa').addClass('fa-spin');

        $.ajax({
            url: '/compile',
            method: 'POST',
            contentType: 'application/json',
            data: buildData()
        }).done(function(data, textStatus, jqXHR) {
                processData(data);
                $frameContainer.removeClass('activity');
                $compileSlides.find('.fa').removeClass('fa-spin');
        });
    }

    function attachEventListeners() {
        $compileSlides.click(function() {
            SlideTex.Tracking.event('compile', 'compiling', 'button');
            compile();
        });

        // compile when user checked auto
        $compileSlidesAuto.click(function() {
            if($(this).prop('checked')) {
                compile();
                SlideTex.Tracking.event('compile', 'auto', 'enabled');
            }else{
                SlideTex.Tracking.event('compile', 'auto', 'disabled');
            }
        });

        // execute after every key up, compile when auto is checked and user didn't change anything since duration
        $(SlideTex.Writer.editorDomSelector).keyup(function() {
            delay(function(){
                if($compileSlidesAuto.prop('checked')) {
                    SlideTex.Tracking.event('compile', 'compiling', 'auto');
                    compile();
                }
            }, 2500 );
        });

        $(document).keydown(function(event) {
                // If Control or Command key is pressed and the S key is pressed
                // run save function. 83 is the key code for S.
                if((event.ctrlKey || event.metaKey) && event.which == 83) {
                    // Save Function
                    event.preventDefault();

                    SlideTex.Tracking.event('compile', 'compiling', 'shortcut');
                    compile();
                    return false;
                };
            }
        );
    }

    function appendCompileButtonLabel() {

        var labelSuffix = 'CTRL+S';
        if (navigator.appVersion.indexOf("Win")!=-1) labelSuffix="Windows";
        if (navigator.appVersion.indexOf("Mac")!=-1) labelSuffix="CMD+S";

        $compileSlides.append(' (' + labelSuffix + ')');
    }


    var delay = (function(){
        var timer = 0;
        return function(callback, ms){
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
        };
    })();


    SlideTex.Viewer = {
        init: function(fileName) {
            attachEventListeners();
            appendCompileButtonLabel();
            if(fileName) {
                buildFrame(fileName);
            }
        },
        compile: compile
    };
});