$(function() {

    var $contentContainer = $('.content-container');
    var $bookmarkBox = $('.ui-bookmark');

    function resizeVertical() {
        $contentContainer.height($(window).height() - $contentContainer.offset().top - 4);
    }

    function bookmarkBox() {
        $('.ui-bookmark-link').attr('href', window.location.href).html(window.location.href);

        $('.ui-bookmark .close').click(function() {
            localStorage.bookmark = true
            setTimeout(function() {
                resizeVertical();
            }, 100);
        });

        if(localStorage.bookmark) {
            $bookmarkBox.hide();
        }
    }

    SlideTex.Layout = {
        init: function() {
            $(window).resize(function resizeWindowEventHandler() {
                resizeVertical();
            });



            bookmarkBox();

            resizeVertical();

            i18n.init({
                lngWhitelist: ['de'],
                fallbackLng: 'en'
            }, function(t) {
                // translate nav
                $("body").i18n();
                $('.ui-tooltip').tooltip();
            });

        }
    };
});