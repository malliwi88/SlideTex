

$(function() {

    var $compileSlides = $('.ui-compile-slides');
    var $frameContainer = $('.frame-container');
    var $compileSlidesAuto = $('.ui-compile-slides-auto');


    function buildData() {
        return JSON.stringify(
            {
                latex: SlideTex.Writer.editor.getValue(),
                name: 'testabc'
            }
        );
    }

    function processData(data) {
        if(data.name) {
            var viewerUrl = 'viewer.html?file=' + data.name;

            if(localStorage.currentPage) {
                viewerUrl += '#page=' + localStorage.currentPage;
            }

            $frameContainer.html('<iframe class="frame" src="'+viewerUrl+'" allowfullscreen webkitallowfullscreen></iframe>');
        }
    }

    function compile() {

        $frameContainer.addClass('activity');
        $compileSlides.find('.fa').addClass('fa-spin');


        $.ajax({
            url: 'http://localhost:8080/api',
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
            compile();
        });

        // compile when user checked auto
        $compileSlidesAuto.click(function() {
            if($(this).prop('checked')) {
                compile();
            }
        });

        // execute after every key up, compile when auto is checked and user didn't change anything since duration
        $(SlideTex.Writer.editorDomSelector).keyup(function() {
            delay(function(){
                if($compileSlidesAuto.prop('checked')) {
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
        init: function() {
            attachEventListeners();
            appendCompileButtonLabel();
        },
        compile: compile
    };
});