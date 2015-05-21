$(function() {

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
            $('.ui-tooltip').tooltip();
        }
    };
});