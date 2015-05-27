
$(function() {

    $( document ).ready(function() {

        $('#presentationMode,#secondaryPresentationMode').click(function() {
            SlideTex.Tracking.event('viewer', 'present');
        });

        $('#download,#secondaryDownload').click(function() {
            SlideTex.Tracking.event('viewer', 'download');
        });
    });
});